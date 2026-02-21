/**
 * PHASE1-003 — Missed Call Text-Back Webhook
 *
 * Twilio setup (one-time, in Twilio Console):
 *   1. Phone Numbers → select your Prime Electrical number
 *   2. "Voice Configuration" → "Status Callback URL":
 *        https://theprimeelectrical.co.nz/api/missed-call
 *   3. "Status Callback HTTP Method" → POST  →  Save
 *
 * Every call that goes unanswered (no-answer / busy / failed) now
 * triggers an automatic SMS reply to the caller's number.
 *
 * Required env vars: see .env.local.example at the project root.
 */
import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const MISSED_STATUSES = new Set(['no-answer', 'busy', 'failed', 'canceled'])

const REPLY_BODY =
  "Hi! Sorry we missed your call to Prime Electrical ⚡ We'll call you back shortly. " +
  'Or book online: https://theprimeelectrical.co.nz/#contact'

/** In-memory dedup: prevents double-SMS when Twilio retries a slow webhook. */
const seenCallSids = new Set<string>()

const TWIML_OK = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>'
const XML = { 'Content-Type': 'text/xml' }

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const params = Object.fromEntries(new URLSearchParams(rawBody))

  const callSid = params['CallSid'] ?? ''
  const callStatus = params['CallStatus'] ?? ''
  const callerNumber = params['From'] ?? ''

  if (!MISSED_STATUSES.has(callStatus) || !callerNumber || seenCallSids.has(callSid)) {
    return new NextResponse(TWIML_OK, { headers: XML })
  }

  // Verify the request really came from Twilio (skip when SITE_URL is unset, e.g. local dev)
  const siteUrl = process.env.SITE_URL
  const authToken = process.env.TWILIO_AUTH_TOKEN ?? ''
  if (siteUrl) {
    const signature = request.headers.get('x-twilio-signature') ?? ''
    const webhookUrl = `${siteUrl}/api/missed-call`
    if (!twilio.validateRequest(authToken, signature, webhookUrl, params)) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  seenCallSids.add(callSid)

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, authToken)
  await client.messages.create({
    to: callerNumber,
    from: process.env.TWILIO_FROM_NUMBER ?? '',
    body: REPLY_BODY,
  })

  return new NextResponse(TWIML_OK, { headers: XML })
}
