import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiClient } from "@/services/api-client";
import {
  AuthUser,
  LoginCredentials,
  StudentRegisterPayload,
  TeacherRegisterPayload,
  AuthResponse,
} from "@/types/auth";

interface AuthTokenPayload {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setAuth: (user: AuthUser, accessToken: string, refreshToken?: string) => void;
  clearAuth: () => void;
  setUser: (user: AuthUser | null) => void;
  setInitialized: (val: boolean) => void;

  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  adminLogin: (credentials: LoginCredentials) => Promise<AuthResponse>;
  registerStudent: (payload: StudentRegisterPayload) => Promise<AuthResponse>;
  registerTeacher: (payload: TeacherRegisterPayload) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      setAuth: (user, accessToken, refreshToken) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("edunova_token", accessToken);
          if (refreshToken) {
            localStorage.setItem("edunova_refresh_token", refreshToken);
          }
          localStorage.setItem("edunova_user", JSON.stringify(user));
        }

        set({
          user,
          accessToken,
          refreshToken: refreshToken || get().refreshToken,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      },

      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("edunova_token");
          localStorage.removeItem("edunova_refresh_token");
          localStorage.removeItem("edunova_user");
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      },

      setUser: (user) => {
        if (typeof window !== "undefined") {
          if (user) {
            localStorage.setItem("edunova_user", JSON.stringify(user));
          } else {
            localStorage.removeItem("edunova_user");
          }
        }
        set({ user });
      },

      setInitialized: (val: boolean) => set({ isInitialized: val }),

      /**
       * Standard User Login (Student, Teacher, Admin)
       * Endpoint: POST /auth/login
       */
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post<AuthTokenPayload>("/auth/login", credentials, {
            skipAuth: true,
          });

          const data = (res.data && typeof res.data === "object" && "user" in res.data
            ? res.data
            : res) as unknown as AuthTokenPayload;

          const user = data.user;
          const accessToken = data.accessToken;
          const refreshToken = data.refreshToken;

          if (accessToken && user) {
            get().setAuth(user, accessToken, refreshToken);
          }

          return {
            success: true,
            message: res.message || "Logged in successfully",
            data: { user, accessToken, refreshToken },
          };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Dedicated Institutional Admin Login
       * Endpoint: POST /auth/administrator/login
       * Strictly verifies ADMIN or SUPER_ADMIN authorization
       */
      // adminLogin placeholder
      adminLogin: async (credentials) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post<AuthTokenPayload>(
            "/auth/administrator/login",
            credentials,
            { skipAuth: true }
          );

          const data = (res.data && typeof res.data === "object" && "user" in res.data
            ? res.data
            : res) as unknown as AuthTokenPayload;

          const user = data.user;
          const accessToken = data.accessToken;
          const refreshToken = data.refreshToken;

          if (accessToken && user) {
            get().setAuth(user, accessToken, refreshToken);
          }

          return {
            success: true,
            message: res.message || "Admin authorization granted",
            data: { user, accessToken, refreshToken },
          };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Student Registration
       * Endpoint: POST /auth/register/student
       */
      registerStudent: async (payload) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post<Record<string, unknown>>(
            "/auth/register/student",
            payload,
            { skipAuth: true }
          );
          return {
            success: true,
            message:
              res.message ||
              "Student registration submitted. Please check email for OTP verification.",
            data: res.data as AuthResponse["data"],
          };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Teacher Registration
       * Endpoint: POST /auth/register/teacher
       */
      registerTeacher: async (payload) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post<Record<string, unknown>>(
            "/auth/register/teacher",
            payload,
            { skipAuth: true }
          );
          return {
            success: true,
            message:
              res.message ||
              "Teacher registration submitted. Pending email verification and admin approval.",
            data: res.data as AuthResponse["data"],
          };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Complete Logout
       * Endpoint: POST /auth/logout
       */
      logout: async () => {
        const refreshToken = get().refreshToken || undefined;
        try {
          await apiClient.post("/auth/logout", { refreshToken });
        } catch {
          // Proceed with local clearance even if network fails
        } finally {
          get().clearAuth();
        }
      },

      /**
       * Silent Token Refresh
       * Endpoint: POST /auth/refresh
       */
      refreshSession: async () => {
        const token = get().refreshToken;
        if (!token) return false;

        try {
          const res = await apiClient.post<AuthTokenPayload>(
            "/auth/refresh",
            { refreshToken: token },
            { skipAuth: true }
          );

          const data = (res.data && typeof res.data === "object" && "accessToken" in res.data
            ? res.data
            : res) as unknown as AuthTokenPayload;

          const newAccessToken = data.accessToken;
          const newRefreshToken = data.refreshToken;

          if (newAccessToken) {
            const currentUser = get().user;
            if (currentUser) {
              get().setAuth(currentUser, newAccessToken, newRefreshToken);
            }
            return true;
          }
          return false;
        } catch {
          get().clearAuth();
          return false;
        }
      },
    }),
    {
      name: "edunova-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setInitialized(true);
        }
      },
    }
  )
);
