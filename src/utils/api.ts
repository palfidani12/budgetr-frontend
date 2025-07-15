const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

interface ApiResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
}

class ApiClient {
  private static instance: ApiClient;
  private refreshPromise: Promise<string | null> | null = null;

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);

      if (response.status === 401) {
        // Token expired, try to refresh
        const newToken = await this.refreshAccessToken();
        if (newToken) {
          // Retry the original request with new token
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          };
          const retryResponse = await fetch(`${API_BASE_URL}${url}`, config);
          return {
            data: await retryResponse.json(),
            status: retryResponse.status,
            ok: retryResponse.ok,
          };
        }
      }

      return {
        data: await response.json(),
        status: response.status,
        ok: response.ok,
      };
    } catch (error) {
      throw new Error(`API request failed: ${error}`);
    }
  }

  private async refreshAccessToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();
    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Refresh failed, redirect to login
        window.location.href = "/login";
        return null;
      }

      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      window.location.href = "/login";
      return null;
    }
  }

  // Public methods for different HTTP verbs
  async get<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { ...options, method: "GET" });
  }

  async post<T>(
    url: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    url: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { ...options, method: "DELETE" });
  }

  async patch<T>(
    url: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = ApiClient.getInstance();
