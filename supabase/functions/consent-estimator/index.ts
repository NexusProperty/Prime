import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { z } from 'npm:zod@3';

const RequestSchema = z.object({
  project_type: z.string().min(3),
  project_value_cents: z.number().int().nonnegative(),
  height_m: z.number().nonnegative().optional(),
  area_m2: z.number().positive().optional(),
  suburb: z.string().optional(),
});

const CONSENT_TRIGGERS = [
  'structural', 'wall removal', 'wall addition', 'beam', 'new build', 'extension',
  'retaining wall', 'drainage', 'plumbing', 'deck', 'addition',
];

const RESOURCE_CONSENT_TRIGGERS = [
  'height limit', 'boundary setback', 'character zone', 'heritage',
];

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200 });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ data: null, error: parsed.error.flatten() }, { status: 400 });
    }

    const { project_type, project_value_cents, height_m, area_m2, suburb } = parsed.data;

    const projectLower = project_type.toLowerCase();
    const consentTriggerHit = CONSENT_TRIGGERS.some((t) => projectLower.includes(t));
    const resourceTriggerHit = RESOURCE_CONSENT_TRIGGERS.some((t) => projectLower.includes(t));
    const heightTrigger = (height_m ?? 0) > 1.5;
    const areaTrigger = (area_m2 ?? 0) > 10 && (projectLower.includes('extension') || projectLower.includes('new build'));
    const deckHeightTrigger = projectLower.includes('deck') && (height_m ?? 0) > 1.5;

    const consent_required = consentTriggerHit || heightTrigger || areaTrigger || deckHeightTrigger;
    const consent_type = consent_required && resourceTriggerHit ? 'both'
      : resourceTriggerHit ? 'resource_consent'
      : consent_required ? 'building_consent'
      : 'none';

    let estimated_council_fee_cents = 0;
    if (consent_required) {
      if (project_value_cents < 2000000) estimated_council_fee_cents = 250000;
      else if (project_value_cents < 10000000) estimated_council_fee_cents = 500000;
      else estimated_council_fee_cents = 900000;
    }

    const estimated_processing_weeks = consent_type === 'both' ? 8
      : consent_type === 'resource_consent' ? 12
      : consent_type === 'building_consent' ? 4
      : 0;

    const notes = consent_required
      ? `Building consent likely required for ${project_type}. ${suburb ? `In ${suburb}, ` : ''}Auckland Council processing time is typically ${estimated_processing_weeks} working weeks. AKF Construction manages the full application process.`
      : `Based on the description, building consent is unlikely required for ${project_type}. However, confirm with AKF Construction before proceeding — scope changes may trigger consent requirements.`;

    return Response.json({
      data: {
        consent_required,
        consent_type,
        estimated_council_fee_cents,
        estimated_processing_weeks,
        notes,
        disclaimer: 'This is an estimate only. Actual fees determined by Auckland Council at time of application.',
      },
      error: null,
    });
  } catch (err) {
    console.error('[consent-estimator][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});
