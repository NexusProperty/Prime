/**
 * TEST-001: LeadCaptureForm E2E Tests
 *
 * Tests the lead capture form on all three United Trades sites.
 * The API call to /api/leads/submit is intercepted so no real Supabase
 * or n8n writes occur during testing.
 *
 * Selectors are derived from the actual FormFields.tsx component:
 *   - input[name="name"]        — required text field
 *   - input[name="phone"]       — required tel field
 *   - input[name="email"]       — optional email field
 *   - select[name="serviceType"] — service dropdown
 *   - textarea[name="message"]  — optional message
 *   - button[type="submit"]     — "Send Request →"
 *
 * States tested:
 *   idle → submitting → ai_processing → confirmed
 *   idle → submitting → ai_processing → cross_sell_triggered → confirmed_with_crosssell
 *   idle → submitting → ai_processing → cross_sell_triggered → confirmed (declined)
 */

import { test, expect, type Page } from '@playwright/test'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Mock /api/leads/submit to return a successful response with no cross-sell. */
async function mockLeadSubmitSuccess(page: Page) {
  await page.route('**/api/leads/submit', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ leadId: 'test-lead-001' }),
    }),
  )
}

/** Mock /api/leads/submit to return a cross-sell suggestion. */
async function mockLeadSubmitWithCrossSell(page: Page) {
  await page.route('**/api/leads/submit', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        leadId: 'test-lead-002',
        crossSell: {
          partnerBrand: 'cleanjet',
          servicePitch: 'Heat pump installs create dust — add a CleanJet post-install clean for $99.',
          price: '$99',
        },
      }),
    }),
  )
}

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
// Prime Electrical — LeadCaptureForm
// ---------------------------------------------------------------------------

test.describe('Prime Electrical — LeadCaptureForm', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001')
  })

  test('form renders with all required fields', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="phone"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('select[name="serviceType"]')).toBeVisible()
    await expect(page.locator('textarea[name="message"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /send request/i })).toBeVisible()
  })

  test('service dropdown includes expected options', async ({ page }) => {
    const select = page.locator('select[name="serviceType"]')
    await expect(select).toBeVisible()
    await expect(select.locator('option', { hasText: 'General Enquiry' })).toBeAttached()
    await expect(select.locator('option', { hasText: 'Solar / Heat Pump' })).toBeAttached()
    await expect(select.locator('option', { hasText: 'Emergency' })).toBeAttached()
  })

  test('required field validation — prevents submit when name is empty', async ({ page }) => {
    // Only fill phone, skip name
    await page.fill('input[name="phone"]', '021 123 4567')
    await page.click('button[type="submit"]')
    // Browser native validation should prevent submission — form stays in idle state
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.getByText(/request received/i)).not.toBeVisible()
  })

  test('successful submission shows confirmation message', async ({ page }) => {
    await mockLeadSubmitSuccess(page)
    await fillLeadForm(page)
    await page.click('button[type="submit"]')
    await expect(page.getByText(/request received/i)).toBeVisible({ timeout: 8000 })
    await expect(page.getByText(/2 business hours/i)).toBeVisible()
  })

  test('cross-sell prompt appears when API returns crossSell data', async ({ page }) => {
    await mockLeadSubmitWithCrossSell(page)
    await fillLeadForm(page, {
      serviceType: 'Solar / Heat Pump',
      message: 'I need a heat pump installed.',
    })
    await page.click('button[type="submit"]')
    // CrossSellPromptCard has role="dialog" — wait for it to appear
    await expect(page.getByRole('dialog', { name: /ai recommendation/i })).toBeVisible({ timeout: 8000 })
    await expect(page.getByRole('button', { name: /yes, include cleanjet/i })).toBeVisible()
  })

  test('accepting cross-sell shows confirmed_with_crosssell message', async ({ page }) => {
    await mockLeadSubmitWithCrossSell(page)
    await fillLeadForm(page, { serviceType: 'Solar / Heat Pump' })
    await page.click('button[type="submit"]')
    // Wait for cross-sell dialog to appear, then accept
    await expect(page.getByRole('dialog', { name: /ai recommendation/i })).toBeVisible({ timeout: 8000 })
    await page.getByRole('button', { name: /yes, include/i }).click()
    await expect(page.getByText(/bundle enquiry forwarded/i)).toBeVisible({ timeout: 5000 })
  })

  test('declining cross-sell shows standard confirmation message', async ({ page }) => {
    await mockLeadSubmitWithCrossSell(page)
    await fillLeadForm(page, { serviceType: 'Solar / Heat Pump' })
    await page.click('button[type="submit"]')
    // Wait for cross-sell dialog, then decline
    await expect(page.getByRole('dialog', { name: /ai recommendation/i })).toBeVisible({ timeout: 8000 })
    await page.getByRole('button', { name: 'No thanks' }).click()
    await expect(page.getByText(/request received/i)).toBeVisible({ timeout: 5000 })
  })

  test('API failure returns form to idle state', async ({ page }) => {
    await page.route('**/api/leads/submit', (route) =>
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) }),
    )
    await fillLeadForm(page)
    await page.click('button[type="submit"]')
    // Should return to idle (form still visible)
    await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 8000 })
    await expect(page.getByText(/request received/i)).not.toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// AKF Construction — LeadCaptureForm
// ---------------------------------------------------------------------------

test.describe('AKF Construction — LeadCaptureForm', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002')
  })

  test('form renders on AKF site', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="phone"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /send request/i })).toBeVisible()
  })

  test('successful submission shows confirmation on AKF', async ({ page }) => {
    await page.route('**/api/leads/submit', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ leadId: 'test-lead-akf-001' }),
      }),
    )
    await fillLeadForm(page)
    await page.click('button[type="submit"]')
    await expect(page.getByText(/request received/i)).toBeVisible({ timeout: 8000 })
  })
})
