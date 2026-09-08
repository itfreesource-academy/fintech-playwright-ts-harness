import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

/**
 * Enterprise Playwright Configuration for FinTech Payment & Ledger Portal.
 * Supports cross-browser execution (Chromium, Firefox, WebKit), trace capture,
 * visual snapshots, and CI pipeline gates.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  use: {
    /* Base URL: defaults to local file or Cloudflare Pages production deployment */
    baseURL: process.env.BASE_URL || `file://${path.resolve(__dirname, '../fintech-payment-portal/index.html').replace(/\\/g, '/')}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    }
  ],
});
