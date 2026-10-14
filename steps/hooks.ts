import { createBdd } from 'playwright-bdd';
import { allure } from 'allure-playwright';

const { Before } = createBdd();

// @ts-ignore
Before(async ({ $tags }, testInfo) => {
  // 1. Dynamic detection of execution layer (API vs UI)
  const isApi = $tags.includes('@api');
  await allure.label('layer', isApi ? 'API' : 'UI');

  // 2. Executor Detection (Local vs CI)
  const executor = process.env.TFS_VERSION || process.env.AGENT_NAME ? 'Azure DevOps' : (process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'Local');

  // Adding the executor as both a label and a parameter for Allure reports
  await allure.label('execute.by', executor);
  await allure.parameter('Executor', executor);

  // 3. Env metadata
  const currentEnv = process.env.ENV || 'QA';
  await allure.label('environment', currentEnv);
  await allure.parameter('env', currentEnv);

  if (!isApi && testInfo) {
    // 4. Browser metadata
    const browserName = testInfo.project?.name || 'Unknown';
    await allure.label('browser', browserName);
    await allure.parameter('Browser', browserName);
    // Asigna el navegador como Suite Principal para organizar el árbol del reporte
    await allure.parentSuite(browserName);
  }
});
