/**
 * TEST-002: Cross-Sell Engine Edge Cases
 *
 * Suite 1: API-level tests against detectCrossSell rules. Calls
 * http://localhost:3001/api/leads/submit directly via request fixture.
 * Skippable in CI via PLAYWRIGHT_SKIP_API_TESTS=true.
 *
 * Suite 2: UI tests for cross-sell decline/accept flows. Uses page.route
 * to mock /api/leads/submit responses.
 *
 * Cross-sell rules (from crossSell.ts):
 *   prime + [solar, heat pump, ev charger, wiring, ...] → cleanjet
 *   akf + [renovation, kitchen, deck, ...] → prime
 *   akf + [interior, painting, kitchen, bathroom, ...] → cleanjet
 *   cleanjet + [post-reno, new build, builder, ...] → akf
 */

import { test, expect, type Page } from '@playwright/test'

const BASE = 'http://localhost:3001'
const SKIP = !!process.env.PLAYWRIGHT_SKIP_API_TESTS

type LeadSubmitResponse = {
  leadId: string
  crossSell?: { partnerBrand: string; servicePitch: string; price?: string }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Fill out the lead form with standard test data. */
async function fillLeadForm(page: Page, opts: { serviceType?: string; message?: string } = {}) {
  await page.fill('input[name="name"]', 'Test Customer')
  await page.fill('input[name="phone"]', '021 123 4567')
  await page.fill('input[name="email"]', 'test@example.com')
  if (opts.serviceType) {
    await page.selectOption('select[name="serviceType"]', opts.serviceType)
  }
  if (opts.message) {
    await page.fill('textarea[name="message"]', opts.message)
  }
}

// ---------------------------------------------------------------------------
// Suite 1: detectCrossSell — API-level edge cases
// ---------------------------------------------------------------------------

test.describe('detectCrossSell — API-level edge cases', () => {
  test('prime + "solar" serviceType → cleanjet cross-sell detected', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'Test Prime Solar',
        phone: '021 000 0100',
        brand: 'prime',
        serviceType: 'Solar / Heat Pump',
        message: '',
      },
    })
    expect(res.status()).toBe(200)
    const body = (await res.json()) as LeadSubmitResponse
    expect(body.crossSell?.partnerBrand).toBe('cleanjet')
  })

  test('prime + "wiring" in message → cleanjet cross-sell detected', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'Test Prime Wiring',
        phone: '021 000 0101',
        brand: 'prime',
        serviceType: 'General Enquiry',
        message: 'Need new wiring in my garage',
      },
    })
    expect(res.status()).toBe(200)
    const body = (await res.json()) as LeadSubmitResponse
    expect(body.crossSell?.partnerBrand).toBe('cleanjet')
  })

  test('prime + "ev charger" in message → cleanjet cross-sell detected', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'Test Prime EV',
        phone: '021 000 0102',
        brand: 'prime',
        message: 'I want an EV charger installed',
      },
    })
    expect(res.status()).toBe(200)
    const body = (await res.json()) as LeadSubmitResponse
    expect(body.crossSell?.partnerBrand).toBe('cleanjet')
  })

  test('akf + "kitchen" in message → prime cross-sell detected', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'Test AKF Kitchen',
        phone: '021 000 0103',
        brand: 'akf',
        serviceType: 'Renovation',
        message: 'Kitchen needs renovating',
      },
    })
    expect(res.status()).toBe(200)
    const body = (await res.json()) as LeadSubmitResponse
    expect(body.crossSell?.partnerBrand).toBe('prime')
  })

  test('akf + "deck" in message → prime cross-sell detected', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'Test AKF Deck',
        phone: '021 000 0104',
        brand: 'akf',
        message: 'I need a deck built',
      },
    })
    expect(res.status()).toBe(200)
    const body = (await res.json()) as LeadSubmitResponse
    expect(body.crossSell?.partnerBrand).toBe('prime')
  })

  test('cleanjet + "post-reno" in message → akf cross-sell detected', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'Test CleanJet PostReno',
        phone: '021 000 0105',
        brand: 'cleanjet',
        message: 'Post-reno clean needed after builder finished',
      },
    })
    expect(res.status()).toBe(200)
    const body = (await res.json()) as LeadSubmitResponse
    expect(body.crossSell?.partnerBrand).toBe('akf')
  })

  test('cleanjet + "new build" in message → akf cross-sell detected', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'Test CleanJet NewBuild',
        phone: '021 000 0106',
        brand: 'cleanjet',
        message: 'New build just completed',
      },
    })
    expect(res.status()).toBe(200)
    const body = (await res.json()) as LeadSubmitResponse
    expect(body.crossSell?.partnerBrand).toBe('akf')
  })

  test('prime + "general enquiry" → no cross-sell', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'Test Prime General',
        phone: '021 000 0107',
        brand: 'prime',
        serviceType: 'General Enquiry',
        message: 'What is your availability?',
      },
    })
    expect(res.status()).toBe(200)
    const body = (await res.json()) as LeadSubmitResponse
    expect(body.crossSell).toBeFalsy()
  })

  test('cleanjet + "regular clean" → no cross-sell', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'Test CleanJet Regular',
        phone: '021 000 0108',
        brand: 'cleanjet',
        message: 'Need a regular weekly clean',
      },
    })
    expect(res.status()).toBe(200)
    const body = (await res.json()) as LeadSubmitResponse
    expect(body.crossSell).toBeFalsy()
  })

  test('akf + unrelated message → no cross-sell', async ({ request }) => {
    test.skip(SKIP, 'Skipped — set PLAYWRIGHT_SKIP_API_TESTS=false to enable')

    const res = await request.post(`${BASE}/api/leads/submit`, {
      data: {
        name: 'Test AKF Unrelated',
        phone: '021 000 0109',
        brand: 'akf',
        message: 'Just want a price estimate',
      },
    })
    expect(res.status()).toBe(200)
    const body = (await res.json()) as LeadSubmitResponse
    expect(body.crossSell).toBeFalsy()
  })
})

