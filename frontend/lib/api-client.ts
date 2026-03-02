import { API_CONFIG } from './config';

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

export class ApiClient {
  private baseUrl: string;
  private tokenKey: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
    this.tokenKey = API_CONFIG.TOKEN_KEY;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
      // Also set in cookie for middleware to read
      this.setCookie(this.tokenKey, token, 7); // 7 days
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      // Also remove from cookies
      this.deleteCookie(this.tokenKey);
    }
  }

  private setCookie(name: string, value: string, days: number = 7): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  }

  private getHeaders(authenticated: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (authenticated) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `${API_CONFIG.TOKEN_TYPE} ${token}`;
      }
    }

    return headers;
  }

  async request<T>(
    method: string,
    endpoint: string,
    options?: {
      body?: any;
      authenticated?: boolean;
    }
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const authenticated = options?.authenticated ?? false;

    const config: RequestInit = {
      method,
      headers: this.getHeaders(authenticated),
    };

    if (options?.body) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || `HTTP ${response.status}`,
        detail: errorData.detail,
      } as ApiError;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as unknown as T;
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const result = await this.request<{ access_token: string; token_type: string }>(
      'POST',
      API_CONFIG.ENDPOINTS.REGISTER,
      {
        body: { email, password },
      }
    );
    if (result.access_token) {
      this.setToken(result.access_token);
    }
    return result;
  }

  async login(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const result = await this.request<{ access_token: string; token_type: string }>(
      'POST',
      API_CONFIG.ENDPOINTS.LOGIN,
      {
        body: { email, password },
      }
    );
    if (result.access_token) {
      this.setToken(result.access_token);
    }
    return result;
  }

  logout(): void {
    this.removeToken();
  }

  // Watchlist endpoints
  async getWatchlist(): Promise<any[]> {
    return this.request<any[]>('GET', API_CONFIG.ENDPOINTS.WATCHLIST, {
      authenticated: true,
    });
  }

  async addToWatchlist(symbol: string): Promise<{ id: string; symbol: string; created_at: string }> {
    return this.request<{ id: string; symbol: string; created_at: string }>(
      'POST',
      API_CONFIG.ENDPOINTS.WATCHLIST,
      {
        body: { symbol },
        authenticated: true,
      }
    );
  }

  async removeFromWatchlist(id: string): Promise<void> {
    return this.request<void>('DELETE', `${API_CONFIG.ENDPOINTS.WATCHLIST}/${id}`, {
      authenticated: true,
    });
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export const apiClient = new ApiClient();
