import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import 'dotenv/config';
import os from 'os';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'steps/**/*.ts',
  language: 'es',
});

// Mapping of URLs by environment (Mirroring Java's config.properties)
const URLS = {
  dev: 'https://es.wikipedia.orgnn',
  qa: 'https://es.wikipedia.org',
  staging: 'https://es.wikipedia.org',
  prod: 'https://es.wikipedia.org',
};

const currentEnv = process.env.ENV || 'qa';
const baseUrl = URLS[currentEnv as keyof typeof URLS] || URLS.qa;

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        environmentInfo: {
          Project_Name: 'Wikipedia BDD Project',
          Environment: currentEnv.toUpperCase(),
          Base_URL: baseUrl,
          'S.O SYSTEM': os.type() === 'Darwin' ? `macOS (${os.arch()})` : `${os.type()} (${os.arch()})`,
          Node_Version: process.version,
          Framework: 'Playwright + playwright-bdd',
          BDD_Language: 'Spanish (es)',
          Responsible: 'Alex',
        },
      },
    ],
  ],
  use: {
    baseURL: baseUrl, // Playwright uses this for page.goto('/')
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
      use: {
        ...devices['Desktop Firefox'],
       
      },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
      },
    },
  ],
});
