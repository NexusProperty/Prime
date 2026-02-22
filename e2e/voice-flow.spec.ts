/**
 * TEST-002: Vapi.ai Voice Receptionist UI — AIChatWidget E2E Tests
 *
 * Tests the AIChatWidget (floating chat/voice button) across all three
 * United Trades sites. Does NOT test actual voice calling (requires mic + Vapi API).
 *
 * Selectors derived from actual component source:
 *   - Widget trigger:  aria-label="Open {label} AI assistant" (e.g. "Open Prime Electrical AI assistant")
 *   - Close button:    aria-label="Close AI assistant"
 *   - Chat messages:   aria-label="Chat messages"
 *   - Voice status:    VoiceStatusIndicator shows "Ask me anything" when idle
 *
 * Vapi SDK/API calls are backend-only; widget state is local. No api.vapi.ai mocking needed.
 */

import { test, expect } from '@playwright/test'

const PRIME_URL = 'http://localhost:3001'
const AKF_URL = 'http://localhost:3002'
const CLEANJET_URL = 'http://localhost:3003'

const WIDGET_TRIGGER = /open .* ai assistant/i
const CLOSE_BUTTON = /close ai assistant/i

// ---------------------------------------------------------------------------
// Suite 1: AIChatWidget — UI rendering (Prime Electrical)
// ---------------------------------------------------------------------------

test.describe('AIChatWidget — UI rendering (Prime Electrical)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRIME_URL)
  })

  test('voice/chat widget is present in the DOM', async ({ page }) => {
    const trigger = page.getByRole('button', { name: WIDGET_TRIGGER })
    await expect(trigger).toBeVisible({ timeout: 5000 })
  })

  test('widget opens when trigger is clicked', async ({ page }) => {
    const trigger = page.getByRole('button', { name: WIDGET_TRIGGER })
    await trigger.click()
    // Chat panel: messages area or input should become visible
    const chatMessages = page.getByLabel('Chat messages')
    await expect(chatMessages).toBeVisible({ timeout: 5000 })
  })

  test('widget can be closed', async ({ page }) => {
    const trigger = page.getByRole('button', { name: WIDGET_TRIGGER })
    await trigger.click()
    await expect(page.getByLabel('Chat messages')).toBeVisible({ timeout: 5000 })

    const closeBtn = page.getByRole('button', { name: CLOSE_BUTTON })
    await closeBtn.click()
    // Panel should be hidden; trigger button should be visible again
    await expect(trigger).toBeVisible()
    await expect(page.getByLabel('Chat messages')).not.toBeVisible()
  })

  test('voice status indicator renders inside open widget', async ({ page }) => {
    const trigger = page.getByRole('button', { name: WIDGET_TRIGGER })
    await trigger.click()
    // VoiceStatusIndicator shows "Ask me anything" when idle
    await expect(page.getByText('Ask me anything')).toBeVisible({ timeout: 5000 })
  })
})

// ---------------------------------------------------------------------------
// Suite 2: AIChatWidget — Accessibility
// ---------------------------------------------------------------------------

test.describe('AIChatWidget — Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRIME_URL)
  })

  test('widget trigger button has accessible label', async ({ page }) => {
    const trigger = page.getByRole('button', { name: WIDGET_TRIGGER })
    await expect(trigger).toBeVisible({ timeout: 5000 })
    const ariaLabel = await trigger.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel!.length).toBeGreaterThan(0)
  })

  test('widget is keyboard accessible — can open with Enter key', async ({ page }) => {
    const trigger = page.getByRole('button', { name: WIDGET_TRIGGER })
    await expect(trigger).toBeVisible({ timeout: 5000 })
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByLabel('Chat messages')).toBeVisible({ timeout: 5000 })
  })
})

// ---------------------------------------------------------------------------
// Suite 3: AIChatWidget — Per-site rendering
// ---------------------------------------------------------------------------

test.describe('AIChatWidget — Per-site rendering', () => {
  test('AIChatWidget renders on AKF site (port 3002)', async ({ page }) => {
    await page.goto(AKF_URL)
    const trigger = page.getByRole('button', { name: WIDGET_TRIGGER })
    await expect(trigger).toBeVisible({ timeout: 5000 })
  })

  test('AIChatWidget renders on CleanJet site (port 3003)', async ({ page }) => {
    await page.goto(CLEANJET_URL)
    const trigger = page.getByRole('button', { name: WIDGET_TRIGGER })
    await expect(trigger).toBeVisible({ timeout: 5000 })
  })
})
