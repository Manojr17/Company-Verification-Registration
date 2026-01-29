import { QueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async registerUser(firebaseToken: string, userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify(userData),
    });
  }

  async loginUser(firebaseToken: string) {
    return this.request('/auth/login', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
      },
    });
  }

  // Company endpoints
  async registerCompany(companyData: any) {
    return this.request('/company/register', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }

  async updateCompany(companyData: any) {
    return this.request('/company/update', {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  }

  async getCompanyProfile() {
    return this.request('/company/profile');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);