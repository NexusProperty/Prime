import { defineConfig, devices } from '@playwright/test'

/**
 * TEST-001: Playwright E2E configuration for United Trades monorepo.
 *
 * Tests run against locally started dev servers for all three sites.
 * The API route tests mock Supabase + n8n so no real DB writes occur.
 *
 * Run all tests:   npm run test:e2e
 * Interactive UI:  npm run test:e2e:ui
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Start all three dev servers before running tests */
  webServer: [
    {
      command: 'npm run dev -- --port 3001',
      cwd: './prime-electrical',
      url: 'http://localhost:3001',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npm run dev -- --port 3002',
      cwd: './akf-construction',
      url: 'http://localhost:3002',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npm run dev -- --port 3003',
      cwd: './cleanjet',
      url: 'http://localhost:3003',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
})
