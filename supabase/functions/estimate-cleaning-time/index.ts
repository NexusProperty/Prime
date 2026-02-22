import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { z } from 'npm:zod@3';

const RequestSchema = z.object({
  service_type: z.enum(['regular', 'deep_clean', 'end_of_tenancy', 'post_build']),
  bedrooms: z.number().int().min(1).max(15),
  bathrooms: z.number().int().min(1).max(10).default(1),
  property_size_m2: z.number().positive().optional(),
  extras: z.array(z.string()).default([]),
  condition: z.enum(['light', 'medium', 'heavy', 'extreme']).default('medium'),
});

// Base minutes by service type and bedroom count (capped at 5+)
const BASE_MINUTES_TABLE: Record<string, Record<number, number>> = {
  regular:          { 1: 90,  2: 120, 3: 150, 4: 180, 5: 210 },
  deep_clean:       { 1: 150, 2: 210, 3: 270, 4: 330, 5: 390 },
  end_of_tenancy:   { 1: 180, 2: 240, 3: 330, 4: 420, 5: 510 },
  post_build:       { 1: 240, 2: 330, 3: 420, 4: 540, 5: 660 },
};

function getBaseMinutes(serviceType: string, bedrooms: number): number {
  const table = BASE_MINUTES_TABLE[serviceType] ?? BASE_MINUTES_TABLE['regular']!;
  const capped = Math.min(bedrooms, 5);
  const base = table[capped] ?? table[5]!;
  return base + Math.max(0, bedrooms - 5) * 45;
}

const CONDITION_MULTIPLIER: Record<string, number> = {
  light: 0.8,
  medium: 1.0,
  heavy: 1.3,
  extreme: 1.6,
};

const EXTRA_BATHROOM_MINUTES = 25;

const EXTRA_MINUTES_TABLE: Record<string, number> = {
  oven_clean:      45,
  fridge_clean:    20,
  window_clean:    30,
  carpet_steam:    40,
  pet_hair:        20,
  garage:          45,
  balcony:         15,
  laundry_room:    20,
  pantry:          15,
  range_hood:      20,
  blinds:          25,
  walls:           35,
};

const RATE_PER_HOUR_CENTS = 6500; // $65/hr NZD

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200 });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ data: null, error: parsed.error.flatten() }, { status: 400 });
    }

    const { service_type, bedrooms, bathrooms, extras, condition } = parsed.data;
    const breakdown: Array<{ task: string; minutes: number }> = [];

    const baseMinutes = Math.round(
      getBaseMinutes(service_type, bedrooms) * (CONDITION_MULTIPLIER[condition] ?? 1.0),
    );
    breakdown.push({
      task: `${service_type.replace(/_/g, ' ')} — ${bedrooms} bedroom${bedrooms !== 1 ? 's' : ''} (${condition} condition)`,
      minutes: baseMinutes,
    });

    const extraBathroomMinutes = Math.max(0, bathrooms - 1) * EXTRA_BATHROOM_MINUTES;
    if (extraBathroomMinutes > 0) {
      breakdown.push({
        task: `Additional bathroom${bathrooms - 1 !== 1 ? 's' : ''} (${bathrooms - 1} extra)`,
        minutes: extraBathroomMinutes,
      });
    }

    for (const extra of extras) {
      const normalised = extra.toLowerCase().replace(/[^a-z]+/g, '_').replace(/^_|_$/g, '');
      const matchedKey = Object.keys(EXTRA_MINUTES_TABLE).find(
        (k) => normalised.includes(k) || k.includes(normalised),
      );
      if (matchedKey) {
        breakdown.push({ task: extra, minutes: EXTRA_MINUTES_TABLE[matchedKey]! });
      }
    }

    const totalMinutes = breakdown.reduce((sum, item) => sum + item.minutes, 0);
    // Round to nearest 0.5 hour
    const durationHours = Math.round(totalMinutes / 30) / 2;

    let cleanersRequired = 1;
    if (durationHours > 5) cleanersRequired = 2;
    if (durationHours > 10) cleanersRequired = 3;
    if (service_type === 'post_build' && bedrooms >= 4) {
      cleanersRequired = Math.max(cleanersRequired, 2);
    }

    // Wall-clock hours = total work ÷ cleaners, rounded to nearest 0.5h
    const wallClockHours = Math.round((durationHours / cleanersRequired) * 2) / 2;

    const totalCostEstimateCents = Math.round(durationHours * RATE_PER_HOUR_CENTS);

    console.log(
      `[estimate-cleaning-time] service_type=${service_type} bedrooms=${bedrooms} duration=${durationHours}h cleaners=${cleanersRequired}`,
    );

    return Response.json({
      data: {
        duration_hours: durationHours,
        wall_clock_hours: wallClockHours,
        cleaners_required: cleanersRequired,
        rate_per_hour_cents: RATE_PER_HOUR_CENTS,
        total_cost_estimate_cents: totalCostEstimateCents,
        breakdown,
      },
      error: null,
    });
  } catch (err) {
    console.error('[estimate-cleaning-time][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});
