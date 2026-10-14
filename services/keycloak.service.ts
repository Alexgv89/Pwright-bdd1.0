import { APIRequestContext, APIResponse } from '@playwright/test';

export class KeycloakService {
  private baseUrl: string;
  private token: string = '';

  constructor(private request: APIRequestContext, baseUrl?: string) {
    this.baseUrl = baseUrl || '';
  }

  /**
   * Obtiene un token de acceso OAuth2/OIDC usando el flujo Resource Owner Password Credentials
   */
  async loginAdmin(username = 'admin', password = 'admin', realm = 'master'): Promise<APIResponse> {
    const endpoint = `${this.baseUrl}/realms/${realm}/protocol/openid-connect/token`;

    const response = await this.request.post(endpoint, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        client_id: 'admin-cli',
        username,
        password,
        grant_type: 'password',
      },
    });

    if (response.ok()) {
      const data = await response.json();
      this.token = data.access_token;
    }

    return response;
  }

  /**
   * Consulta los usuarios registrados en el realm (requiere permisos de admin y token activo)
   */
  async getUsers(realm = 'master'): Promise<APIResponse> {
    const endpoint = `${this.baseUrl}/admin/realms/${realm}/users`;

    return await this.request.get(endpoint, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getToken(): string {
    return this.token;
  }
}
