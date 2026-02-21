/**
 * Aircall Webhook → Vapi AI Callback
 *
 * Receives call.ended and call.voicemail_left events from Aircall.
 * When a call is missed (ended with duration 0 and no answer) or a
 * voicemail is left, triggers Vapi to call the customer back with Max.
 *
 * Aircall webhook config:
 *   URL:    https://theprimeelectrical.co.nz/api/voice/aircall
 *   Events: call.ended, call.voicemail_left
 *   Token:  set AIRCALL_WEBHOOK_TOKEN in .env.local
 *
 * Required env vars:
 *   AIRCALL_WEBHOOK_TOKEN   — from Aircall webhook creation response
 *   VAPI_API_KEY            — already set
 *   VAPI_ASSISTANT_PRIME    — already set
 *   VAPI_PHONE_NUMBER_ID    — ID of the Vapi phone number to call out from
 */
import { NextRequest, NextResponse } from 'next/server'

const VAPI_BASE = 'https://api.vapi.ai'

/** Aircall call.ended payload shape (partial) */
interface AircallPayload {
  event: string
  token: string
  data: {
    id: number
    direction: 'inbound' | 'outbound'
    status: string          // "missed", "answered", "done", "voicemail"
    duration: number        // seconds
    missed_call_reason?: string
    raw_digits: string      // caller number e.g. "+64212345678"
    number: {
      digits: string        // Aircall number dialled
      id: number
    }
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

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AircallPayload

  // Validate Aircall webhook token
  const expectedToken = process.env.AIRCALL_WEBHOOK_TOKEN
  if (expectedToken && body.token !== expectedToken) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Only act on missed/voicemail calls
  if (!isMissedCall(body)) {
    return NextResponse.json({ ok: true, action: 'ignored' })
  }

  const callerNumber = body.data.raw_digits
  if (!callerNumber || callerNumber === 'anonymous') {
    return NextResponse.json({ ok: true, action: 'anonymous_caller_skipped' })
  }

  // Trigger Vapi outbound call — Max calls the missed caller back
  const vapiKey        = process.env.VAPI_API_KEY
  const assistantId    = process.env.VAPI_ASSISTANT_PRIME
  const phoneNumberId  = process.env.VAPI_PHONE_NUMBER_ID

  if (!vapiKey || !assistantId || !phoneNumberId) {
    console.error('[aircall-webhook] Missing Vapi env vars')
    return NextResponse.json({ error: 'Vapi not configured' }, { status: 500 })
  }

  const vapiPayload = {
    assistantId,
    phoneNumberId,
    customer: { number: callerNumber },
    assistantOverrides: {
      firstMessage: `Hi, this is Max from Prime Electrical calling back — I see you tried to reach us just now. How can I help?`,
    },
  }

  const vapiRes = await fetch(`${VAPI_BASE}/call/phone`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${vapiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vapiPayload),
  })

  if (!vapiRes.ok) {
    const err = await vapiRes.text()
    console.error('[aircall-webhook] Vapi error:', err)
    return NextResponse.json({ error: 'Vapi call failed', detail: err }, { status: 502 })
  }

  const vapiCall = await vapiRes.json()
  console.log('[aircall-webhook] Vapi callback initiated:', vapiCall.id, '→', callerNumber)

  return NextResponse.json({
    ok: true,
    action: 'vapi_callback_triggered',
    callId: vapiCall.id,
    to: callerNumber,
  })
}
