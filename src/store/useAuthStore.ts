import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiClient } from "@/services/api-client";
import {
  AuthUser,
  LoginCredentials,
  StudentRegisterPayload,
  TeacherRegisterPayload,
  AuthResponse,
  ClaimStudentAccountPayload,
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
  isLoggingOut: boolean;

  // Actions
  setAuth: (user: AuthUser, accessToken: string, refreshToken?: string) => void;
  clearAuth: () => void;
  setUser: (user: AuthUser | null) => void;
  updateUser: (fields: Partial<AuthUser>) => void;
  setInitialized: (val: boolean) => void;

  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  adminLogin: (credentials: LoginCredentials) => Promise<AuthResponse>;
  registerStudent: (payload: StudentRegisterPayload) => Promise<AuthResponse>;
  registerTeacher: (payload: TeacherRegisterPayload) => Promise<AuthResponse>;
  claimStudentAccount: (payload: ClaimStudentAccountPayload) => Promise<AuthResponse>;
  logout: (redirectTo?: string) => Promise<void>;
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
      isLoggingOut: false,

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
          isLoggingOut: false,
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
          isLoggingOut: get().isLoggingOut,
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

      updateUser: (fields) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, ...fields };
        if (typeof window !== "undefined") {
          localStorage.setItem("edunova_user", JSON.stringify(updated));
        }
        set({ user: updated });
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
       * Claim Pre-Enrolled Student Account
       * Endpoint: POST /auth/claim-account
       * Activates roll, merges marks & attendance, sets auth tokens
       */
      claimStudentAccount: async (payload) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post<any>(
            "/auth/claim-account",
            payload,
            { skipAuth: true }
          );

          const rawData = res.data;
          const student = rawData?.student;
          const tokens = rawData?.tokens;

          if (student && tokens?.accessToken) {
            const authUser: AuthUser = {
              id: student.user?.id || student.userId,
              name: student.user?.name || student.name || payload.name || "",
              email: student.user?.email || student.email || payload.email,
              phone: student.user?.phone || student.phone || payload.phone || null,
              role: "STUDENT",
              status: student.user?.status || "ACTIVE",
              instituteId: student.institute?.id,
              departmentId: student.department?.id || payload.departmentId,
              studentProfile: {
                id: student.id,
                rollNo: student.rollNo,
                registrationNo: student.registrationNo,
                semester: student.semester,
                shift: student.shift,
                isClaimed: true,
                department: student.department,
                institute: student.institute,
              } as any,
            };

            get().setAuth(authUser, tokens.accessToken, tokens.refreshToken);
          }

          return {
            success: true,
            message:
              res.message ||
              "Student account claimed and activated successfully. Welcome!",
            data: rawData as AuthResponse["data"],
          };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Complete Logout
       * Endpoint: POST /auth/logout
       */
      logout: async (redirectTo = "/login") => {
        set({ isLoggingOut: true });
        const refreshToken = get().refreshToken || undefined;

        // Clear local storage tokens immediately
        if (typeof window !== "undefined") {
          localStorage.removeItem("edunova_token");
          localStorage.removeItem("edunova_refresh_token");
          localStorage.removeItem("edunova_user");
        }

        try {
          if (refreshToken) {
            // Give server request up to 500ms so slow networks/sleeping servers never freeze logout
            const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 500));
            await Promise.race([
              apiClient.post("/auth/logout", { refreshToken }).catch(() => {}),
              timeoutPromise,
            ]);
          }
        } catch {
          // Proceed with local clearance even if network fails
        } finally {
          get().clearAuth();
          if (typeof window !== "undefined") {
            window.location.replace(redirectTo);
          }
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
