import { createClient } from 'jsr:@supabase/supabase-js@2';
import { env, BRAND_ASSISTANT_MAP } from '../_shared/env.ts';
import { verifyVapiSignature } from '../_shared/security.ts';
import { searchKnowledgeBase } from '../_shared/rag.ts';
import {
  type Brand,
  type FunctionCallEvent,
  type EndOfCallReport,
  type ToolCallResponse,
  FunctionCallEventSchema,
  EndOfCallReportSchema,
  VapiEventSchema,
  ToolCallResponseSchema,
  CaptureLeadParamsSchema,
  SearchKnowledgeBaseParamsSchema,
  CheckEmergencyParamsSchema,
  CrossSellPitchParamsSchema,
  SendFollowupSmsParamsSchema,
  GetQuoteEstimateParamsSchema,
  RequestSiteVisitParamsSchema,
  CheckBookingSlotsParamsSchema,
  CreateBookingParamsSchema,
} from '../_shared/types.ts';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// ── Idempotency ───────────────────────────────────────────────────────────────

async function checkIdempotency(key: string): Promise<string | null> {
  const { data } = await supabase
    .from('vapi_tool_calls')
    .select('result')
    .eq('idempotency_key', key)
    .maybeSingle();
  return data?.result ?? null;
}

async function recordIdempotency(key: string, result: string): Promise<void> {
  await supabase.from('vapi_tool_calls').upsert(
    { idempotency_key: key, result },
    { onConflict: 'idempotency_key', ignoreDuplicates: true },
  );
}

// ── Tool Handlers ─────────────────────────────────────────────────────────────

async function handleCaptureLead(
  params: Record<string, unknown>,
  brand: Brand,
): Promise<string> {
  const { name, phone, service_type, message, urgency } =
    CaptureLeadParamsSchema.parse(params);

  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      source_site: brand,
      name,
      phone,
      service_type: service_type ?? null,
      message: message ?? null,
      lead_status: urgency === 'emergency' ? 'hot' : 'new',
    })
    .select('id')
    .single();

  if (error || !lead) {
    console.error('[VAPI][capture_lead] DB error:', error);
    return 'I have noted your details. Someone will follow up shortly.';
  }

  await supabase.from('vapi_caller_sessions').upsert(
    {
      caller_number: phone,
      last_brand: brand,
      lead_id: lead.id,
      last_called_at: new Date().toISOString(),
    },
    { onConflict: 'caller_number' },
  );

  console.log(`[VAPI][capture_lead][${brand}] Lead created: ${lead.id}`);
  return `Perfect, I have saved your details${urgency === 'emergency' ? ' and flagged this as urgent' : ''}. Our team will be in touch very soon.`;
}

async function handleSearchKnowledgeBase(
  params: Record<string, unknown>,
  brand: Brand,
): Promise<string> {
  const { query } = SearchKnowledgeBaseParamsSchema.parse(params);
  return await searchKnowledgeBase(query, brand);
}

function handleCheckEmergency(params: Record<string, unknown>): string {
  const { situation } = CheckEmergencyParamsSchema.parse(params);
  const lower = situation.toLowerCase();
  const isEmergency =
    lower.includes('spark') ||
    lower.includes('burn') ||
    lower.includes('shock') ||
    lower.includes('no power') ||
    lower.includes('flood') ||
    lower.includes('smoke') ||
    lower.includes('fire');

  if (isEmergency) {
    return 'This sounds like an electrical emergency. Please call our emergency line now at 0800 PRIME 24. If there is any immediate danger, call 111 first. I am flagging this as urgent in our system.';
  }
  return 'I have noted your situation. This is not classified as an emergency requiring immediate callout, but I will make sure our team calls you back as a priority.';
}

