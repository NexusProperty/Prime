import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';

const RequestSchema = z.object({
  lead_id: z.string().uuid(),
  job_description: z.string().min(5),
  service_type: z.string(),
  quote_id: z.string().uuid().optional(),
});

const CLEANJET_TRIGGERS = [
  'post-build', 'post build', 'renovation', 'builder clean', 'construction clean',
  'completion', 'handover', 'move in', 'move-in', 'new build',
];

const ELECTRICAL_TRIGGERS = [
  'electrical', 'power point', 'lighting', 'switchboard', 'wiring',
  'ev charger', 'solar', 'heat pump',
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

    const { lead_id, job_description, service_type, quote_id } = parsed.data;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const descLower = job_description.toLowerCase();
    const opportunities: Array<{ brand: 'cleanjet' | 'prime'; pitch: string }> = [];

    if (CLEANJET_TRIGGERS.some((t) => descLower.includes(t))) {
      opportunities.push({
        brand: 'cleanjet',
        pitch: `AKF ${service_type} project — post-build/renovation clean opportunity for CleanJet`,
      });
    }

    if (ELECTRICAL_TRIGGERS.some((t) => descLower.includes(t))) {
      opportunities.push({
        brand: 'prime',
        pitch: `AKF ${service_type} project mentions electrical work — referral opportunity for Prime Electrical`,
      });
    }

    const insertedEvents = [];
    for (const opp of opportunities) {
      const { data: event } = await supabase.from('cross_sell_events').insert({
        lead_id,
        source_brand: 'akf',
        target_brand: opp.brand,
        pitch: opp.pitch,
        status: 'triggered',
      }).select('id').single();

      if (event) insertedEvents.push(event.id);

      if (opp.brand === 'cleanjet') {
        const crossSellUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/cross-sell-to-cleanjet`;
        fetch(crossSellUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({
            cross_sell_event_id: event?.id,
            lead_id,
          }),
        }).catch((e) => console.error('[bundle-analyzer-akf][cross-sell-fire]', e));
      }
    }

    console.log(`[bundle-analyzer-akf] lead_id=${lead_id} opportunities=${opportunities.length} events=${insertedEvents.length}`);

    return Response.json({
      data: {
        opportunities_detected: opportunities.length,
        cross_sell_event_ids: insertedEvents,
        signals: opportunities.map((o) => ({ brand: o.brand, pitch: o.pitch })),
      },
      error: null,
    });
  } catch (err) {
    console.error('[bundle-analyzer-akf][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});
