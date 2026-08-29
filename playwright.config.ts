import { defineConfig, devices } from '@playwright/test';
import { getEnvironmentConfig } from './config/environments';

declare const process: {
  env: Record<string, string | undefined>;
};

/**
 * Load environment variables from .env file.
 * This must run before reading any process.env values.
 */
import * as dotenv from 'dotenv';
dotenv.config();

const envConfig = getEnvironmentConfig();

/**
 * Playwright Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // ─── Test Discovery ────────────────────────────────────────────────────────
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  // ─── Execution ─────────────────────────────────────────────────────────────
  /** Run all tests in parallel across workers */
  fullyParallel: true,

  /** Fail the build on CI when test.only() is accidentally left in source */
  forbidOnly: !!process.env['CI'],

  /**
   * Retry strategy:
   *  - Local development: 0 retries for fast, transparent failures
   *  - CI: 2 retries to reduce flakiness noise in pipeline reports
   */
  retries: process.env['CI'] ? 2 : 0,

  /** Worker count: use fewer on CI to avoid resource contention */
  workers: process.env['CI'] ? 2 : undefined,

  // ─── Global Timeout ────────────────────────────────────────────────────────
  /** Per-test timeout: 30 seconds */
  timeout: 30_000,

  /** Assertion timeout: 10 seconds */
  expect: {
    timeout: 10_000,
  },

  // ─── Reporting ─────────────────────────────────────────────────────────────
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ...(process.env['CI'] ? ([['github']] as const) : []),
  ],

  // ─── Shared Settings ───────────────────────────────────────────────────────
  use: {
    /** Application base URL loaded from environment config */
    baseURL: envConfig.baseUrl,

    /** Capture screenshot only when a test fails */
    screenshot: 'only-on-failure',

    /**
     * Video recording:
     *  - Local: off (speeds up local runs)
     *  - CI: retain on failure for debugging
     */
    video: process.env['CI'] ? 'retain-on-failure' : 'off',

    /**
     * Trace collection:
     *  - First retry: capture trace to diagnose intermittent failures
     */
    trace: 'on-first-retry',

    /** Viewport default: desktop */
    viewport: { width: 1280, height: 720 },

    /** Locale for consistent date/number formatting in tests */
    locale: 'en-US',
  },

  // ─── Projects ──────────────────────────────────────────────────────────────
  projects: [
    // ── Smoke suite: fast feedback on Chromium only ──────────────────────────
    {
      name: 'smoke',
      use: { ...devices['Desktop Chrome'] },
      grep: /@smoke/,
    },

    // ── Full regression: Chromium ─────────────────────────────────────────────
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      grep: /@regression|@e2e/,
    },

    // ── Full regression: Firefox ──────────────────────────────────────────────
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      grep: /@regression|@e2e/,
    },

    // ── Full regression: WebKit ───────────────────────────────────────────────
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      grep: /@regression|@e2e/,
    },

    // ── Mobile viewport (responsive) ─────────────────────────────────────────
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      grep: /@responsive/,
    },

    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      grep: /@responsive/,
    },
  ],

  // ─── Output ────────────────────────────────────────────────────────────────
  outputDir: 'test-results',
});
