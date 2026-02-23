import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { timingSafeEqual } from 'node:crypto';
import { sendMessage, sendTyping, sendInlineKeyboard, answerCallbackQuery } from '../_shared/telegram.ts';

// ── Auth ─────────────────────────────────────────────────────────────────────

function verifyTelegramToken(header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = new TextEncoder().encode(secret);
  const received = new TextEncoder().encode(header);
  if (expected.byteLength !== received.byteLength) return false;
  return timingSafeEqual(expected, received);
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface TelegramUser {
  id: number;
  first_name?: string;
  username?: string;
}

interface TelegramChat {
  id: number;
  type: string;
}

interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  text?: string;
  date: number;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: {
    id: string;
    from: TelegramUser;
    message?: TelegramMessage;
    data?: string;
  };
}

// ── DB Helpers ────────────────────────────────────────────────────────────────

async function getOrCreateSession(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  user?: TelegramUser,
): Promise<Record<string, unknown>> {
  const { data: session } = await supabase
    .from('telegram_sessions')
    .select('*')
    .eq('chat_id', chatId)
    .maybeSingle();

  if (session) {
    await supabase
      .from('telegram_sessions')
      .update({ last_active_at: new Date().toISOString() })
      .eq('chat_id', chatId);
    return session as Record<string, unknown>;
  }

  const { data: newSession } = await supabase
    .from('telegram_sessions')
    .insert({
      chat_id: chatId,
      username: user?.username ?? null,
      first_name: user?.first_name ?? null,
    })
    .select()
    .single();

  return (newSession ?? {}) as Record<string, unknown>;
}

async function logMessage(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  direction: 'inbound' | 'outbound',
  text: string,
  agentUsed?: string,
): Promise<void> {
  const { error } = await supabase
    .from('telegram_messages')
    .insert({
      chat_id: chatId,
      direction,
      message_text: text,
      agent_used: agentUsed ?? null,
      delivered: direction === 'outbound',
    });
  if (error) console.error('[telegram-webhook][log]', error);
}

// ── Command Handlers ──────────────────────────────────────────────────────────

async function handleStart(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  session: Record<string, unknown>,
): Promise<string> {
  if (session.contact_id) {
    return 'You are already linked to Mission Control.';
  }
  await supabase
    .from('telegram_sessions')
    .update({ context: { pending_action: 'await_email' } })
    .eq('chat_id', chatId);
  return 'Welcome to Mission Control. Please send your email address to link your account.';
}

async function handleEmailLink(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  email: string,
): Promise<string> {
  const { data: contact } = await supabase
    .from('contacts')
    .select('id, full_name')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (!contact) {
    return `No contact found for ${email}. Please try a different email or contact your administrator.`;
  }

  await supabase
    .from('telegram_sessions')
    .update({ contact_id: contact.id, context: {} })
    .eq('chat_id', chatId);

  return `Linked! Welcome, ${contact.full_name ?? email}. Send /help to see available commands.`;
}

async function handleStatus(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  session: Record<string, unknown>,
): Promise<string> {
  if (!session?.is_admin) {
    return 'Access denied. This command requires admin privileges.';
  }

  const dmUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/data-monitor`;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  try {
    const res = await fetch(dmUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${serviceKey}` },
      signal: AbortSignal.timeout(35_000),
    });

    const report = await res.json() as {
      checked_at: string;
      sites_checked: number;
      alerts_raised: number;
      alerts: Array<{ type: string; severity: string; message: string }>;
    };

    if (report.alerts_raised === 0) {
      return `✅ All systems clear\n${report.sites_checked} sites checked • ${new Date(report.checked_at).toLocaleTimeString('en-NZ')}`;
    }

    const lines = [`⚠️ ${report.alerts_raised} alert(s) detected:\n`];
    for (const alert of report.alerts) {
      const icon = alert.severity === 'critical' ? '🔴' : '🟡';
      lines.push(`${icon} ${alert.message}`);
    }
    lines.push(`\n${report.sites_checked} sites • ${new Date(report.checked_at).toLocaleTimeString('en-NZ')}`);
    return lines.join('\n');
  } catch (err: unknown) {
    console.error('[telegram-webhook][/status]', err);
    return 'Failed to fetch system status. Please try again.';
  }
}

async function handleLeads(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  session: Record<string, unknown>,
): Promise<void> {
  if (!session?.is_admin) {
    await sendMessage(chatId, 'Access denied. This command requires admin privileges.');
    return;
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: contacts } = await supabase
    .from('contacts')
    .select('id, full_name, email, phone, lead_score, tags, source_site')
    .gte('updated_at', since)
    .gte('lead_score', 60)
    .order('lead_score', { ascending: false })
    .limit(10);

  if (!contacts || contacts.length === 0) {
    await sendMessage(chatId, '📋 No leads with score ≥ 60 in the last 24h.');
    return;
  }

  for (const contact of contacts) {
    const tags = ((contact.tags as string[]) ?? []).join(', ') || 'none';
    const text = `👤 *${contact.full_name ?? 'Unknown'}*\nScore: ${contact.lead_score}/100\nEmail: ${contact.email}\nPhone: ${contact.phone ?? '—'}\nTags: ${tags}`;
    await sendInlineKeyboard(chatId, text, [
      [
        { text: '✅ Mark Qualified', callback_data: `qualify:${contact.id}` },
        { text: '📞 Request Call', callback_data: `call:${contact.id}` },
      ],
    ]);
  }
}

