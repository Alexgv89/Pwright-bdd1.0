import { Page, expect } from '@playwright/test';

export class QualityPage {
  constructor(private page: Page) {}

  async forceFailure() {
    // Lanzamos un error explícito para probar el Quality Gate
    throw new Error('QUALITY_GATE_FAILURE: Este test ha sido diseñado para fallar deliberadamente.');
  }
}