// ---------------------------------------------------------------------------
// Suite 2: Cross-sell UI — declined/accepted flow variations (Prime Electrical)
//
// Note: AKF and CleanJet LeadCaptureForms use a local mock flow (no real
// API call), so page.route() mocking has no effect on them. All UI cross-sell
// flow tests run against Prime Electrical (localhost:3001) which calls
// /api/leads/submit and processes the real response.
// ---------------------------------------------------------------------------

test.describe('Cross-sell UI — declined flow variations', () => {
  test('declining Prime cross-sell shows standard confirmation', async ({ page }) => {
    await page.route('**/api/leads/submit', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          leadId: 'test-prime-cs-decline',
          crossSell: {
            partnerBrand: 'cleanjet',
            servicePitch: 'Heat pump installs create dust — add a CleanJet post-install clean for $99.',
            price: '$99',
          },
        }),
      }),
    )
    await page.goto('http://localhost:3001')
    await fillLeadForm(page, { serviceType: 'Solar / Heat Pump' })
    await page.click('button[type="submit"]')
    await expect(page.getByRole('dialog', { name: /ai recommendation/i })).toBeVisible({ timeout: 8000 })
    await page.getByRole('button', { name: 'No thanks' }).click()
    await expect(page.getByText(/request received/i)).toBeVisible({ timeout: 5000 })
  })

  test('cross-sell dialog shows servicePitch text', async ({ page }) => {
    const pitch = 'Electrical and heat pump installs create dust. Add a CleanJet post-install clean.'
    await page.route('**/api/leads/submit', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          leadId: 'test-prime-cs-pitch',
          crossSell: {
            partnerBrand: 'cleanjet',
            servicePitch: pitch,
            price: '$99',
          },
        }),
      }),
    )
    await page.goto('http://localhost:3001')
    await fillLeadForm(page, { serviceType: 'Solar / Heat Pump' })
    await page.click('button[type="submit"]')
    await expect(page.getByRole('dialog', { name: /ai recommendation/i })).toBeVisible({ timeout: 8000 })
    await expect(page.getByText(pitch)).toBeVisible()
  })

  test('accepting Prime cross-sell shows bundle forwarded message', async ({ page }) => {
    await page.route('**/api/leads/submit', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          leadId: 'test-prime-cs-accept',
          crossSell: {
            partnerBrand: 'cleanjet',
            servicePitch: 'Heat pump installs create dust — add a CleanJet post-install clean for $99.',
            price: '$99',
          },
        }),
      }),
    )
    await page.goto('http://localhost:3001')
    await fillLeadForm(page, { serviceType: 'Solar / Heat Pump' })
    await page.click('button[type="submit"]')
    await expect(page.getByRole('dialog', { name: /ai recommendation/i })).toBeVisible({ timeout: 8000 })
    await page.getByRole('button', { name: /yes, include/i }).click()
    await expect(page.getByText(/bundle enquiry forwarded/i)).toBeVisible({ timeout: 5000 })
  })
})
