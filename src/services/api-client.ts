/**
 * Next.js Native Fetch API Client with Silent JWT Refresh
 * 
 * - Uses native Fetch API (standard in Next.js / modern browser runtimes)
 * - Automatically injects Bearer JWT from auth store / storage
 * - Automatically performs token refresh on HTTP 401 Unauthorized
 * - Retries failed requests with the freshly minted access token
 * - Provides clear, human-readable errors when backend server is offline
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  retryCount?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export interface ApiClientError extends Error {
  status?: number;
  data?: unknown;
}

// Memory lock to avoid multiple simultaneous refresh requests
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("edunova_token");
}

function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("edunova_refresh_token");
}

function setStoredTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("edunova_token", accessToken);
  if (refreshToken) {
    localStorage.setItem("edunova_refresh_token", refreshToken);
  }
}

function clearStoredTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("edunova_token");
  localStorage.removeItem("edunova_refresh_token");
  localStorage.removeItem("edunova_user");
}

/**
 * Attempts to silently refresh the JWT access token using the backend refresh endpoint
 */
async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    clearStoredTokens();
    return null;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        clearStoredTokens();
        return null;
      }

      const result = await response.json();
      const payload = result?.data || result;
      const newAccessToken = payload?.accessToken;
      const newRefreshToken = payload?.refreshToken;

      if (newAccessToken) {
        setStoredTokens(newAccessToken, newRefreshToken);
        return newAccessToken;
      }

      clearStoredTokens();
      return null;
    } catch {
      clearStoredTokens();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Primary Native Fetch Wrapper
 */
export async function fetchClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  // Attach Bearer Access Token if not skipped
  if (!options.skipAuth) {
    const token = getStoredToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized with silent JWT refresh
    if (response.status === 401 && !options.skipAuth && (options.retryCount || 0) < 1) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
        return fetchClient<T>(endpoint, {
          ...options,
          headers,
          retryCount: (options.retryCount || 0) + 1,
        });
      }
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        (Array.isArray(data?.message) ? data.message.join(", ") : null) ||
        `Request failed with status ${response.status}`;

      const error = new Error(errorMessage) as ApiClientError;
      error.status = response.status;
      error.data = data;
      throw error;
    }

    // Standardize NestJS TransformInterceptor response structure
    if (data && typeof data === "object") {
      if ("data" in data && "success" in data) {
        return data as ApiResponse<T>;
      }
      return {
        success: true,
        statusCode: response.status,
        data: data as T,
      };
    }

    return {
      success: true,
      statusCode: response.status,
      data: data as T,
    };
  } catch (error: unknown) {
    // Catch browser connection failures (e.g. backend server is not running on port 5000)
    if (error instanceof TypeError && (error.message.includes("fetch") || error.message.includes("Failed"))) {
      const connError = new Error(
        "Unable to connect to EduNova backend server (http://localhost:5000). Please ensure your backend is running (`pnpm start:dev` in edunova_backend)."
      ) as ApiClientError;
      connError.status = 0;
      throw connError;
    }
    throw error;
  }
}

/**
 * Convenience methods for HTTP verbs
 */
export const apiClient = {
  get: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    fetchClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    fetchClient<T>(endpoint, { ...options, method: "DELETE" }),
};