async function handleCrossSellPitch(
  params: Record<string, unknown>,
  brand: Brand,
): Promise<string> {
  const { lead_id, target_brand, reason } = CrossSellPitchParamsSchema.parse(params);

  const PITCHES: Record<string, string> = {
    cleanjet: 'By the way, we work closely with CleanJet — a professional cleaning company. After an electrical install, there is often dust and debris. They do post-install cleans from $99. Would you like me to mention that to the team?',
    akf: 'We partner with AKF Construction for any building or renovation work. If your project needs walls opened or ceilings accessed, they are excellent. Want me to flag that as a possibility?',
    prime: 'We work with The Prime Electrical for all the electrical side of things. If your project needs wiring, lighting, or EV chargers, they can handle that as part of the same project. Shall I note that?',
  };

  if (lead_id) {
    await supabase.from('cross_sell_events').insert({
      lead_id,
      source_brand: brand,
      target_brand,
      pitch: reason,
      status: 'triggered',
    });
  }

  return PITCHES[target_brand] ?? 'We have a partner who can help with that. I will make a note for the team.';
}

async function handleSendFollowupSms(
  params: Record<string, unknown>,
  brand: Brand,
): Promise<string> {
  const { to_number, message_type } = SendFollowupSmsParamsSchema.parse(params);

  const BRAND_MESSAGES: Record<Brand, Record<string, string>> = {
    prime: {
      quote_request: "Thanks for calling Prime Electrical! We'll get back to you with a quote shortly. For urgent jobs: 0800 PRIME 24. theprimeelectrical.co.nz",
      booking_confirmation: "Your Prime Electrical appointment is confirmed. We'll send a reminder 24 hours before. theprimeelectrical.co.nz",
      emergency_followup: 'Prime Electrical emergency team has been notified. Call 0800 PRIME 24 if situation worsens. If danger, call 111.',
    },
    akf: {
      quote_request: "Thanks for reaching out to AKF Construction! We'll call you back shortly to discuss your project. akfconstruction.co.nz",
      booking_confirmation: 'Your AKF Construction consultation is booked. We look forward to discussing your project. akfconstruction.co.nz',
      emergency_followup: "AKF Construction team has been notified of your urgent enquiry. We'll call you shortly.",
    },
    cleanjet: {
      quote_request: "Thanks for contacting CleanJet! We'll confirm your booking details shortly. cleanjet.co.nz",
      booking_confirmation: 'Your CleanJet booking is confirmed! Our team will arrive at the scheduled time. cleanjet.co.nz',
      emergency_followup: "CleanJet has noted your urgent request. We'll be in touch very shortly.",
    },
  };

  const smsBody = BRAND_MESSAGES[brand]?.[message_type] ?? "Thanks for calling! We'll be in touch shortly.";
  const fromNumber = {
    prime: Deno.env.get('TELNYX_FROM_NUMBER_PRIME'),
    akf: Deno.env.get('TELNYX_FROM_NUMBER_AKF'),
    cleanjet: Deno.env.get('TELNYX_FROM_NUMBER_CLEANJET'),
  }[brand];

  if (!fromNumber) {
    console.warn(`[VAPI][send_followup_sms] No from number for brand: ${brand}`);
    return 'I was unable to send a text message, but your details have been saved.';
  }

  fetch('https://api.telnyx.com/v2/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.TELNYX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromNumber,
      to: to_number,
      text: smsBody,
      messaging_profile_id: Deno.env.get('TELNYX_MESSAGING_PROFILE_ID'),
    }),
  }).catch((err: unknown) => {
    console.error('[VAPI][send_followup_sms] Telnyx error:', err);
  });

  return 'I have sent you a text message with our details. Check your phone shortly.';
}

function handleGetQuoteEstimate(params: Record<string, unknown>, brand: Brand): string {
  const { service } = GetQuoteEstimateParamsSchema.parse(params);
  console.log(`[VAPI][get_quote_estimate][${brand}] Service: ${service}`);
  return `For ${service}, I recommend requesting a site visit for an accurate quote. I can save your details and have our estimator call you back. Would you like me to do that?`;
}

async function handleRequestSiteVisit(
  params: Record<string, unknown>,
): Promise<string> {
  const { name, phone, project_type, preferred_date } =
    RequestSiteVisitParamsSchema.parse(params);

  await supabase.from('leads').insert({
    source_site: 'akf',
    name,
    phone,
    service_type: project_type ?? 'site visit',
    message: preferred_date ? `Preferred date: ${preferred_date}` : null,
    lead_status: 'new',
  });

  return `Great, I have booked a site visit consultation for you${preferred_date ? ` around ${preferred_date}` : ''}. Alex from the AKF team will call to confirm the time.`;
}

