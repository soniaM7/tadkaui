// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { on } = require('events');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30*1000,
  expect:{
    timeout:5000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
 
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
   
    browserName:'chromium',
    headless: false,
    screenshot:'on',
    trace:'retain-on-failure'

  },

  

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reus*eExistingServer: !process.env.CI,
  // },
});

