/**
 * TEST-001: BookingWizard E2E Tests (CleanJet — http://localhost:3003)
 *
 * Tests the 3-step booking wizard:
 *   Step 1: RoomSelector  — choose bed count + optional extras → "Next: Choose Date →"
 *   Step 2: DatePicker    — pick a date + time slot → "Next: Confirm →"
 *   Step 3: ConfirmReview — enter name + phone → "Confirm Booking ✓"
 *   Result: "✓ Booking Confirmed!" confirmation screen
 *
 * Selectors derived from actual component source:
 *   - Room buttons:  button text "1–2 Beds", "3–4 Beds", "5+ Beds"
 *   - Extra labels:  checkbox labels "Extra Bathrooms", "Oven Clean", "Windows"
 *   - Date buttons:  rendered dynamically from next 7 days; we click the first visible one
 *   - Time buttons:  "Morning (8am–12pm)", "Afternoon (12pm–6pm)"
 *   - CTA buttons:   "Next: Choose Date →", "Next: Confirm →", "Confirm Booking ✓"
 *   - Contact inputs: placeholder "Your name *", "Phone number *"
 */

import { test, expect, type Page } from '@playwright/test'

const CLEANJET_URL = 'http://localhost:3003'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Navigate to CleanJet home and scroll to the BookingWizard section. */
async function gotoBookingWizard(page: Page) {
  await page.goto(CLEANJET_URL)
  // BookingWizard is rendered inside #booking section — scroll to it
  const wizard = page.locator('#booking').getByRole('heading', { name: 'Book Your Clean' })
  await wizard.scrollIntoViewIfNeeded()
  await expect(wizard).toBeVisible()
}

/** Complete Step 1: select room size, optionally add extras. */
async function completeStep1(
  page: Page,
  opts: { rooms?: string; extras?: string[] } = {},
) {
  const booking = page.locator('#booking')
  const rooms = opts.rooms ?? '1–2 Beds'
  await booking.getByRole('button', { name: rooms }).click()

  for (const extra of opts.extras ?? []) {
    await booking.getByLabel(extra).check()
  }

  await booking.getByRole('button', { name: /next: choose date/i }).click()
}

/** Complete Step 2: pick the first available date and a time slot. */
async function completeStep2(page: Page, timeSlot: 'Morning (8am–12pm)' | 'Afternoon (12pm–6pm)' = 'Morning (8am–12pm)') {
  const booking = page.locator('#booking')
  // Date buttons show day-of-week + day number — click the first available one
  await booking.getByText('Select a date').waitFor({ state: 'visible' })
  const dateButtons = booking.locator('button').filter({ hasText: /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/ })
  await dateButtons.first().click()

  // Select time slot
  await booking.getByRole('button', { name: timeSlot }).click()

  await booking.getByRole('button', { name: /next: confirm/i }).click()
}

