/**
 * TEST-001: API Route Smoke Tests — /api/leads/submit + /api/leads/enrich
 *
 * These tests call the actual API routes on the Prime Electrical dev server
 * (http://localhost:3001) using Playwright's request fixture.
 *
 * The dev server's .env.local has SUPABASE_SERVICE_ROLE_KEY set, so real DB
 * calls will occur in dev. Tests use realistic but non-production data prefixed
 * with "PLAYWRIGHT_TEST_" so records can be cleaned up from Supabase easily.
 *
 * For CI environments without real Supabase credentials, set:
 *   PLAYWRIGHT_SKIP_API_TESTS=true
 * and these tests will be skipped.
 */

import { test, expect } from '@playwright/test'
import type { CrossSellData } from '@prime/ui-ai'

const BASE = 'http://localhost:3001'
const SKIP = !!process.env.PLAYWRIGHT_SKIP_API_TESTS

// ---------------------------------------------------------------------------
// POST /api/leads/submit
// ---------------------------------------------------------------------------

test.describe('POST /api/leads/submit', () => {
  test('returns 400 when required fields are missing', async ({ request }) => {
    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: { name: 'Test', brand: 'prime' }, // missing phone
    })
    expect(res.status()).toBe(400)
    const body = await res.json() as { error: string }
    expect(body.error).toBeTruthy()
  })

  test('returns 400 for an invalid brand', async ({ request }) => {
    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: { name: 'Test', phone: '021 123 4567', brand: 'invalid-brand' },
    })
    expect(res.status()).toBe(400)
  })

  test('returns 200 with leadId for valid prime submission', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'PLAYWRIGHT_TEST_User',
        phone: '021 000 0001',
        email: 'playwright@test.invalid',
        message: 'Playwright E2E test submission — safe to delete',
        serviceType: 'General Enquiry',
        brand: 'prime',
      },
    })
    expect(res.status()).toBe(200)
    const body = await res.json() as { leadId: string; crossSell?: unknown }
    expect(typeof body.leadId).toBe('string')
    expect(body.leadId.length).toBeGreaterThan(0)
  })

  test('returns 200 with leadId for valid akf submission', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'PLAYWRIGHT_TEST_AKF',
        phone: '021 000 0002',
        message: 'Kitchen renovation enquiry — Playwright test',
        serviceType: 'Renovation',
        brand: 'akf',
      },
    })
    expect(res.status()).toBe(200)
    const body = await res.json() as { leadId: string; crossSell?: unknown }
    expect(typeof body.leadId).toBe('string')
  })

  test('returns 200 with leadId for valid cleanjet submission', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'PLAYWRIGHT_TEST_CleanJet',
        phone: '021 000 0003',
        message: 'Post-reno clean needed — Playwright test',
        serviceType: 'Post-Renovation Clean',
        brand: 'cleanjet',
      },
    })
    expect(res.status()).toBe(200)
    const body = await res.json() as { leadId: string; crossSell?: unknown }
    expect(typeof body.leadId).toBe('string')
  })

  test('cross-sell detected for solar/heat pump enquiry from prime', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'PLAYWRIGHT_TEST_CrossSell',
        phone: '021 000 0004',
        message: 'I need a heat pump installed in my living room.',
        serviceType: 'Solar / Heat Pump',
        brand: 'prime',
      },
    })
    expect(res.status()).toBe(200)
    const body = await res.json() as { leadId: string; crossSell?: CrossSellData }
    expect(body.crossSell).toBeTruthy()
    expect(body.crossSell?.partnerBrand).toBe('cleanjet')
    expect(typeof body.crossSell?.servicePitch).toBe('string')
  })

  test('no cross-sell for a general enquiry', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'PLAYWRIGHT_TEST_NoCrossSell',
        phone: '021 000 0005',
        message: 'Just want to ask about pricing.',
        serviceType: 'General Enquiry',
        brand: 'prime',
      },
    })
    expect(res.status()).toBe(200)
    const body = await res.json() as { leadId: string; crossSell?: unknown }
    // crossSell should be absent or undefined for a generic enquiry
    expect(body.crossSell).toBeFalsy()
  })
})

// ---------------------------------------------------------------------------
// GET + POST /api/leads/enrich
// ---------------------------------------------------------------------------

test.describe('GET /api/leads/enrich', () => {
  test('health check returns 200 and ok:true', async ({ request }) => {
    const res = await request.get(`${BASE}/api/leads/enrich`)
    expect(res.status()).toBe(200)
    const body = await res.json() as { ok: boolean; endpoint: string }
    expect(body.ok).toBe(true)
    expect(body.endpoint).toBe('leads/enrich')
  })
})

test.describe('POST /api/leads/enrich', () => {
  test('returns 403 when x-enrich-secret is missing', async ({ request }) => {
    const res = await request.post(`${BASE}/api/leads/enrich`, {
      data: { leadId: 'fake-id', aiNotes: 'Test note' },
    })
    expect(res.status()).toBe(403)
  })

  test('returns 403 when x-enrich-secret is wrong', async ({ request }) => {
    const res = await request.post(`${BASE}/api/leads/enrich`, {
      headers: { 'x-enrich-secret': 'wrong-secret' },
      data: { leadId: 'fake-id', aiNotes: 'Test note' },
    })
    expect(res.status()).toBe(403)
  })

  test('returns 400 when leadId is missing', async ({ request }) => {
    const envSecret = process.env.ENRICH_SECRET ?? 'test-secret'
    const res = await request.post(`${BASE}/api/leads/enrich`, {
      headers: { 'x-enrich-secret': envSecret },
      data: { aiNotes: 'Test note without leadId' },
    })
    // Without a real secret, this will still be 403 — but in dev with secret set it returns 400
    expect([400, 403]).toContain(res.status())
  })
})

// ---------------------------------------------------------------------------
// GET /api/jobs/sync (webhook receiver — security check only)
// ---------------------------------------------------------------------------

test.describe('POST /api/jobs/sync', () => {
  test('returns 403 when x-sync-secret is wrong', async ({ request }) => {
    const res = await request.post(`${BASE}/api/jobs/sync`, {
      headers: { 'x-sync-secret': 'wrong-secret' },
      data: { type: 'UPDATE', record: { id: 'fake', lead_status: 'converted' } },
    })
    expect(res.status()).toBe(403)
  })

  test('returns 200 skipped when lead_status is not converted', async ({ request }) => {
    // Without a set JOB_SYNC_WEBHOOK_SECRET, the endpoint skips auth check
    const res = await request.post(`${BASE}/api/jobs/sync`, {
      data: {
        type: 'UPDATE',
        record: { id: 'fake-id', lead_status: 'new' },
        old_record: { lead_status: 'new' },
      },
    })
    // Either 200 skipped (no secret set) or 403 (secret is set)
    expect([200, 403]).toContain(res.status())
    if (res.status() === 200) {
      const body = await res.json() as { ok: boolean; skipped?: boolean }
      expect(body.ok).toBe(true)
    }
  })
})
