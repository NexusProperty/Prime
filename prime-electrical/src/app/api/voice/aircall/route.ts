/**
 * Aircall Webhook → Callback Router
 *
 * Receives call.ended and call.voicemail_left events from Aircall.
 * When a call is missed or voicemail left, runs a two-track callback:
 *
 * Track 1 — Vapi AI (Max): Tries to call the customer back using the
 *   Twilio phone number so Max handles the conversation automatically.
 *
 * Track 2 — Aircall human fallback: If Vapi fails, uses the Aircall API
 *   to ring Weijie's Aircall app, which then connects to the customer
 *   from the NZ number +64 9 873 4246.
 *
 * Aircall webhook config:
 *   URL:    https://prime-electrical-nu.vercel.app/api/voice/aircall
 *   Events: call.ended, call.voicemail_left
 *   Token:  AIRCALL_WEBHOOK_TOKEN env var
 *
 * Required env vars:
 *   AIRCALL_API_ID / AIRCALL_API_TOKEN  — Aircall Basic Auth
 *   AIRCALL_WEBHOOK_TOKEN               — webhook signature validation
 *   AIRCALL_NUMBER_ID                   — Aircall number to call from (1206933)
 *   AIRCALL_USER_ID                     — Weijie's Aircall user ID (1864716)
 *   VAPI_API_KEY / VAPI_ASSISTANT_PRIME — Vapi AI
 *   VAPI_PHONE_NUMBER_ID                — Twilio number ID in Vapi
 */
import { NextRequest, NextResponse } from 'next/server'

const VAPI_BASE    = 'https://api.vapi.ai'
const AIRCALL_BASE = 'https://api.aircall.io/v1'

interface AircallPayload {
  event: string
  token: string
  data: {
    id: number
    direction: 'inbound' | 'outbound'
    status: string
    duration: number
    raw_digits: string
    number: { digits: string; id: number }
    user?: { id: number; name: string }
  }
}

function isMissedCall(payload: AircallPayload): boolean {
  const { event, data } = payload
  if (event === 'call.voicemail_left') return true
  if (event === 'call.ended') {
    return (
      data.direction === 'inbound' &&
      (data.status === 'missed' || data.duration === 0)
    )
  }
  return false
}

/** Track 1: Vapi AI calls the customer back with Max */
async function tryVapiCallback(callerNumber: string): Promise<{ ok: boolean; callId?: string; error?: string }> {
  const vapiKey       = process.env.VAPI_API_KEY
  const assistantId   = process.env.VAPI_ASSISTANT_PRIME
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID  // Twilio number in Vapi

  if (!vapiKey || !assistantId || !phoneNumberId) {
    return { ok: false, error: 'Vapi env vars not set' }
  }

  const res = await fetch(`${VAPI_BASE}/call/phone`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${vapiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      assistantId,
      phoneNumberId,
      customer: { number: callerNumber },
      assistantOverrides: {
        firstMessage: `Hi, this is Max from Prime Electrical — I see you just tried to reach us. How can I help?`,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return { ok: false, error: err }
  }

  const data = await res.json()
  return { ok: true, callId: data.id }
}

/**
 * Track 2: Aircall outbound call — rings Weijie's Aircall app first,
 * then connects to the customer from the NZ number.
 */
async function tryAircallCallback(callerNumber: string): Promise<{ ok: boolean; callId?: number; error?: string }> {
  const apiId    = process.env.AIRCALL_API_ID
  const apiToken = process.env.AIRCALL_API_TOKEN
  const userId   = process.env.AIRCALL_USER_ID   || '1864716'
  const numberId = process.env.AIRCALL_NUMBER_ID  || '1206933'

  if (!apiId || !apiToken) {
    return { ok: false, error: 'Aircall credentials not set' }
  }

  const auth = Buffer.from(`${apiId}:${apiToken}`).toString('base64')

  const res = await fetch(`${AIRCALL_BASE}/calls`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id:   parseInt(userId),
      number_id: parseInt(numberId),
      to:        callerNumber,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return { ok: false, error: err }
  }

  const data = await res.json()
  return { ok: true, callId: data.call?.id }
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AircallPayload

  // Validate webhook token
  const expectedToken = process.env.AIRCALL_WEBHOOK_TOKEN
  if (expectedToken && body.token !== expectedToken) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!isMissedCall(body)) {
    return NextResponse.json({ ok: true, action: 'ignored' })
  }

  const callerNumber = body.data.raw_digits
  if (!callerNumber || callerNumber === 'anonymous') {
    return NextResponse.json({ ok: true, action: 'anonymous_caller_skipped' })
  }

  // Track 1: try Vapi AI callback
  const vapiResult = await tryVapiCallback(callerNumber)
  if (vapiResult.ok) {
    console.log('[callback] Vapi AI callback OK → callId:', vapiResult.callId, '→', callerNumber)
    return NextResponse.json({ ok: true, action: 'vapi_ai_callback', callId: vapiResult.callId, to: callerNumber })
  }

  console.warn('[callback] Vapi failed:', vapiResult.error, '— falling back to Aircall')

  // Track 2: Aircall human callback fallback
  const aircallResult = await tryAircallCallback(callerNumber)
  if (aircallResult.ok) {
    console.log('[callback] Aircall human callback OK → callId:', aircallResult.callId, '→', callerNumber)
    return NextResponse.json({ ok: true, action: 'aircall_human_callback', callId: aircallResult.callId, to: callerNumber })
  }

  console.error('[callback] Both tracks failed. Aircall error:', aircallResult.error)
  return NextResponse.json(
    { ok: false, action: 'both_failed', vapiError: vapiResult.error, aircallError: aircallResult.error },
    { status: 502 }
  )
}
