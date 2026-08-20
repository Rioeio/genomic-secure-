/**
 * Centralized API Client Service for Med-Link
 * Manages environment-configurable base URL, dynamic JWT Bearer authentication,
 * structured error handling (401, 403, 429), and typed wrapper methods.
 */

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export type UserRole = 'researcher' | 'institution' | 'patient';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    email: string;
    name: string;
    role: string;
  };
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null;

  constructor() {
    // Configurable base URL with fallback to default local backend
    this.baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || 'http://127.0.0.1:8000';
    this.authToken = null;
  }

  public setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public isAuthenticated(): boolean {
    return this.authToken !== null && this.authToken.length > 0;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      const contentType = response.headers.get('content-type');
      let data: any = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        if (response.status === 401) {
          errorMessage = 'Authentication required. Please log in.';
        } else if (response.status === 403) {
          errorMessage = 'Access forbidden. Insufficient role permissions for this endpoint.';
        } else if (response.status === 429) {
          errorMessage = 'Rate limit exceeded. Too many requests, please slow down.';
        } else if (data && typeof data === 'object' && data.detail) {
          errorMessage = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        }

        throw new ApiError(response.status, errorMessage, data);
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, error instanceof Error ? error.message : 'Network failure connecting to backend API');
    }
  }

  // --- Authentication ---

  public async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // Store the JWT token from successful login
    this.authToken = response.access_token;
    return response;
  }

  public logout(): void {
    this.authToken = null;
  }

  // --- Public API Methods ---

  public async checkHealth(): Promise<any> {
    return this.request<any>('/');
  }

  public async runFederatedRound(epsilonStep: number = 0.1, studyId: string = 'rs1'): Promise<any> {
    return this.request<any>('/api/fl/run-round', {
      method: 'POST',
      body: JSON.stringify({ epsilon_step: epsilonStep, study_id: studyId }),
    });
  }

  public async inspectModelWeights(): Promise<any> {
    return this.request<any>('/api/fl/model-inspect', {
      method: 'GET',
    });
  }

  public async runModelInference(profile: {
    rs1799966: number;
    rs80357711: number;
    rs7903146: number;
    rs429358: number;
    rs1042522: number;
  }): Promise<any> {
    return this.request<any>('/api/fl/predict', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  public async getFLHistory(): Promise<any> {
    return this.request<any>('/api/fl/history', {
      method: 'GET',
    });
  }

  public async resetFLEngine(): Promise<any> {
    return this.request<any>('/api/fl/reset', {
      method: 'POST',
    });
  }

  public async getRealVariants(): Promise<any> {
    return this.request<any>('/api/genomics/real-variants', {
      method: 'GET',
    });
  }

  public async queryCohortCount(query: {
    gene?: string;
    rsid?: string;
    variant_class?: string;
    clinical_significance?: string;
    population_ancestry?: string;
    min_dosage?: number;
  }): Promise<any> {
    return this.request<any>('/api/discovery/cohort-count', {
      method: 'POST',
      body: JSON.stringify(query),
    });
  }
}

export const apiClient = new ApiClient();
