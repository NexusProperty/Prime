import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { z } from 'npm:zod@3';
import { insertQuoteWithLineItems, type LLMQuoteOutput } from '../_shared/quotes.ts';

const RequestSchema = z.object({
  length_m: z.number().positive(),
  width_m: z.number().positive(),
  height_m: z.number().nonnegative(),
  material: z.enum(['hardwood', 'composite', 'pine']),
  features: z.array(z.enum(['stairs', 'balustrade', 'lighting', 'pergola', 'privacy_screen'])).default([]),
  location: z.string().optional(),
  contact_id: z.string().uuid(),
  site_id: z.string().uuid(),
  worker_id: z.string().uuid(),
  idempotency_key: z.string().optional(),
});

const MATERIAL_RATES: Record<string, number> = {
  hardwood: 105000,
  composite: 85000,
  pine: 60000,
};

const MATERIAL_LABELS: Record<string, string> = {
  hardwood: 'hardwood (spotted gum/kwila)',
  composite: 'composite (Trex/Millboard)',
  pine: 'H4 treated pine',
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

    const { length_m, width_m, height_m, material, features, location, contact_id, site_id, worker_id, idempotency_key } = parsed.data;

    const area_m2 = length_m * width_m;
    const deckBaseCents = Math.round(area_m2 * MATERIAL_RATES[material]);
    const perimeter_m = 2 * (length_m + width_m);

    const line_items: Array<{ description: string; quantity: number; unit_price: number; total: number }> = [
      {
        description: `Deck supply & install — ${MATERIAL_LABELS[material]} (${area_m2.toFixed(1)}m²)`,
        quantity: area_m2,
        unit_price: MATERIAL_RATES[material],
        total: deckBaseCents,
      },
    ];

    let totalAmount = deckBaseCents;

    if (features.includes('balustrade')) {
      const balustrade_m = perimeter_m * 0.5;
      const balustradeCents = Math.round(balustrade_m * 52500);
      line_items.push({
        description: `Glass balustrade (est. ${balustrade_m.toFixed(1)} linear metres)`,
        quantity: balustrade_m,
        unit_price: 52500,
        total: balustradeCents,
      });
      totalAmount += balustradeCents;
    }

    if (features.includes('stairs')) {
      const stairsCents = 350000;
      line_items.push({
        description: 'Stairs — single flight (supply & install)',
        quantity: 1,
        unit_price: stairsCents,
        total: stairsCents,
      });
      totalAmount += stairsCents;
    }

    if (features.includes('pergola')) {
      const pergolaCents = 1500000;
      line_items.push({
        description: 'Pergola — powder-coated aluminium (supply & install)',
        quantity: 1,
        unit_price: pergolaCents,
        total: pergolaCents,
      });
      totalAmount += pergolaCents;
    }

    if (features.includes('lighting')) {
      const lightingCents = 500000;
      line_items.push({
        description: 'Outdoor LED deck lighting (supply, install, wiring)',
        quantity: 1,
        unit_price: lightingCents,
        total: lightingCents,
      });
      totalAmount += lightingCents;
    }

    if (features.includes('privacy_screen')) {
      const screenCents = Math.round(length_m * 35000);
      line_items.push({
        description: `Privacy screen — horizontal cedar slats (${length_m.toFixed(1)}m)`,
        quantity: length_m,
        unit_price: 35000,
        total: screenCents,
      });
      totalAmount += screenCents;
    }

    const consentRequired = height_m > 1.5;
    if (consentRequired) {
      const consentFee = totalAmount < 2000000 ? 500000 : 900000;
      line_items.push({
        description: 'Auckland Council Building Consent (estimated) — deck > 1.5m height',
        quantity: 1,
        unit_price: consentFee,
        total: consentFee,
      });
      totalAmount += consentFee;
    }

    const validUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const llmOutput: LLMQuoteOutput = {
      line_items,
      total_amount: totalAmount,
      notes: `${area_m2.toFixed(1)}m² ${material} deck${location ? ` in ${location}` : ''}. Height: ${height_m}m.${consentRequired ? ' Building consent required (included as line item).' : ''}`,
      valid_until: validUntil,
    };

    const quoteId = await insertQuoteWithLineItems(llmOutput, {
      site_id,
      worker_id,
      contact_id,
      idempotency_key,
      ai_model: 'deterministic',
      extra_fields: {
        ai_generated: false,
        consent_required: consentRequired,
        consent_notes: consentRequired ? 'Deck height exceeds 1.5m — Auckland Council building consent required under NZBC.' : null,
      },
    });

    console.log(`[estimate-deck-cost] quote_id=${quoteId} total=${totalAmount} area=${area_m2}m² consent=${consentRequired}`);

    return Response.json({
      data: {
        quote_id: quoteId,
        status: 'draft',
        total_amount: totalAmount,
        currency: 'NZD',
        area_m2,
        consent_required: consentRequired,
      },
      error: null,
    });
  } catch (err) {
    console.error('[estimate-deck-cost][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});
