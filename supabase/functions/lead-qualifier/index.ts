import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const SCORE_WEIGHTS = {
  company: 20,
  phone: 10,
  job_title: 15,
  event_count_over_3: 30,
  order_placed: 25,
} as const

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const authHeader = req.headers.get('Authorization')
  if (!serviceKey || authHeader !== `Bearer ${serviceKey}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: { contactId: string; eventId?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const { contactId, eventId } = body
  if (!contactId) {
    return new Response(JSON.stringify({ error: 'contactId required' }), { status: 400 })
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey)
  const start = Date.now()

  // 1. Fetch agent row for logging
  const { data: agent } = await supabase
    .from('agents')
    .select('id')
    .eq('name', 'lead_qualifier')
    .maybeSingle()

  // 2. Fetch the contact
  const { data: contact, error: contactErr } = await supabase
    .from('contacts')
    .select('id, email, full_name, phone, company, job_title, tags, lead_score')
    .eq('id', contactId)
    .single()

  if (contactErr || !contact) {
    console.error('[lead-qualifier] contact not found:', contactId, contactErr?.message)
    return new Response(JSON.stringify({ error: 'Contact not found' }), { status: 404 })
  }

  // 3. Count all events for this contact
  const { count: eventCount } = await supabase
    .from('events')
    .select('id', { count: 'exact', head: true })
    .eq('contact_id', contactId)

  // 4. Check for order_placed events
  const { count: orderCount } = await supabase
    .from('events')
    .select('id', { count: 'exact', head: true })
    .eq('contact_id', contactId)
    .eq('event_type', 'order_placed')

  // 5. Score calculation
  let score = 0
  const breakdown: Record<string, number> = {}

  if (contact.company)   { score += SCORE_WEIGHTS.company;             breakdown.company = SCORE_WEIGHTS.company }
  if (contact.phone)     { score += SCORE_WEIGHTS.phone;               breakdown.phone = SCORE_WEIGHTS.phone }
  if (contact.job_title) { score += SCORE_WEIGHTS.job_title;           breakdown.job_title = SCORE_WEIGHTS.job_title }
  if ((eventCount ?? 0) > 3) { score += SCORE_WEIGHTS.event_count_over_3; breakdown.event_count = SCORE_WEIGHTS.event_count_over_3 }
  if ((orderCount ?? 0) > 0) { score += SCORE_WEIGHTS.order_placed;    breakdown.order_placed = SCORE_WEIGHTS.order_placed }
  score = Math.min(100, score)

  // 6. Build updated tags (preserve existing, add qualification tier)
  const existingTags: string[] = contact.tags ?? []
  const newTags = [...new Set([...existingTags, 'lead'])]
  if (score >= 80) newTags.push('hot-lead')
  else if (score >= 40) newTags.push('warm-lead')

  // 7. Update contact with new score and tags
  await supabase
    .from('contacts')
    .update({ lead_score: score, tags: newTags, updated_at: new Date().toISOString() })
    .eq('id', contactId)

  // 8. Mark triggering event as processed
  if (eventId) {
    await supabase.rpc('mark_event_processed', { p_event_id: eventId })
  }

  const duration = Date.now() - start
  const escalated = score > 80

  // 9. Log to agent_actions
  if (agent?.id) {
    await supabase.from('agent_actions').insert({
      agent_id: agent.id,
      contact_id: contactId,
      event_id: eventId ?? null,
      action_type: 'contact_scored',
      input: { contactId, eventId: eventId ?? null, event_count: eventCount ?? 0, order_count: orderCount ?? 0 },
      output: { score, breakdown, tags: newTags },
      status: escalated ? 'escalated' : 'success',
      confidence: score / 100,
      duration_ms: duration,
      idempotency_key: eventId ? `lq-${eventId}` : `lq-${contactId}-${Date.now()}`,
    })
  }

  console.log(`[lead-qualifier] contact=${contactId} score=${score} tags=${newTags.join(',')} escalated=${escalated} duration=${duration}ms`)

  return new Response(
    JSON.stringify({ contactId, score, tags: newTags, escalated, duration_ms: duration }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
