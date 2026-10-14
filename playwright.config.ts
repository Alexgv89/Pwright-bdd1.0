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
const UI_URLS = {
  dev: 'https://es.wikipedia.org',
  qa: 'https://es.wikipedia.org',
  release: 'https://es.wikipedia.org',
  prod: 'https://es.wikipedia.org',
};

const API_URLS = {
  dev: 'http://localhost:8080',
  qa: 'http://localhost:8080',
  release: 'https://auth-release.example.com',
  prod: 'https://auth.example.com',
};

const currentEnv = (process.env.ENV || 'qa').toLowerCase();
const uiBaseUrl = process.env.BASE_URL || UI_URLS[currentEnv as keyof typeof UI_URLS] || UI_URLS.qa;
const apiBaseUrl = process.env.KEYCLOAK_URL || API_URLS[currentEnv as keyof typeof API_URLS] || API_URLS.qa;

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
          UI_Base_URL: uiBaseUrl,
          API_Base_URL: apiBaseUrl,
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
    baseURL: uiBaseUrl, // Fallback por defecto
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'api',
      grep: /@api/,
      use: {
        baseURL: apiBaseUrl,
      },
    },
    {
      name: 'chromium',
      grepInvert: /@api/,
      use: { ...devices['Desktop Chrome'], baseURL: uiBaseUrl },
    },
    {
      name: 'firefox',
      grepInvert: /@api/,
      use: {
        ...devices['Desktop Firefox'],
        baseURL: uiBaseUrl,
      },
    },
    {
      name: 'webkit',
      grepInvert: /@api/,
      use: { ...devices['Desktop Safari'], baseURL: uiBaseUrl },
    },
    {
      name: 'edge',
      grepInvert: /@api/,
      use: {
        ...devices['Desktop Edge'],
        baseURL: uiBaseUrl,
      },
    },
  ],
});
