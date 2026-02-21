/**
 * PHASE3-003 — Emergency Escalation Tool Endpoint
 *
 * Called by Vapi.ai when the voice assistant invokes the `escalateEmergency`
 * custom tool during a live call. Sends an immediate Twilio SMS to the
 * on-call electrician, then returns a reassuring message for Vapi.ai to
 * relay to the caller.
 *
 * Vapi.ai tool configuration (add to each assistant):
 *   Name:        escalateEmergency
 *   Description: Call this immediately if the customer mentions sparking,
 *                electrical fire, electric shock, power outage, or any
 *                electrical emergency. Do not hesitate.
 *   Parameters:
 *     situation  (string, required) — brief description of the emergency
 *   Server URL:  https://theprimeelectrical.co.nz/api/voice/emergency
 *
 * Required env vars: ON_CALL_PHONE_NUMBER, TWILIO_* (already set from PHASE1-003)
 */
import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-vapi-secret')
  if (process.env.VAPI_WEBHOOK_SECRET && secret !== process.env.VAPI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const msg = body?.message ?? body
  const toolCallList = msg?.toolCallList ?? []
  const toolCall = toolCallList[0] ?? {}
  const toolCallId = toolCall?.id ?? 'unknown'
  const callerNumber = msg?.customer?.number ?? 'unknown number'

  let situation = 'Electrical emergency reported during call'
  try {
    const args = JSON.parse(toolCall?.function?.arguments ?? '{}')
    if (args.situation) situation = String(args.situation)
  } catch {
    /* keep default */
  }

  // Alert the on-call electrician immediately
  const onCallNumber = process.env.ON_CALL_PHONE_NUMBER
  if (onCallNumber) {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    await client.messages.create({
      to: onCallNumber,
      from: process.env.TWILIO_FROM_NUMBER ?? '',
      body: `⚡ EMERGENCY — ${situation}. Caller: ${callerNumber}. Call them back NOW.`,
    }).catch(console.error)
  }

  // Return the tool result — Vapi.ai reads this aloud to the caller
  return NextResponse.json({
    results: [
      {
        toolCallId,
        result:
          'I have alerted our emergency electrician. They will call you back within minutes. ' +
          'If you are in immediate danger, please call 111 now.',
      },
    ],
  })
}