async function handleCallbackQuery(
  supabase: ReturnType<typeof createClient>,
  callbackQueryId: string,
  chatId: number,
  data: string,
): Promise<void> {
  const [action, contactId] = data.split(':');

  if (action === 'qualify') {
    const { data: contact } = await supabase
      .from('contacts')
      .select('tags')
      .eq('id', contactId)
      .single();
    const updatedTags = [...new Set([...((contact?.tags as string[]) ?? []), 'qualified'])];
    await supabase.from('contacts').update({ tags: updatedTags }).eq('id', contactId);
    await answerCallbackQuery(callbackQueryId, '✅ Marked as qualified');
  } else if (action === 'call') {
    await answerCallbackQuery(callbackQueryId, '📞 Call request noted');
    await sendMessage(chatId, `Call request logged for contact ${contactId}. Check Mission Control dashboard.`);
  } else {
    await answerCallbackQuery(callbackQueryId);
  }
}

// ── Tool Definitions ─────────────────────────────────────────────────────────

// ── Mock Data (returned when DB tables are empty — auto-detected per tool) ─────

const _mockNow = Date.now();
const _ago = (h: number) => new Date(_mockNow - h * 3_600_000).toISOString();
const _inDays = (d: number) => new Date(_mockNow + d * 86_400_000).toISOString().split('T')[0];

