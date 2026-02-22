import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { z } from 'npm:zod@3';
import { checkIdempotency, insertQuoteWithLineItems, type LLMQuoteOutput } from '../_shared/quotes.ts';

const RequestSchema = z.object({
  renovation_type: z.array(z.string()).min(1),
  property_bedrooms: z.number().int().min(1),
  area_m2: z.number().positive().optional(),
  construction_dust_level: z.enum(['light', 'medium', 'heavy']),
  extras_needed: z.array(z.string()).default([]),
  contact_id: z.string().uuid().optional(),
  site_id: z.string().uuid(),
  worker_id: z.string().uuid(),
  referred_by_akf_lead_id: z.string().uuid().optional(),
  idempotency_key: z.string().optional(),
});

const BASE_RATES = { light: 18000, medium: 25000, heavy: 35000 } as const;
const MINIMUM_CENTS = 35000;

const EXTRAS_PRICING: Record<string, number> = {
  windows: 2000,
  carpet_steam: 9000,
  oven: 7500,
  garage: 12000,
  pet_hair: 4500,
};

const DUST_LABELS: Record<string, string> = {
  light: 'light construction dust (paint/tiling)',
  medium: 'medium construction dust (renovation)',
  heavy: 'heavy construction dust (structural work)',
};

const EXTRA_LABELS: Record<string, string> = {
  oven: 'Oven deep clean',
  garage: 'Garage clean',
  pet_hair: 'Pet hair removal treatment',
};

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200 });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ data: null, error: parsed.error.flatten() }, { status: 400 });
    }

    const {
      renovation_type,
      property_bedrooms,
      construction_dust_level,
      extras_needed,
      contact_id,
      site_id,
      worker_id,
      referred_by_akf_lead_id,
      idempotency_key,
    } = parsed.data;

    if (idempotency_key) {
      const existing = await checkIdempotency(idempotency_key);
      if (existing) {
        return Response.json({ data: { ...existing, idempotent: true }, error: null });
      }
    }

    const baseRate = BASE_RATES[construction_dust_level];
    const baseLineTotal = Math.max(baseRate * property_bedrooms, MINIMUM_CENTS);

    const line_items: Array<{ description: string; quantity: number; unit_price: number; total: number }> = [
      {
        description: `Post-build clean — ${property_bedrooms} bedroom(s), ${DUST_LABELS[construction_dust_level]}`,
        quantity: property_bedrooms,
        unit_price: baseRate,
        total: baseLineTotal,
      },
    ];

    let totalAmount = baseLineTotal;

    for (const extra of extras_needed) {
      const price = EXTRAS_PRICING[extra];
      if (price === undefined) continue;

      if (extra === 'windows') {
        const windowCount = 8;
        const total = price * windowCount;
        line_items.push({
          description: 'Internal window cleaning (est. 8 windows)',
          quantity: windowCount,
          unit_price: price,
          total,
        });
        totalAmount += total;
      } else if (extra === 'carpet_steam') {
        const rooms = property_bedrooms + 1;
        const total = price * rooms;
        line_items.push({
          description: `Carpet steam clean (${rooms} rooms)`,
          quantity: rooms,
          unit_price: price,
          total,
        });
        totalAmount += total;
      } else {
        line_items.push({
          description: EXTRA_LABELS[extra] ?? extra,
          quantity: 1,
          unit_price: price,
          total: price,
        });
        totalAmount += price;
      }
    }

    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const llmOutput: LLMQuoteOutput = {
      line_items,
      total_amount: totalAmount,
      notes: `Post-build clean for ${renovation_type.join(', ')} renovation. ${construction_dust_level.charAt(0).toUpperCase() + construction_dust_level.slice(1)} dust level assessed.`,
      valid_until: validUntil,
    };

    const durationHours = Math.max(property_bedrooms * 1.5, 2.0);
    const cleanersRequired = property_bedrooms >= 4 || construction_dust_level === 'heavy' ? 2 : 1;

    const quoteId = await insertQuoteWithLineItems(llmOutput, {
      site_id,
      worker_id,
      contact_id,
      lead_id: referred_by_akf_lead_id,
      idempotency_key,
      ai_model: 'deterministic',
      extra_fields: {
        ai_generated: false,
        service_duration_hours: durationHours,
        cleaners_required: cleanersRequired,
      },
    });

    console.log(`[calculate-post-build-price] quote_id=${quoteId} total=${totalAmount} bedrooms=${property_bedrooms} dust=${construction_dust_level}`);

    return Response.json({
      data: {
        quote_id: quoteId,
        status: 'draft',
        total_amount: totalAmount,
        currency: 'NZD',
        line_items,
        duration_hours: durationHours,
        cleaners_required: cleanersRequired,
      },
      error: null,
    });
  } catch (err) {
    console.error('[calculate-post-build-price][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});