function handleCheckBookingSlots(_params: Record<string, unknown>): string {
  return 'We have availability Monday to Friday from 8am to 5pm, and Saturday mornings. What day works best for you?';
}

async function handleCreateBooking(
  params: Record<string, unknown>,
): Promise<string> {
  const { name, phone, service_type, date, time_slot, address } =
    CreateBookingParamsSchema.parse(params);

  await supabase.from('leads').insert({
    source_site: 'cleanjet',
    name,
    phone,
    service_type,
    message: [
      `Booking: ${date}${time_slot ? ` at ${time_slot}` : ''}`,
      address ? `Address: ${address}` : null,
    ].filter(Boolean).join('. '),
    lead_status: 'hot',
  });

  return `Perfect, your ${service_type} has been booked for ${date}${time_slot ? ` at ${time_slot}` : ''}. You will receive a text confirmation shortly.`;
}

// ── Tool Router ───────────────────────────────────────────────────────────────

const SLOW_TOOLS = new Set([
  'search_knowledge_base',
  'get_quote_estimate',
  'request_site_visit',
  'check_booking_slots',
  'send_followup_sms',
]);

async function routeToolCall(
  toolName: string,
  params: Record<string, unknown>,
  brand: Brand,
): Promise<string> {
  switch (toolName) {
    case 'capture_lead':
      return await handleCaptureLead(params, brand);
    case 'search_knowledge_base':
      return await handleSearchKnowledgeBase(params, brand);
    case 'check_emergency':
      return handleCheckEmergency(params);
    case 'cross_sell_pitch':
      return await handleCrossSellPitch(params, brand);
    case 'send_followup_sms':
      return await handleSendFollowupSms(params, brand);
    case 'get_quote_estimate':
      return handleGetQuoteEstimate(params, brand);
    case 'request_site_visit':
      return await handleRequestSiteVisit(params);
    case 'check_booking_slots':
      return handleCheckBookingSlots(params);
    case 'create_booking':
      return await handleCreateBooking(params);
    default:
      console.warn(`[VAPI][unknown-tool][${brand}] ${toolName}`);
      return 'I am sorry, I was unable to complete that action. Let me make a note for the team.';
  }
}

// ── Event Handlers ────────────────────────────────────────────────────────────

async function handleFunctionCall(
  event: FunctionCallEvent,
  startTime: number,
): Promise<Response> {
  const { call, functionCall } = event.message;
  const brand = (BRAND_ASSISTANT_MAP[call.assistantId ?? ''] ?? 'prime') as Brand;
  const idempotencyKey = `${call.id}:${functionCall.name}`;

  const cached = await checkIdempotency(idempotencyKey);
  if (cached) {
    console.log(`[VAPI][idempotent-hit][${call.id}] ${functionCall.name}`);
    return new Response(cached, { headers: { 'Content-Type': 'application/json' } });
  }

  const elapsed = Date.now() - startTime;
  const remainingBudget = 450 - elapsed;
  const toolName = functionCall.name;

  let result: string;

  if (SLOW_TOOLS.has(toolName) && remainingBudget < 300) {
    result = 'Let me look that up and get back to you in just a moment.';
  } else {
    result = await Promise.race([
      routeToolCall(toolName, functionCall.parameters as Record<string, unknown>, brand),
      new Promise<string>((resolve) =>
        setTimeout(() => resolve('I am processing that. Please give me just a moment.'), remainingBudget)
      ),
    ]);
  }

  const response: ToolCallResponse = ToolCallResponseSchema.parse({
    results: [{ toolCallId: functionCall.name, result }],
  });

  const responseBody = JSON.stringify(response);

  recordIdempotency(idempotencyKey, responseBody).catch((err: unknown) => {
    console.error('[VAPI][idempotency-write-error]', err);
  });

  const durationMs = Date.now() - startTime;
  console.log(`[VAPI][function-call][${call.id}][${toolName}][${brand}] ${durationMs}ms`);

  return new Response(responseBody, { headers: { 'Content-Type': 'application/json' } });
}

