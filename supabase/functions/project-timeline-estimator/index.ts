import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';

const RequestSchema = z.object({
  service_type: z.enum(['renovation', 'deck', 'new_build', 'fencing', 'landscaping']),
  job_description: z.string().min(10),
  quote_id: z.string().uuid().optional(),
  start_date: z.string().optional(),
});

const MilestoneSchema = z.object({
  week: z.number().int().positive(),
  phase: z.string(),
  tasks: z.array(z.string()),
  deliverable: z.string(),
  dependencies: z.array(z.string()).default([]),
});

const TimelineOutputSchema = z.object({
  total_weeks: z.number().int().positive(),
  council_wait_weeks: z.number().int().nonnegative().default(0),
  consent_required: z.boolean(),
  milestones: z.array(MilestoneSchema).min(1),
  notes: z.string().nullable().optional(),
});

const TIMELINE_SYSTEM_PROMPT = `You are a project manager for AKF Construction, an Auckland residential builder and landscaper.

Generate a week-by-week project timeline for the described construction or landscaping project.

Respond with JSON only:
{
  "total_weeks": number,
  "council_wait_weeks": 0,
  "consent_required": true | false,
  "milestones": [
    {
      "week": 1,
      "phase": "string — phase name",
      "tasks": ["task 1", "task 2"],
      "deliverable": "string — what is complete at end of this week",
      "dependencies": ["optional dependency description"]
    }
  ],
  "notes": "string | null"
}

TIMELINE GUIDELINES:
- Deck (simple, < 20m²): 2-3 weeks. No consent if < 1.5m high.
- Deck (complex, > 20m² or > 1.5m high): 4-6 weeks. Auckland Council consent: +8-12 weeks wait.
- Fencing: 1-2 weeks. No consent for standard boundary fences.
- Landscaping: 2-6 weeks depending on scope.
- Renovation (bathroom/kitchen): 4-8 weeks. Potential consent for structural changes.
- New Build: 20-52 weeks. Always requires consent (+8-16 weeks council processing).

CONSENT DETECTION:
- Set consent_required: true if the work exceeds standard exemption thresholds
- Add council_wait_weeks (8-16 for building consent, 0 if exempt)
- Include council processing as a milestone if consent_required: true

Keep milestones realistic — one week of tasks at a time. Professional NZ construction standards.`;

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200 });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ data: null, error: parsed.error.flatten() }, { status: 400 });
    }

    const model = Deno.env.get('OPENROUTER_MODEL') ?? 'anthropic/claude-3.5-sonnet';

    const userMessage = `Service type: ${parsed.data.service_type}
${parsed.data.start_date ? `Requested start date: ${parsed.data.start_date}` : ''}

Project description:
${parsed.data.job_description}`;

    const llmRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': Deno.env.get('SUPABASE_URL') ?? '',
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: TIMELINE_SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!llmRes.ok) {
      console.error('[project-timeline-estimator][openrouter]', llmRes.status);
      return Response.json({ data: null, error: 'LLM request failed' }, { status: 502 });
    }

    const llmJson = await llmRes.json();
    const raw = JSON.parse(llmJson.choices[0].message.content);
    const timelineParsed = TimelineOutputSchema.safeParse(raw);

    if (!timelineParsed.success) {
      console.error('[project-timeline-estimator][zod]', JSON.stringify(timelineParsed.error.flatten()));
      return Response.json({ data: null, error: 'Invalid timeline output' }, { status: 422 });
    }

    const timeline = timelineParsed.data;

    if (parsed.data.quote_id) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      );

      const { data: quote } = await supabase
        .from('quotes')
        .select('ai_notes')
        .eq('id', parsed.data.quote_id)
        .single();

      await supabase
        .from('quotes')
        .update({
          ai_notes: { ...((quote?.ai_notes as object) ?? {}), timeline },
          project_timeline_weeks: timeline.total_weeks,
        })
        .eq('id', parsed.data.quote_id);
    }

    console.log(`[project-timeline-estimator] service_type=${parsed.data.service_type} total_weeks=${timeline.total_weeks} consent=${timeline.consent_required}`);

    return Response.json({ data: timeline, error: null });
  } catch (err) {
    console.error('[project-timeline-estimator][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});