const MOCK = {
  contacts: [
    { id: 'c1111111-0000-0000-0000-000000000001', full_name: 'James Fletcher', email: 'james.fletcher@gmail.com', phone: '+64 21 555 0101', lead_score: 87, tags: ['qualified', 'hot-lead'], created_at: _ago(2), ai_notes: 'High-value residential rewire inquiry. Owns a 4-bed in Remuera. Urgency — wants quote within 48h.' },
    { id: 'c1111111-0000-0000-0000-000000000002', full_name: 'Sarah Ngata', email: 's.ngata@akfbuild.co.nz', phone: '+64 27 555 0202', lead_score: 72, tags: ['commercial'], created_at: _ago(5), ai_notes: 'Commercial fitout — retail shop in Newmarket. B2B lead. Budget ~$120k.' },
    { id: 'c1111111-0000-0000-0000-000000000003', full_name: 'David Park', email: 'dpark@outlook.com', phone: '+64 21 555 0303', lead_score: 55, tags: [], created_at: _ago(12), ai_notes: null },
    { id: 'c1111111-0000-0000-0000-000000000004', full_name: 'Emma Wilson', email: 'emma.w@cleanjet.co.nz', phone: '+64 9 555 0404', lead_score: 91, tags: ['vip', 'repeat-customer'], created_at: _ago(26), ai_notes: 'Long-term CleanJet customer. Runs 3 Airbnbs. Wants weekly service agreement.' },
    { id: 'c1111111-0000-0000-0000-000000000005', full_name: 'Tama Iti', email: 'tama@iti-developments.co.nz', phone: '+64 27 555 0505', lead_score: 68, tags: ['callback-needed'], created_at: _ago(36), ai_notes: 'Developer with 6-unit project. Interested in both electrical (Prime) and construction (AKF). Cross-sell opportunity.' },
  ],
  form_submissions: [
    { id: 'l0000001-0000-0000-0000-000000000001', name: 'James Fletcher', email: 'james.fletcher@gmail.com', phone: '+64 21 555 0101', source_site: 'prime', service_type: 'residential-rewire', message: 'Looking to get my whole house rewired. 4-bed home in Remuera. When can you come out?', lead_status: 'new', ai_notes: 'High-priority residential rewire. Homeowner in affluent area. Budget-unconstrained. Recommend same-day callback. Cross-sell: CleanJet post-construction clean.', created_at: _ago(2) },
    { id: 'l0000001-0000-0000-0000-000000000002', name: 'Sarah Ngata', email: 's.ngata@akfbuild.co.nz', phone: '+64 27 555 0202', source_site: 'akf', service_type: 'commercial-fitout', message: 'Need a commercial fitout for a retail space in Newmarket. Approx 200sqm. Timeline is 3 months.', lead_status: 'contacted', ai_notes: 'Commercial fitout — 200sqm retail. Fast timeline. Priority: qualify.', created_at: _ago(5) },
    { id: 'l0000001-0000-0000-0000-000000000003', name: 'Lily Chen', email: 'lily.chen@gmail.com', phone: '+64 9 555 0606', source_site: 'cleanjet', service_type: 'end-of-tenancy', message: 'Need a full end of tenancy clean for a 2-bed apartment in Ponsonby. Inspection is next Friday.', lead_status: 'new', ai_notes: 'Urgent end-of-tenancy clean. 7-day deadline. Standard pricing.', created_at: _ago(8) },
    { id: 'l0000001-0000-0000-0000-000000000004', name: 'Mike Solomon', email: 'mike.s@hotmail.com', phone: '+64 21 555 0707', source_site: 'prime', service_type: 'fault-repair', message: 'Circuit breaker keeps tripping in kitchen. Need an electrician ASAP.', lead_status: 'new', ai_notes: 'Urgent fault repair — safety risk. Same-day priority. Upsell: full switchboard inspection.', created_at: _ago(11) },
    { id: 'l0000001-0000-0000-0000-000000000005', name: 'Rachel Ho', email: 'r.ho@gmail.com', phone: '+64 21 555 0808', source_site: 'akf', service_type: 'renovation', message: 'Looking to do a kitchen and bathroom renovation on our Mt Eden home. Can we get a quote?', lead_status: 'new', ai_notes: 'Residential reno — kitchen + bathroom. Mt Eden. Mid-to-high budget likely.', created_at: _ago(18) },
  ],
  quotes: [
    { id: 'q0000001-0000-0000-0000-000000000001', contact_id: 'c1111111-0000-0000-0000-000000000001', lead_id: 'l0000001-0000-0000-0000-000000000001', status: 'sent', total_amount: 1240000, currency: 'NZD', ai_generated: true, notes: 'Full house rewire — 4 bed. Includes switchboard upgrade.', valid_until: _inDays(14), created_at: _ago(1) },
    { id: 'q0000001-0000-0000-0000-000000000002', contact_id: 'c1111111-0000-0000-0000-000000000002', lead_id: 'l0000001-0000-0000-0000-000000000002', status: 'accepted', total_amount: 11800000, currency: 'NZD', ai_generated: true, notes: 'Commercial fitout — Newmarket retail. Phase 1 scope.', valid_until: _inDays(30), created_at: _ago(3) },
    { id: 'q0000001-0000-0000-0000-000000000003', contact_id: 'c1111111-0000-0000-0000-000000000003', lead_id: null, status: 'draft', total_amount: 45000, currency: 'NZD', ai_generated: false, notes: 'Switchboard inspection and report.', valid_until: _inDays(7), created_at: _ago(6) },
    { id: 'q0000001-0000-0000-0000-000000000004', contact_id: 'c1111111-0000-0000-0000-000000000005', lead_id: null, status: 'rejected', total_amount: 2850000, currency: 'NZD', ai_generated: true, notes: '6-unit development — electrical rough-in.', valid_until: _inDays(-3), created_at: _ago(48) },
  ],
  quote_details: {
    id: 'q0000001-0000-0000-0000-000000000001',
    contact_id: 'c1111111-0000-0000-0000-000000000001',
    lead_id: 'l0000001-0000-0000-0000-000000000001',
    status: 'sent',
    total_amount: 1240000,
    currency: 'NZD',
    ai_generated: true,
    ai_notes: { reasoning: 'Standard rewire for 4-bed. Added switchboard upgrade due to age of board (1980s).', confidence: 0.91 },
    notes: 'Full house rewire — 4 bed. Includes switchboard upgrade.',
    valid_until: _inDays(14),
    consent_required: false,
    consent_notes: null,
    project_timeline_weeks: 2,
    start_date_estimate: _inDays(7),
    created_at: _ago(1),
    line_items: [
      { description: 'Full house rewire — 4 bedroom', quantity: 1, unit_price: 800000, total: 800000 },
      { description: 'Switchboard upgrade (100A)', quantity: 1, unit_price: 320000, total: 320000 },
      { description: 'Smoke detector installation', quantity: 6, unit_price: 8000, total: 48000 },
      { description: 'Compliance certificate & ESC', quantity: 1, unit_price: 72000, total: 72000 },
    ],
  },
  cross_sell_events: [
    { id: 'x0000001-0000-0000-0000-000000000001', lead_id: 'l0000001-0000-0000-0000-000000000002', source_brand: 'akf', target_brand: 'prime', pitch: 'Commercial fitout requires certified electrical work — Prime Electrical can handle fit-out wiring and compliance cert.', status: 'pending', created_at: _ago(4) },
    { id: 'x0000001-0000-0000-0000-000000000002', lead_id: 'l0000001-0000-0000-0000-000000000001', source_brand: 'prime', target_brand: 'cleanjet', pitch: 'Post-rewire construction clean recommended. CleanJet can do a full deep clean before furniture returns.', status: 'sent', created_at: _ago(1.5) },
    { id: 'x0000001-0000-0000-0000-000000000003', lead_id: 'l0000001-0000-0000-0000-000000000003', source_brand: 'cleanjet', target_brand: 'akf', pitch: 'End-of-tenancy client may need minor repairs before inspection — AKF small works can assist.', status: 'declined', created_at: _ago(7) },
    { id: 'x0000001-0000-0000-0000-000000000004', lead_id: 'l0000001-0000-0000-0000-000000000005', source_brand: 'prime', target_brand: 'akf', pitch: '6-unit developer also needs construction management. AKF is a natural fit for the build phase.', status: 'pending', created_at: _ago(36) },
  ],
  agent_actions: [
    { id: 'a0000001-0000-0000-0000-000000000001', action_type: 'qualify', status: 'success', confidence: 0.92, duration_ms: 1240, error: null, created_at: _ago(0.5) },
    { id: 'a0000001-0000-0000-0000-000000000002', action_type: 'quote_generate', status: 'success', confidence: 0.87, duration_ms: 3820, error: null, created_at: _ago(1) },
    { id: 'a0000001-0000-0000-0000-000000000003', action_type: 'cross_sell', status: 'success', confidence: 0.78, duration_ms: 890, error: null, created_at: _ago(1.5) },
    { id: 'a0000001-0000-0000-0000-000000000004', action_type: 'email_followup', status: 'failed', confidence: 0, duration_ms: 5001, error: 'SMTP timeout after 5000ms', created_at: _ago(2) },
    { id: 'a0000001-0000-0000-0000-000000000005', action_type: 'qualify', status: 'pending', confidence: null, duration_ms: null, error: null, created_at: _ago(0.1) },
    { id: 'a0000001-0000-0000-0000-000000000006', action_type: 'lead_enrich', status: 'success', confidence: 0.95, duration_ms: 2100, error: null, created_at: _ago(3) },
  ],
  outbound_queue: [
    { id: 'o0000001-0000-0000-0000-000000000001', delivery_type: 'email', destination_email: 'james.fletcher@gmail.com', status: 'delivered', attempt_count: 1, max_attempts: 3, created_at: _ago(1), error: null },
    { id: 'o0000001-0000-0000-0000-000000000002', delivery_type: 'email', destination_email: 's.ngata@akfbuild.co.nz', status: 'pending', attempt_count: 0, max_attempts: 3, created_at: _ago(0.25), error: null },
    { id: 'o0000001-0000-0000-0000-000000000003', delivery_type: 'telegram', destination_email: null, status: 'failed', attempt_count: 3, max_attempts: 3, created_at: _ago(3), error: 'Chat not found (403)' },
    { id: 'o0000001-0000-0000-0000-000000000004', delivery_type: 'webhook', destination_email: null, status: 'pending', attempt_count: 1, max_attempts: 5, created_at: _ago(0.5), error: 'Connection refused — will retry' },
  ],
  analytics: {
    total_leads: 47,
    leads_today: 4,
    leads_this_week: 23,
    by_site: { prime: 18, akf: 12, cleanjet: 17 },
    avg_lead_score: 72,
    qualified_count: 11,
    quotes_generated: 8,
    quotes_accepted: 3,
    pipeline_value_nzd: 284500,
    note: '(demo data — connect mc-analytics for live figures)',
  },
};

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'search_contacts',
      description: 'Search contacts/leads by name, email, lead score, or site. Use when the user asks about a specific person or wants filtered contacts.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Name or email fragment to search for' },
          min_score: { type: 'number', description: 'Minimum lead score (0–100)' },
          source_site: { type: 'string', enum: ['prime', 'akf', 'cleanjet'], description: 'Filter by brand site' },
          limit: { type: 'number', description: 'Max results to return (default 10, max 20)' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_lead_details',
      description: 'Get full details for a specific contact including AI notes, tags, score, and contact info.',
      parameters: {
        type: 'object',
        properties: {
          contact_id: { type: 'string', description: 'The contact UUID' },
        },
        required: ['contact_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_recent_leads',
      description: 'Get recent leads from the last N hours, with optional site and score filters.',
      parameters: {
        type: 'object',
        properties: {
          hours: { type: 'number', description: 'Look-back window in hours (default 24)' },
          source_site: { type: 'string', enum: ['prime', 'akf', 'cleanjet'], description: 'Filter by brand site' },
          min_score: { type: 'number', description: 'Minimum lead score (0–100)' },
          limit: { type: 'number', description: 'Max results (default 10, max 25)' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_analytics',
      description: 'Get business analytics: lead counts, site performance, recent activity totals.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'qualify_contact',
      description: 'Mark a contact as qualified by adding the "qualified" tag. Admin only. Use only when the user explicitly requests it.',
      parameters: {
        type: 'object',
        properties: {
          contact_id: { type: 'string', description: 'The contact UUID to qualify' },
        },
        required: ['contact_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_system_status',
      description: 'Get the current system health report from the data monitor. Admin only.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_form_submissions',
      description: 'Get recent website form submissions (leads table) with ai_notes and service type. Use when user asks about recent enquiries, form leads, or submissions by brand.',
      parameters: {
        type: 'object',
        properties: {
          hours: { type: 'number', description: 'Look-back window in hours (default 24)' },
          source_site: { type: 'string', enum: ['prime', 'akf', 'cleanjet'], description: 'Filter by brand' },
          limit: { type: 'number', description: 'Max results (default 10, max 25)' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_quotes',
      description: 'Get AI-generated quotes — status, amounts, and timing. Use for questions about quote volume, revenue pipeline, or accepted/pending quotes.',
      parameters: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'], description: 'Filter by quote status' },
          hours: { type: 'number', description: 'Look-back window in hours (default 48)' },
          limit: { type: 'number', description: 'Max results (default 10, max 20)' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_quote_details',
      description: 'Get full details for a specific quote including all line items and pricing breakdown.',
      parameters: {
        type: 'object',
        properties: {
          quote_id: { type: 'string', description: 'The quote UUID' },
        },
        required: ['quote_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_cross_sell_events',
      description: 'Get cross-sell events — when a lead from one brand was pitched to another. Use to see cross-brand opportunities.',
      parameters: {
        type: 'object',
        properties: {
          source_brand: { type: 'string', enum: ['prime', 'akf', 'cleanjet'], description: 'Brand that originated the lead' },
          target_brand: { type: 'string', enum: ['prime', 'akf', 'cleanjet'], description: 'Brand that was pitched' },
          hours: { type: 'number', description: 'Look-back window in hours (default 72)' },
          limit: { type: 'number', description: 'Max results (default 10, max 25)' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_agent_actions',
      description: 'Get recent AI agent activity — what agents did, their status and outcome.',
      parameters: {
        type: 'object',
        properties: {
          action_type: { type: 'string', description: 'Filter by action type (e.g. qualify, email, quote)' },
          status: { type: 'string', enum: ['pending', 'success', 'failed'], description: 'Filter by status' },
          hours: { type: 'number', description: 'Look-back window in hours (default 24)' },
          limit: { type: 'number', description: 'Max results (default 15, max 30)' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_outbound_queue',
      description: 'Get the outbound message queue — pending/failed emails, Telegram alerts, webhooks.',
      parameters: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['pending', 'processing', 'delivered', 'failed', 'cancelled'], description: 'Filter by status' },
          delivery_type: { type: 'string', description: 'Filter by type (email, telegram, webhook)' },
          limit: { type: 'number', description: 'Max results (default 10, max 20)' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_contact_tag',
      description: 'Add a custom tag to a contact. Admin only. Use for labelling beyond qualifying (e.g. vip, callback-needed, hot-lead).',
      parameters: {
        type: 'object',
        properties: {
          contact_id: { type: 'string', description: 'The contact UUID' },
          tag: { type: 'string', description: 'Tag to add (e.g. "vip", "callback-needed", "hot-lead")' },
        },
        required: ['contact_id', 'tag'],
      },
    },
  },
];

// ── Tool Executor ─────────────────────────────────────────────────────────────

async function executeTool(
  supabase: ReturnType<typeof createClient>,
  name: string,
  args: Record<string, unknown>,
  session: Record<string, unknown>,
): Promise<unknown> {
  switch (name) {
    case 'search_contacts': {
      const query = args.query as string | undefined;
      const minScore = args.min_score as number | undefined;
      const limit = Math.min((args.limit as number) || 10, 20);

      // contacts.source_site is a UUID FK — cannot filter by brand string here
      // Use get_form_submissions for brand-filtered lead queries
      let q = supabase
        .from('contacts')
        .select('id, full_name, email, phone, lead_score, tags, created_at, ai_notes')
        .order('lead_score', { ascending: false })
        .limit(limit);

      if (query) q = q.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
      if (minScore !== undefined) q = q.gte('lead_score', minScore);

      const { data, error } = await q;
      if (error) return { error: error.message };
      if ((data?.length ?? 0) > 0) return { contacts: data, count: data!.length };

      // Fallback: filter mock contacts
      let mock = MOCK.contacts;
      if (query) mock = mock.filter(c => c.full_name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()));
      if (minScore !== undefined) mock = mock.filter(c => c.lead_score >= minScore);
      mock = mock.slice(0, limit);
      return { contacts: mock, count: mock.length, _mock: true };
    }

    case 'get_lead_details': {
      const contactId = args.contact_id as string;
      const { data, error } = await supabase
        .from('contacts')
        .select('id, full_name, email, phone, lead_score, tags, source_site, created_at, updated_at, ai_notes')
        .eq('id', contactId)
        .single();
      if (!error && data) return { contact: data };

      // Fallback: find in mock by id, or return first mock contact
      const mock = MOCK.contacts.find(c => c.id === contactId) ?? MOCK.contacts[0];
      return { contact: mock, _mock: true };
    }

    case 'get_recent_leads': {
      const hours = (args.hours as number) || 24;
      const minScore = args.min_score as number | undefined;
      const limit = Math.min((args.limit as number) || 10, 25);
      const since = new Date(Date.now() - hours * 3_600_000).toISOString();

      // Queries contacts (CRM) sorted by recency — use get_form_submissions for brand filtering
      let q = supabase
        .from('contacts')
        .select('id, full_name, email, phone, lead_score, tags, created_at, ai_notes')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (minScore !== undefined) q = q.gte('lead_score', minScore);

      const { data, error } = await q;
      if (error) return { error: error.message };
      if ((data?.length ?? 0) > 0) return { leads: data, count: data!.length, period_hours: hours };

      // Fallback: filter mock contacts
      let mock = MOCK.contacts;
      if (minScore !== undefined) mock = mock.filter(c => c.lead_score >= minScore);
      mock = mock.slice(0, limit);
      return { leads: mock, count: mock.length, period_hours: hours, _mock: true };
    }

    case 'get_analytics': {
      const url = `${Deno.env.get('SUPABASE_URL')}/functions/v1/mc-analytics`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!}` },
        signal: AbortSignal.timeout(15_000),
      });
      if (res.ok) return { analytics: await res.json() };
      return { analytics: MOCK.analytics, _mock: true };
    }

    case 'qualify_contact': {
      if (!session?.is_admin) return { error: 'Admin access required to qualify contacts' };
      const contactId = args.contact_id as string;
      const { data: contact } = await supabase
        .from('contacts')
        .select('tags, full_name')
        .eq('id', contactId)
        .single();
      if (!contact) return { error: 'Contact not found' };
      const updatedTags = [...new Set([...((contact.tags as string[]) ?? []), 'qualified'])];
      const { error } = await supabase.from('contacts').update({ tags: updatedTags }).eq('id', contactId);
      if (error) return { error: error.message };
      return { success: true, message: `${contact.full_name ?? contactId} marked as qualified` };
    }

    case 'get_system_status': {
      if (!session?.is_admin) return { error: 'Admin access required for system status' };
      const dmUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/data-monitor`;
      const res = await fetch(dmUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!}` },
        signal: AbortSignal.timeout(35_000),
      });
      return { status: await res.json() };
    }

    case 'get_form_submissions': {
      const hours = (args.hours as number) || 24;
      const sourceSite = args.source_site as string | undefined;
      const limit = Math.min((args.limit as number) || 10, 25);
      const since = new Date(Date.now() - hours * 3_600_000).toISOString();

      let q = supabase
        .from('leads')
        .select('id, name, email, phone, source_site, service_type, message, lead_status, ai_notes, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (sourceSite) q = q.eq('source_site', sourceSite);

      const { data, error } = await q;
      if (error) return { error: error.message };
      if ((data?.length ?? 0) > 0) return { submissions: data, count: data!.length, period_hours: hours };

      // Fallback: filter mock submissions
      let mock = MOCK.form_submissions;
      if (sourceSite) mock = mock.filter(s => s.source_site === sourceSite);
      mock = mock.slice(0, limit);
      return { submissions: mock, count: mock.length, period_hours: hours, _mock: true };
    }

    case 'get_quotes': {
      const status = args.status as string | undefined;
      const hours = (args.hours as number) || 48;
      const limit = Math.min((args.limit as number) || 10, 20);
      const since = new Date(Date.now() - hours * 3_600_000).toISOString();

      let q = supabase
        .from('quotes')
        .select('id, contact_id, lead_id, status, total_amount, currency, ai_generated, notes, valid_until, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status) q = q.eq('status', status);

      const { data, error } = await q;
      if (error) return { error: error.message };
      if ((data?.length ?? 0) > 0) return { quotes: data, count: data!.length };

      // Fallback: filter mock quotes
      let mock = MOCK.quotes;
      if (status) mock = mock.filter(q => q.status === status);
      mock = mock.slice(0, limit);
      return { quotes: mock, count: mock.length, _mock: true };
    }

    case 'get_quote_details': {
      const quoteId = args.quote_id as string;
      const [{ data: quote, error: qErr }, { data: lineItems, error: liErr }] = await Promise.all([
        supabase
          .from('quotes')
          .select('id, contact_id, lead_id, status, total_amount, currency, ai_generated, ai_notes, notes, valid_until, consent_required, consent_notes, project_timeline_weeks, start_date_estimate, created_at')
          .eq('id', quoteId)
          .single(),
        supabase
          .from('quote_line_items')
          .select('description, quantity, unit_price, total')
          .eq('quote_id', quoteId)
          .order('sort_order'),
      ]);
      if (!qErr && quote) return { quote: { ...quote, line_items: lineItems ?? [] } };
      if (liErr) return { error: liErr.message };

      // Fallback: return mock quote details
      return { quote: MOCK.quote_details, _mock: true };
    }

    case 'get_cross_sell_events': {
      const sourceBrand = args.source_brand as string | undefined;
      const targetBrand = args.target_brand as string | undefined;
      const hours = (args.hours as number) || 72;
      const limit = Math.min((args.limit as number) || 10, 25);
      const since = new Date(Date.now() - hours * 3_600_000).toISOString();

      let q = supabase
        .from('cross_sell_events')
        .select('id, lead_id, source_brand, target_brand, pitch, status, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (sourceBrand) q = q.eq('source_brand', sourceBrand);
      if (targetBrand) q = q.eq('target_brand', targetBrand);

      const { data, error } = await q;
      if (error) return { error: error.message };
      if ((data?.length ?? 0) > 0) return { events: data, count: data!.length };

      // Fallback: filter mock events
      let mock = MOCK.cross_sell_events;
      if (sourceBrand) mock = mock.filter(e => e.source_brand === sourceBrand);
      if (targetBrand) mock = mock.filter(e => e.target_brand === targetBrand);
      mock = mock.slice(0, limit);
      return { events: mock, count: mock.length, _mock: true };
    }

    case 'get_agent_actions': {
      const actionType = args.action_type as string | undefined;
      const status = args.status as string | undefined;
      const hours = (args.hours as number) || 24;
      const limit = Math.min((args.limit as number) || 15, 30);
      const since = new Date(Date.now() - hours * 3_600_000).toISOString();

      let q = supabase
        .from('agent_actions')
        .select('id, action_type, status, confidence, duration_ms, error, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (actionType) q = q.eq('action_type', actionType);
      if (status) q = q.eq('status', status);

      const { data, error } = await q;
      if (error) return { error: error.message };
      if ((data?.length ?? 0) > 0) return { actions: data, count: data!.length };

      // Fallback: filter mock actions
      let mock = MOCK.agent_actions;
      if (actionType) mock = mock.filter(a => a.action_type === actionType);
      if (status) mock = mock.filter(a => a.status === status);
      mock = mock.slice(0, limit);
      return { actions: mock, count: mock.length, _mock: true };
    }

    case 'get_outbound_queue': {
      const status = args.status as string | undefined;
      const deliveryType = args.delivery_type as string | undefined;
      const limit = Math.min((args.limit as number) || 10, 20);

      let q = supabase
        .from('outbound_queue')
        .select('id, delivery_type, destination_email, status, attempt_count, max_attempts, created_at, error')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status) q = q.eq('status', status);
      if (deliveryType) q = q.eq('delivery_type', deliveryType);

      const { data, error } = await q;
      if (error) return { error: error.message };
      if ((data?.length ?? 0) > 0) return { queue: data, count: data!.length };

      // Fallback: filter mock queue
      let mock = MOCK.outbound_queue;
      if (status) mock = mock.filter(q => q.status === status);
      if (deliveryType) mock = mock.filter(q => q.delivery_type === deliveryType);
      mock = mock.slice(0, limit);
      return { queue: mock, count: mock.length, _mock: true };
    }

    case 'add_contact_tag': {
      if (!session?.is_admin) return { error: 'Admin access required to add tags' };
      const contactId = args.contact_id as string;
      const tag = (args.tag as string)?.trim();
      if (!tag) return { error: 'Tag cannot be empty' };

      const { data: contact } = await supabase
        .from('contacts')
        .select('tags, full_name')
        .eq('id', contactId)
        .single();
      if (!contact) return { error: 'Contact not found' };

      const updatedTags = [...new Set([...((contact.tags as string[]) ?? []), tag])];
      const { error } = await supabase.from('contacts').update({ tags: updatedTags }).eq('id', contactId);
      if (error) return { error: error.message };
      return { success: true, message: `Tag "${tag}" added to ${contact.full_name ?? contactId}` };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// ── Freeform Handler (Agentic Loop) ───────────────────────────────────────────

interface LLMMessage {
  role: string;
  content: string | null;
  tool_calls?: Array<{ id: string; type: string; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
}

async function handleFreeform(
  supabase: ReturnType<typeof createClient>,
  chatId: number,
  text: string,
  session: Record<string, unknown>,
): Promise<string> {
  const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
  const model = Deno.env.get('OPENROUTER_MODEL') ?? 'openai/gpt-4o-mini';

  if (!openRouterKey) return 'AI assistant is not configured.';

  const context = (session?.context as Record<string, unknown>) ?? {};
  const history = (context.messages as LLMMessage[]) ?? [];

  // Load agent memory if contact linked
  let memoryContext = '';
  if (session?.contact_id) {
    const { data: memory } = await supabase
      .from('agent_memory')
      .select('memory_type, content')
      .eq('contact_id', session.contact_id)
      .order('created_at', { ascending: false })
      .limit(5);
    if (memory?.length) {
      memoryContext = '\n\nYour memory about this contact:\n' +
        memory.map((m: { memory_type: string; content: string }) => `[${m.memory_type}] ${m.content}`).join('\n');
    }
  }

  const systemPrompt = `You are the Mission Control AI assistant for United Trades, which operates three NZ businesses:
- Prime Electrical (electrical services, site: prime)
- AKF Construction (construction & renovation, site: akf)
- CleanJet (cleaning services, site: cleanjet)

You help operators understand and act on business data using your tools. When a question requires live data, call the appropriate tool — don't guess or make up numbers.

TOOLS AVAILABLE:
Contacts & leads:
- search_contacts — find CRM contacts by name, email, or score
- get_lead_details — full profile for a specific contact
- get_recent_leads — recent CRM contacts by creation date
- get_form_submissions — website form submissions with ai_notes and service type (supports brand filter)
- get_analytics — business analytics summary
Cross-sell & quotes:
- get_quotes — AI-generated quotes (status, amounts, pipeline)
- get_quote_details — full quote with line items breakdown
- get_cross_sell_events — cross-brand pitch events and their status
Agent & system:
- get_agent_actions — recent AI agent activity log
- get_outbound_queue — pending/failed outbound messages
- get_system_status — system health report (admin only)
Write actions (admin only):
- qualify_contact — mark a contact as qualified
- add_contact_tag — add any custom tag to a contact

COMMANDS (mention when relevant):
- /leads — recent high-scoring leads with action buttons
- /status — system health report
- /help — all commands

RULES:
- Call tools when the user needs live data — don't answer from memory if data could be stale
- For operations beyond qualifying (delete, edit, send email) — direct them to the Mission Control dashboard
- Keep responses concise; use plain text (no markdown unless asked)${memoryContext}`;

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6),
    { role: 'user', content: text },
  ];

  try {
    // Agentic loop — max 4 iterations to prevent runaway tool chains
    for (let iteration = 0; iteration < 4; iteration++) {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
        },
        body: JSON.stringify({ model, messages, tools: TOOLS, tool_choice: 'auto', max_tokens: 1000 }),
        signal: AbortSignal.timeout(30_000),
      });

      const data = await res.json() as { choices: Array<{ finish_reason: string; message: LLMMessage }> };
      const choice = data.choices?.[0];
      if (!choice) break;

      const assistantMsg = choice.message;
      messages.push(assistantMsg);

      if (choice.finish_reason === 'tool_calls' || assistantMsg.tool_calls?.length) {
        // Execute each tool and append results
        for (const toolCall of assistantMsg.tool_calls ?? []) {
          let result: unknown;
          try {
            const toolArgs = JSON.parse(toolCall.function.arguments) as Record<string, unknown>;
            result = await executeTool(supabase, toolCall.function.name, toolArgs, session);
            console.log(`[telegram-webhook][tool] ${toolCall.function.name} →`, JSON.stringify(result).slice(0, 200));
          } catch (e) {
            result = { error: `Tool failed: ${e instanceof Error ? e.message : String(e)}` };
          }
          messages.push({ role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(result) });
        }
        continue; // Let the LLM synthesise a response with the tool results
      }

      // Final text response — persist history and return
      const reply = assistantMsg.content ?? 'No response from AI.';
      const updatedHistory = [...history, { role: 'user', content: text }, { role: 'assistant', content: reply }];
      await supabase.from('telegram_sessions').update({
        context: { messages: updatedHistory.slice(-10) },
      }).eq('chat_id', chatId);

      return reply;
    }

    return 'I could not complete your request after several attempts. Please try rephrasing.';
  } catch (err: unknown) {
    console.error('[telegram-webhook][freeform]', err);
    return 'Sorry, I could not process your request right now.';
  }
}

// ── Rate Limiter ──────────────────────────────────────────────────────────────

const rateLimitMap = new Map<number, { count: number; resetAt: number }>();

function isRateLimited(chatId: number, maxPerMinute = 10): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(chatId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(chatId, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  if (entry.count >= maxPerMinute) return true;
  entry.count++;
  return false;
}

// ── Main Handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request): Promise<Response> => {
  const startTime = Date.now();

  const secret = Deno.env.get('TELEGRAM_WEBHOOK_SECRET');
  if (!secret) {
    console.error('[telegram-webhook] TELEGRAM_WEBHOOK_SECRET not set');
    return new Response('Internal Server Error', { status: 500 });
  }

  const tokenHeader = req.headers.get('X-Telegram-Bot-Api-Secret-Token');
  if (!verifyTelegramToken(tokenHeader, secret)) {
    console.warn('[telegram-webhook] Invalid token | ip=', req.headers.get('cf-connecting-ip') ?? 'unknown');
    return new Response('Unauthorized', { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = await req.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const message = update.message;
  const callbackQuery = update.callback_query;

  // Handle inline button taps
  if (callbackQuery?.data) {
    const cqChatId = callbackQuery.message?.chat.id ?? callbackQuery.from.id;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    try {
      await handleCallbackQuery(supabase, callbackQuery.id, cqChatId, callbackQuery.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[telegram-webhook] callback_query error:', msg);
    }
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!message?.text) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const chatId = message.chat.id;
  const text = message.text.trim();

  if (isRateLimited(chatId)) {
    await sendMessage(chatId, 'Too many requests. Please wait a moment before sending another message.');
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    const session = await getOrCreateSession(supabase, chatId, message.from);
    await logMessage(supabase, chatId, 'inbound', text);

    const context = (session?.context as Record<string, unknown>) ?? {};
    let reply: string;

    if (context.pending_action === 'await_email') {
      reply = await handleEmailLink(supabase, chatId, text);
    } else if (text === '/start') {
      reply = await handleStart(supabase, chatId, session);
    } else if (text === '/status') {
      reply = await handleStatus(supabase, chatId, session);
    } else if (text === '/leads') {
      await handleLeads(supabase, chatId, session);
      await logMessage(supabase, chatId, 'outbound', '[/leads response sent]');
      const duration = Date.now() - startTime;
      console.log(`[telegram-webhook] chat=${chatId} cmd=/leads duration=${duration}ms`);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (text === '/help') {
      reply = 'Available commands:\n/start — link your account\n/status — system health\n/leads — recent leads\n/help — this message\n\nOr just ask me anything about Mission Control!';
    } else {
      await sendTyping(chatId);
      reply = await handleFreeform(supabase, chatId, text, session);
    }

    await sendMessage(chatId, reply);
    await logMessage(supabase, chatId, 'outbound', reply);

    const duration = Date.now() - startTime;
    console.log(`[telegram-webhook] chat=${chatId} duration=${duration}ms`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[telegram-webhook] handler error:', msg);
    try {
      const errorChatId = message?.chat?.id;
      if (errorChatId) {
        await sendMessage(errorChatId, 'Sorry, something went wrong. Please try again in a moment.');
      }
    } catch {
      // ignore secondary error
    }
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