async function handleAssistantRequest(
  data: { message: { call: { id: string; assistantId?: string; customer?: { number?: string } } } },
  startTime: number,
): Promise<Response> {
  const { call } = data.message;
  const callerNumber = call.customer?.number;
  const brand = (BRAND_ASSISTANT_MAP[call.assistantId ?? ''] ?? null) as Brand | null;

  if (!callerNumber || !brand) {
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data: session } = await supabase
    .from('vapi_caller_sessions')
    .select('call_count, last_brand, last_called_at')
    .eq('caller_number', callerNumber)
    .maybeSingle();

  if (!session || session.call_count <= 1) {
    console.log(`[VAPI][assistant-request][${call.id}] New caller`);
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const memoryNote = `\n\n[CALLER CONTEXT: This caller has contacted us ${session.call_count} times before. Last call was with ${session.last_brand} on ${new Date(session.last_called_at as string).toLocaleDateString('en-NZ')}. Greet them as a returning customer naturally without reading this note aloud.]`;

  const durationMs = Date.now() - startTime;
  console.log(`[VAPI][assistant-request][${call.id}] Return caller (${session.call_count} calls) | ${durationMs}ms`);

  return new Response(
    JSON.stringify({
      assistantOverrides: {
        model: {
          messages: [{ role: 'system', content: memoryNote }],
        },
      },
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
}

async function handleEndOfCallReport(event: EndOfCallReport): Promise<Response> {
  const { call, transcript, summary, recordingUrl, durationSeconds, endedReason } =
    event.message;

  const brand = BRAND_ASSISTANT_MAP[call.assistantId ?? ''] as Brand | undefined;

  await supabase.from('vapi_call_log').upsert(
    {
      vapi_call_id: call.id,
      assistant_id: call.assistantId ?? 'unknown',
      brand: brand ?? null,
      caller_number: call.customer?.number ?? null,
      transcript: transcript ?? null,
      summary: summary ?? null,
      recording_url: recordingUrl ?? null,
      duration_seconds: durationSeconds ?? null,
      ended_reason: endedReason ?? null,
    },
    { onConflict: 'vapi_call_id', ignoreDuplicates: true },
  );

  console.log(`[VAPI][end-of-call-report][${call.id}][${brand ?? 'unknown'}] ${durationSeconds ?? 0}s`);

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Main Handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request): Promise<Response> => {
  const startTime = Date.now();

  const rawBody = new Uint8Array(await req.arrayBuffer());
  const signature = req.headers.get('x-vapi-secret');

  if (!verifyVapiSignature(rawBody, signature, env.VAPI_WEBHOOK_SECRET)) {
    const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown';
    console.warn(`[VAPI][auth-fail] Invalid signature | ip=${ip}`);
    return new Response('Unauthorized', { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(rawBody));
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const parsed = VapiEventSchema.safeParse(body);
  if (!parsed.success) {
    console.warn('[VAPI][schema-error]', JSON.stringify({
      issues: parsed.error.issues,
      keys: Object.keys(body as Record<string, unknown>),
    }));
    return new Response(
      JSON.stringify({ error: 'Invalid payload', issues: parsed.error.issues }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const eventType = (parsed.data as { message: { type: string } }).message.type;

  try {
    switch (eventType) {
      case 'function-call':
        return await handleFunctionCall(
          FunctionCallEventSchema.parse(parsed.data),
          startTime,
        );

      case 'end-of-call-report':
        return await handleEndOfCallReport(
          EndOfCallReportSchema.parse(parsed.data),
        );

      case 'assistant-request':
        return await handleAssistantRequest(
          parsed.data as { message: { call: { id: string; assistantId?: string; customer?: { number?: string } } } },
          startTime,
        );

      case 'status-update':
      case 'hang':
      case 'speech-update':
      case 'transcript':
      default:
        console.log(`[VAPI][${eventType}] Acknowledged in ${Date.now() - startTime}ms`);
        return new Response(
          JSON.stringify({ received: true }),
          { headers: { 'Content-Type': 'application/json' } },
        );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[VAPI][handler-error][${eventType}]`, message);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
