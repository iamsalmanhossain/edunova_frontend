/**
 * Next.js Native Fetch API Client with Silent JWT Refresh
 * 
 * - Uses native Fetch API (standard in Next.js / modern browser runtimes)
 * - Automatically injects Bearer JWT from auth store / storage
 * - Automatically performs token refresh on HTTP 401 Unauthorized
 * - Retries failed requests with the freshly minted access token
 * - Provides clear, human-readable errors when backend server is offline
 */

const CONFIGURED_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const RENDER_FALLBACK_URL = "https://edunova-backend-tu1r.onrender.com/api/v1";

// Memory cache for the working API base URL so we don't retry failed localhost ports on every request
let activeBaseUrl: string = CONFIGURED_API_URL;

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
export async function refreshAccessToken(): Promise<string | null> {
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
      const response = await fetch(`${activeBaseUrl}/auth/refresh`, {
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
        // Synchronize with zustand store
        if (typeof window !== "undefined") {
          try {
            const { useAuthStore } = await import("@/store/useAuthStore");
            const authState = useAuthStore.getState();
            if (authState.user) {
              authState.setAuth(
                authState.user,
                newAccessToken,
                newRefreshToken || authState.refreshToken || undefined
              );
            }
          } catch {
            // store sync fallback
          }
        }
        return newAccessToken;
      }

      clearStoredTokens();
      if (typeof window !== "undefined") {
        try {
          const { useAuthStore } = await import("@/store/useAuthStore");
          useAuthStore.getState().clearAuth();
        } catch {}
      }
      return null;
    } catch {
      clearStoredTokens();
      if (typeof window !== "undefined") {
        try {
          const { useAuthStore } = await import("@/store/useAuthStore");
          useAuthStore.getState().clearAuth();
        } catch {}
      }
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Helper to process response json
 */
async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
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
}

/**
 * Primary Native Fetch Wrapper with Auto-Fallback between Local & Render Cloud Backend
 */
export async function fetchClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const makeUrl = (base: string) => {
    if (endpoint.startsWith("http")) return endpoint;
    const cleanBase = base.replace(/\/+$/, "");
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${cleanBase}${cleanEndpoint}`;
  };

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

  const targetUrl = makeUrl(activeBaseUrl);

  try {
    const response = await fetch(targetUrl, {
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

    return await parseResponse<T>(response);
  } catch (error: unknown) {
    // If local development backend is offline, seamlessly fallback to live Render backend
    const isNetworkError =
      error instanceof TypeError &&
      (error.message.includes("fetch") || error.message.includes("Failed"));

    if (
      isNetworkError &&
      !endpoint.startsWith("http") &&
      activeBaseUrl.includes("localhost")
    ) {
      try {
        const fallbackUrl = makeUrl(RENDER_FALLBACK_URL);
        const fallbackResponse = await fetch(fallbackUrl, {
          ...options,
          headers,
        });

        if (fallbackResponse.status === 401 && !options.skipAuth && (options.retryCount || 0) < 1) {
          activeBaseUrl = RENDER_FALLBACK_URL;
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

        const parsed = await parseResponse<T>(fallbackResponse);
        // Switch activeBaseUrl to Render since localhost is unreachable
        activeBaseUrl = RENDER_FALLBACK_URL;
        return parsed;
      } catch (fallbackError: unknown) {
        throw fallbackError;
      }
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

  getBlob: async (endpoint: string, options?: RequestOptions): Promise<Blob> => {
    const makeUrl = (base: string) => {
      if (endpoint.startsWith("http")) return endpoint;
      const cleanBase = base.replace(/\/+$/, "");
      const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      return `${cleanBase}${cleanEndpoint}`;
    };

    const headers = new Headers(options?.headers || {});
    const token = getStoredToken();
    if (token && !options?.skipAuth && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    let url = makeUrl(activeBaseUrl);
    let res: Response;
    try {
      res = await fetch(url, { ...options, headers, method: "GET" });
      if (!res.ok && res.status >= 500 && activeBaseUrl.includes("localhost")) {
        url = makeUrl(RENDER_FALLBACK_URL);
        res = await fetch(url, { ...options, headers, method: "GET" });
        activeBaseUrl = RENDER_FALLBACK_URL;
      }
    } catch {
      url = makeUrl(RENDER_FALLBACK_URL);
      res = await fetch(url, { ...options, headers, method: "GET" });
      activeBaseUrl = RENDER_FALLBACK_URL;
    }

    // Silent JWT refresh on 401 Unauthorized
    if (res.status === 401 && !options?.skipAuth && (options?.retryCount || 0) < 1) {
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        return apiClient.getBlob(endpoint, {
          ...options,
          retryCount: (options?.retryCount || 0) + 1,
        });
      }
    }

    if (res.status === 204) {
      throw new Error("The requested report has no content available (Status 204).");
    }

    if (!res.ok) {
      let serverMsg = `Download failed with status ${res.status}`;
      try {
        const errorJson = await res.json();
        if (errorJson?.message) {
          serverMsg = Array.isArray(errorJson.message)
            ? errorJson.message.join(", ")
            : errorJson.message;
        }
      } catch {
        // Non-JSON error payload
      }
      throw new Error(serverMsg);
    }
    const blob = await res.blob();
    if (blob.size === 0) {
      throw new Error("Server returned an empty binary stream (0 bytes).");
    }
    return blob;
  },
};
