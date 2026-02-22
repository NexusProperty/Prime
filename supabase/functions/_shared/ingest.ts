import { createClient } from 'jsr:@supabase/supabase-js@2';

export type IngestPayload = {
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  serviceType?: string;
  [key: string]: unknown;
};

const SITE_NAMES: Record<string, string> = {
  prime: 'Prime Electrical',
  akf: 'AKF Construction',
  cleanjet: 'CleanJet',
};

/**
 * Ingest a form submission into the Mission Control layer.
 * Writes to:
 *   - contacts (upsert by email — Mission Control unified contact)
 *   - events   (INSERT — immutable event log)
 *   - leads    (INSERT — legacy table, backward-compat with n8n enrichment pipeline)
 */
export async function ingestFormSubmit(
  payload: IngestPayload,
  brand: 'prime' | 'akf' | 'cleanjet',
): Promise<{ eventId: string; contactId: string; leadId: string }> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // 1. Look up the site row
  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('name', SITE_NAMES[brand])
    .maybeSingle();

  // 2. Upsert contact — primary deduplication key is email
  let contactId: string | null = null;

  if (payload.email) {
    const { data: contact, error: contactErr } = await supabase
      .from('contacts')
      .upsert(
        {
          email: payload.email,
          full_name: payload.name,
          phone: payload.phone ?? null,
          source_site: site?.id ?? null,
          tags: [brand, 'lead'],
          metadata: { service_type: payload.serviceType ?? null },
        },
        { onConflict: 'email', ignoreDuplicates: false },
      )
      .select('id')
      .single();

    if (contactErr) {
      console.error(`[ingest-${brand}][contact-upsert]`, contactErr.message);
    } else {
      contactId = contact?.id ?? null;
    }
  }

  // 3. Insert immutable event
  const { data: event, error: eventErr } = await supabase
    .from('events')
    .insert({
      site_id: site?.id ?? null,
      contact_id: contactId,
      event_type: 'form_submit',
      source: 'webhook',
      payload: payload as Record<string, unknown>,
    })
    .select('id')
    .single();

  if (eventErr) {
    console.error(`[ingest-${brand}][event-insert]`, eventErr.message);
  }

  // 4. Mirror to legacy leads table (backward-compat with n8n enrichment pipeline)
  const { data: lead, error: leadErr } = await supabase
    .from('leads')
    .insert({
      source_site: brand,
      name: payload.name,
      phone: payload.phone ?? null,
      email: payload.email ?? null,
      message: payload.message ?? null,
      service_type: payload.serviceType ?? null,
    })
    .select('id')
    .single();

  if (leadErr) {
    console.error(`[ingest-${brand}][lead-insert]`, leadErr.message);
  }

  console.log(
    `[ingest-${brand}] contact=${contactId ?? 'none'} event=${event?.id ?? 'err'} lead=${lead?.id ?? 'err'}`,
  );

  return {
    eventId: event?.id ?? 'unknown',
    contactId: contactId ?? 'unknown',
    leadId: lead?.id ?? 'unknown',
  };
}
