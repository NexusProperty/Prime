import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { z } from 'npm:zod@3';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const RequestSchema = z.object({
  quote_id: z.string().uuid(),
  token: z.string().optional(),
});

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200 });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ data: null, error: parsed.error.flatten() }, { status: 400 });
    }

    const { quote_id } = parsed.data;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: quote, error: fetchErr } = await supabase
      .from('quotes')
      .select('id, status')
      .eq('id', quote_id)
      .maybeSingle();

    if (fetchErr) {
      console.error('[quote-accept][fetch]', fetchErr.message);
      return Response.json({ data: null, error: 'Failed to fetch quote' }, { status: 500 });
    }

    if (!quote) {
      return Response.json({ data: null, error: 'Quote not found' }, { status: 404 });
    }

    if (quote.status === 'accepted') {
      console.log(`[quote-accept] quote_id=${quote_id} already accepted — idempotent`);
      return Response.json({ data: { quote_id, status: 'accepted', idempotent: true }, error: null });
    }

    const { error: updateErr } = await supabase
      .from('quotes')
      .update({ status: 'accepted' })
      .eq('id', quote_id);

    if (updateErr) {
      console.error('[quote-accept][update]', updateErr.message);
      return Response.json({ data: null, error: 'Failed to accept quote' }, { status: 500 });
    }

    console.log(`[quote-accept] quote_id=${quote_id} status → accepted`);
    return Response.json({ data: { quote_id, status: 'accepted' }, error: null });

  } catch (err) {
    console.error('[quote-accept][unhandled]', err instanceof Error ? err.message : String(err));
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
});
