import type { Transaction } from "../types/transaction-type";
import type { User } from "../types/user-type";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

export class ApiClient {
  private refreshPromise: Promise<string | null> | null = null;
  public userApi: UserApi;
  public authApi: AuthApi;
  public transactionApi: TransactionApi;

  constructor() {
    this.userApi = new UserApi(this);
    this.authApi = new AuthApi(this);
    this.transactionApi = new TransactionApi(this);
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
      console.log("make request ", url);
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      console.log("make request response", url, response);

      if (response.status === 401 && url !== "/auth/refresh") {
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
  async get<S, T>(
    url: string,
    data?: S,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    if (url === "/user/summary") {
      console.log("get called with", url, data, options);
    }
    return this.makeRequest<T>(url, {
      ...options,
      method: "GET",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async post<S, T>(
    url: string,
    data?: S,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<S, T>(
    url: string,
    data?: S,
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

  async patch<S, T>(
    url: string,
    data?: S,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

class UserApi {
  private apiClient: ApiClient;
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getUser(userId: string) {
    const response = await this.apiClient.get<undefined, User>(
      `/user/${userId}`
    );
    return response;
  }

  async getUserTransactions() {
    const response = await this.apiClient.get<undefined, Transaction[]>(
      "/user/userTransactions"
    );
    return response;
  }

  async getUserSummary(from: string, to: string) {
    console.log("getSummary");
    const response = await this.apiClient.get<
      { from: string; to: string },
      { income: number; spending: number; currency: string }[]
    >("/user/summary", { from, to });
    console.log("getSummary after fetch");
    return response;
  }
}

class AuthApi {
  private apiClient: ApiClient;
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async postLogin(email: string, password: string) {
    const response = await this.apiClient.post<
      { email: string; password: string },
      {
        accessToken: string;
        userId: string;
      }
    >("/auth/login", {
      email,
      password,
    });

    return response;
  }

  async postLogout() {
    const response = await this.apiClient.post("/auth/logout");
    return response;
  }

  async postRefreshToken() {
    const response = await this.apiClient.post<
      undefined,
      {
        accessToken: string;
        userId: string;
      }
    >("/auth/refresh");
    return response;
  }
}

type CreateTransactionProps = {
  transactionName: string;
  vendorName: string;
  amount: number;
  transactionTime: string;
  moneyPocketId: string;
};

class TransactionApi {
  private apiClient: ApiClient;
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async createTransaction(props: CreateTransactionProps) {
    const response = await this.apiClient.post<CreateTransactionProps, void>(
      "/transaction/create",
      props
    );
    return response;
  }
}
