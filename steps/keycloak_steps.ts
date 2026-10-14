import { createBdd } from 'playwright-bdd';
import { expect, APIResponse } from '@playwright/test';
import { KeycloakService } from '../services/keycloak.service';

const { Given: Dado, When: Cuando, Then: Entonces } = createBdd();

let keycloakService: KeycloakService;
let lastResponse: APIResponse;
let responseBody: any;

Dado('que el servicio de Keycloak se encuentra activo en {string}', async ({ request }, url: string) => {
  keycloakService = new KeycloakService(request, url);
  const check = await request.get(`${url}/realms/master`);
  expect(check.status()).toBe(200);
});

Dado('que el servicio de Keycloak se encuentra activo', async ({ request }) => {
  keycloakService = new KeycloakService(request);
  const check = await request.get('/realms/master');
  expect(check.status()).toBe(200);
});

Cuando('solicito el token de acceso con usuario {string} y contraseña {string} en el realm {string}', async ({ request }, user: string, pass: string, realm: string) => {
  if (!keycloakService) {
    keycloakService = new KeycloakService(request);
  }
  lastResponse = await keycloakService.loginAdmin(user, pass, realm);
  responseBody = await lastResponse.json();
});

Entonces('la respuesta debe tener el código de estado {int}', async ({}, statusCode: number) => {
  expect(lastResponse.status()).toBe(statusCode);
});

Entonces('la respuesta debe contener un token de acceso válido de tipo {string}', async ({}, tokenType: string) => {
  expect(responseBody).toHaveProperty('access_token');
  expect(typeof responseBody.access_token).toBe('string');
  expect(responseBody.access_token.length).toBeGreaterThan(20);
  expect(responseBody.token_type?.toLowerCase()).toBe(tokenType.toLowerCase());
});

Dado('que he obtenido un token de acceso válido de administrador', async ({ request }) => {
  keycloakService = new KeycloakService(request);
  lastResponse = await keycloakService.loginAdmin('admin', 'admin', 'master');
  expect(lastResponse.status()).toBe(200);
  responseBody = await lastResponse.json();
  expect(keycloakService.getToken()).toBeTruthy();
});

Cuando('consulto la lista de usuarios del realm {string}', async ({}, realm: string) => {
  lastResponse = await keycloakService.getUsers(realm);
  responseBody = await lastResponse.json();
});

Entonces('la lista de usuarios debe contener al usuario {string}', async ({}, username: string) => {
  expect(Array.isArray(responseBody)).toBe(true);
  const userExists = responseBody.some((u: any) => u.username === username);
  expect(userExists).toBe(true);
});
