import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { z } from 'npm:zod@3';

const RequestSchema = z.object({
  service_type: z.string(),
  bedrooms: z.number().int().positive(),
  has_pets: z.boolean().optional(),
  has_oven: z.boolean().optional(),
  window_count: z.number().int().nonnegative().optional(),
  customer_description: z.string().optional(),
});

type Extra = {
  name: string;
  description: string;
  price_cents: number;
  priority: 'essential' | 'recommended' | 'optional';
  reason: string;
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

    const { service_type, bedrooms, has_pets, has_oven, window_count, customer_description } = parsed.data;

    const extras: Extra[] = [];
    const desc = (customer_description ?? '').toLowerCase();
    const isEndOfTenancy = service_type === 'end_of_tenancy' || desc.includes('bond') || desc.includes('moving out');
    const isPostBuild = service_type === 'post_build' || desc.includes('renovation') || desc.includes('builder');

    if (has_oven !== false || isEndOfTenancy) {
      extras.push({
        name: 'Oven Deep Clean',
        description: 'Full oven interior clean including racks and glass door',
        price_cents: 7500,
        priority: isEndOfTenancy ? 'essential' : 'recommended',
        reason: isEndOfTenancy ? 'Required for bond return inspection' : 'Recommended for thorough kitchen clean',
      });
    }

    if (has_pets) {
      extras.push({
        name: 'Pet Hair Removal',
        description: 'Specialist pet hair removal from all soft furnishings and carpets',
        price_cents: 4500,
        priority: 'recommended',
        reason: 'Pet hair requires specialist equipment to remove thoroughly',
      });
    }

    if (window_count && window_count > 0) {
      const windowCents = window_count * 2000;
      extras.push({
        name: `Window Cleaning (${window_count} windows)`,
        description: 'Internal window and sill clean',
        price_cents: windowCents,
        priority: 'optional',
        reason: 'Clean windows significantly improve the post-clean finish',
      });
    } else if (isEndOfTenancy) {
      extras.push({
        name: 'Window Cleaning (est. 8 windows)',
        description: 'Internal window and sill clean',
        price_cents: 16000,
        priority: 'recommended',
        reason: 'Landlords typically inspect windows during bond inspection',
      });
    }

    if (bedrooms >= 3 || isPostBuild) {
      const carpetRooms = bedrooms + 1;
      extras.push({
        name: `Carpet Steam Clean (${carpetRooms} rooms)`,
        description: 'Hot water extraction carpet steam clean',
        price_cents: 9000 * carpetRooms,
        priority: isEndOfTenancy ? 'recommended' : 'optional',
        reason: isEndOfTenancy ? 'Most common bond deduction — prevents disputes' : 'Removes deep-set dust and allergens',
      });
    }

    if (isPostBuild) {
      extras.push({
        name: 'Garage Post-Build Clean',
        description: 'Garage floor sweep, cobweb removal, and surface wipe-down',
        price_cents: 12000,
        priority: 'optional',
        reason: 'Garages accumulate construction debris during renovation',
      });
    }

    return Response.json({ data: { recommended_extras: extras }, error: null });
  } catch (err) {
    console.error('[recommend-extras][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});