/** Complete Step 3: enter contact details and confirm. */
async function completeStep3(page: Page, name = 'Jane Test', phone = '021 987 6543') {
  const booking = page.locator('#booking')
  await booking.getByPlaceholder('Your name *').fill(name)
  await booking.getByPlaceholder('Phone number *').fill(phone)
  await booking.getByRole('button', { name: /confirm booking/i }).click()
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('CleanJet — BookingWizard', () => {
  test.beforeEach(async ({ page }) => {
    await gotoBookingWizard(page)
  })

  test('Step 1: wizard shows heading and room options', async ({ page }) => {
    const booking = page.locator('#booking')
    await expect(booking.getByRole('heading', { name: 'Book Your Clean' })).toBeVisible()
    await expect(booking.getByRole('button', { name: '1–2 Beds' })).toBeVisible()
    await expect(booking.getByRole('button', { name: '3–4 Beds' })).toBeVisible()
    await expect(booking.getByRole('button', { name: '5+ Beds' })).toBeVisible()
  })

  test('Step 1: 1–2 Beds shows $99 base price', async ({ page }) => {
    const booking = page.locator('#booking')
    await booking.getByRole('button', { name: '1–2 Beds' }).click()
    await expect(booking.getByText('$99 NZD')).toBeVisible()
  })

  test('Step 1: selecting 3–4 Beds updates price to $149', async ({ page }) => {
    const booking = page.locator('#booking')
    await booking.getByRole('button', { name: '3–4 Beds' }).click()
    await expect(booking.getByText('$149 NZD')).toBeVisible()
  })

  test('Step 1: selecting 5+ Beds updates price to $199', async ({ page }) => {
    const booking = page.locator('#booking')
    await booking.getByRole('button', { name: '5+ Beds' }).click()
    await expect(booking.getByText('$199 NZD')).toBeVisible()
  })

  test('Step 1: adding extras increases estimated price', async ({ page }) => {
    const booking = page.locator('#booking')
    await booking.getByRole('button', { name: '1–2 Beds' }).click()
    // Base = $99; Oven Clean = +$30 → $129
    await booking.getByLabel('Oven Clean').check()
    await expect(booking.getByText('$129 NZD')).toBeVisible()
  })

  test('Step 1: "Next: Choose Date" button advances to Step 2', async ({ page }) => {
    await completeStep1(page)
    await expect(page.locator('#booking').getByText('Select a date')).toBeVisible()
  })

  test('Step 2: date and time buttons are rendered', async ({ page }) => {
    const booking = page.locator('#booking')
    await completeStep1(page)
    const dateButtons = booking.locator('button').filter({ hasText: /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/ })
    await expect(dateButtons.first()).toBeVisible()
    await expect(booking.getByRole('button', { name: 'Morning (8am–12pm)' })).toBeVisible()
    await expect(booking.getByRole('button', { name: 'Afternoon (12pm–6pm)' })).toBeVisible()
  })

  test('Step 2: Next button is disabled until date AND time are selected', async ({ page }) => {
    const booking = page.locator('#booking')
    await completeStep1(page)
    const nextBtn = booking.getByRole('button', { name: /next: confirm/i })
    await expect(nextBtn).toBeDisabled()

    // Select date only — still disabled
    const dateButtons = booking.locator('button').filter({ hasText: /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/ })
    await dateButtons.first().click()
    await expect(nextBtn).toBeDisabled()

    // Select time — now enabled
    await booking.getByRole('button', { name: 'Morning (8am–12pm)' }).click()
    await expect(nextBtn).toBeEnabled()
  })

  test('Step 2: Back button returns to Step 1', async ({ page }) => {
    const booking = page.locator('#booking')
    await completeStep1(page)
    await booking.getByRole('button', { name: /← back/i }).click()
    await expect(booking.getByRole('button', { name: '1–2 Beds' })).toBeVisible()
  })

  test('Step 2: advancing to Step 3 shows ConfirmReview', async ({ page }) => {
    const booking = page.locator('#booking')
    await completeStep1(page)
    await completeStep2(page)
    // Step 3: contact input fields and confirm button appear
    await expect(booking.getByPlaceholder('Your name *')).toBeVisible()
    await expect(booking.getByPlaceholder('Phone number *')).toBeVisible()
    await expect(booking.getByRole('button', { name: /confirm booking/i })).toBeVisible()
  })

  test('Step 3: Confirm button is disabled until name and phone are filled', async ({ page }) => {
    const booking = page.locator('#booking')
    await completeStep1(page)
    await completeStep2(page)
    const confirmBtn = booking.getByRole('button', { name: /confirm booking/i })
    await expect(confirmBtn).toBeDisabled()

    await booking.getByPlaceholder('Your name *').fill('Jane Test')
    await expect(confirmBtn).toBeDisabled()

    await booking.getByPlaceholder('Phone number *').fill('021 987 6543')
    await expect(confirmBtn).toBeEnabled()
  })

  test('Step 3: Back button from Step 3 returns to Step 2', async ({ page }) => {
    const booking = page.locator('#booking')
    await completeStep1(page)
    await completeStep2(page)
    await booking.getByRole('button', { name: /← back/i }).click()
    await expect(booking.getByText('Select a date')).toBeVisible()
  })

  test('full happy path: booking confirmed message appears', async ({ page }) => {
    await completeStep1(page, { rooms: '3–4 Beds' })
    await completeStep2(page, 'Afternoon (12pm–6pm)')
    await completeStep3(page)
    await expect(page.locator('#booking').getByText(/booking confirmed/i)).toBeVisible({ timeout: 5000 })
    await expect(page.locator('#booking').getByText(/reminder sms/i)).toBeVisible()
  })

  test('full happy path with extras: booking confirmed', async ({ page }) => {
    await completeStep1(page, { rooms: '1–2 Beds', extras: ['Oven Clean', 'Windows'] })
    await completeStep2(page, 'Morning (8am–12pm)')
    await completeStep3(page, 'Test Person', '021 000 1234')
    await expect(page.locator('#booking').getByText(/booking confirmed/i)).toBeVisible({ timeout: 5000 })
  })

  test('booking summary shows correct room label in Step 3', async ({ page }) => {
    const booking = page.locator('#booking')
    await completeStep1(page, { rooms: '3–4 Beds' })
    await completeStep2(page)
    // ConfirmReview renders "3-4 Bedrooms" (from roomSel.rooms)
    await expect(booking.getByText(/3-4 bedrooms/i)).toBeVisible()
  })

  test('wizard progress bar advances through steps', async ({ page }) => {
    const booking = page.locator('#booking')
    await expect(booking.getByRole('heading', { name: 'Book Your Clean' })).toBeVisible()

    await completeStep1(page)
    await expect(booking.getByText('Select a date')).toBeVisible()

    await completeStep2(page)
    await expect(booking.getByPlaceholder('Your name *')).toBeVisible()
  })
})
