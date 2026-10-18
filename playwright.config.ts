import { defineConfig, devices } from '@playwright/test';

/**
 * The gallery, built and served exactly as a product would ship it (with the
 * content security policy every target runtime imposes), driven by Chromium.
 *
 * `@visual` only runs when asked (RUN_VISUAL=1): baselines are rendered on one
 * machine, and a comparison against another machine's rasteriser is noise.
 */
export default defineConfig({
  testDir: './e2e',
  ...(process.env['RUN_VISUAL'] ? {} : { grepInvert: /@visual/ }),
  forbidOnly: !!process.env['CI'],
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4310',
    // A machine whose browsers are older than this Playwright points here
    // instead of downloading; unset, Playwright uses its own.
    launchOptions: process.env['CHROMIUM_PATH']
      ? { executablePath: process.env['CHROMIUM_PATH'] }
      : {},
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx vite build gallery && npx vite preview gallery',
    url: 'http://localhost:4310',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
