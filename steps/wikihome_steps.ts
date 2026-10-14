import { createBdd } from 'playwright-bdd';
import { WikiHomePage } from '../pages/wikiHome.Page';
import { expect } from '@playwright/test';

const { Given: Dado, When: Cuando, Then: Entonces } = createBdd();

Dado('que el usuario navega a la página principal de Wikipedia {string} con el titulo {string}', async ({page}, url:string, title:string) => {
  let targetUrl = url;

  if (url === 'BASE' || url === 'HOME' || url === '/') {
    targetUrl = '/';
  } else if (url.startsWith('BASE:')) {
    targetUrl = url.replace('BASE:', '');
    if (!targetUrl.startsWith('/')) {
      targetUrl = '/' + targetUrl;
    }
  } else if (url.startsWith('/')) {
    targetUrl = url;
  }

  await page.goto(targetUrl);

  const wikiHomePage = new WikiHomePage(page);
  await wikiHomePage.goToWikiPage(url, title);
});

Cuando('busca el término {string} en la barra de búsqueda', async ({page}, term:string) => {
  const wikiHomePage = new WikiHomePage(page);
  await wikiHomePage.fillSearchInput(term);
  await wikiHomePage.clickSearchButton();
});

Entonces('el título de la página debe contener {string}', async ({page}, expectedTitle:string) => {
  await expect(page).toHaveTitle(new RegExp(expectedTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});