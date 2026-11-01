import { apiClient } from "./api-client";
import { useAuthStore } from "@/store/useAuthStore";
import {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  StudentRegisterPayload,
  TeacherRegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from "@/types/auth";

export const authService = {
  /**
   * User login (Student, Teacher, Admin)
   * Endpoint: POST /auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return useAuthStore.getState().login(credentials);
  },

  /**
   * Dedicated Admin Login
   * Endpoint: POST /auth/administrator/login
   */
  async adminLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    return useAuthStore.getState().adminLogin(credentials);
  },

  /**
   * Register as Student
   * Endpoint: POST /auth/register/student
   */
  async registerStudent(payload: StudentRegisterPayload): Promise<AuthResponse> {
    return useAuthStore.getState().registerStudent(payload);
  },

  /**
   * Register as Teacher
   * Endpoint: POST /auth/register/teacher
   */
  async registerTeacher(payload: TeacherRegisterPayload): Promise<AuthResponse> {
    return useAuthStore.getState().registerTeacher(payload);
  },

  /**
   * Request password reset instructions
   * Endpoint: POST /auth/forgot-password
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<Record<string, unknown>>("/auth/forgot-password", payload, {
        skipAuth: true,
      });
      return {
        success: true,
        message:
          response.message ||
          `Password recovery instructions dispatched to ${payload.email}. Please check your inbox.`,
        data: response.data as AuthResponse["data"],
      };
    } catch (err: unknown) {
      throw err;
    }
  },

  /**
   * Reset password with security token
   * Endpoint: POST /auth/reset-password
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<Record<string, unknown>>("/auth/reset-password", payload, {
        skipAuth: true,
      });
      return {
        success: true,
        message:
          response.message ||
          "Password updated successfully. You can now login with your new password.",
        data: response.data as AuthResponse["data"],
      };
    } catch (err: unknown) {
      throw err;
    }
  },

  /**
   * Verify institutional email with 6-digit OTP
   * Endpoint: POST /auth/verify-email
   */
  // verifyEmail handler
  async verifyEmail(payload: VerifyEmailPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<Record<string, unknown>>(
        "/auth/verify-email",
        {
          email: payload.email,
          otp: payload.code || payload.otp,
        },
        { skipAuth: true }
      );
      return {
        success: true,
        message:
          response.message ||
          "Institutional email verified successfully. Your account is active.",
        data: response.data as AuthResponse["data"],
      };
    } catch (err: unknown) {
      throw err;
    }
  },

  /**
   * Resend verification code (OTP)
   * Endpoint: POST /auth/resend-email-otp
   */
  async resendVerification(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<Record<string, unknown>>(
        "/auth/resend-email-otp",
        { email },
        { skipAuth: true }
      );
      return {
        success: true,
        message:
          response.message ||
          `A new 6-digit confirmation code has been sent to ${email}.`,
        data: response.data as AuthResponse["data"],
      };
    } catch (err: unknown) {
      throw err;
    }
  },

  /**
   * Logout user and purge state
   */
  async logout(): Promise<void> {
    await useAuthStore.getState().logout();
  },

  /**
   * Check if current user is logged in
   */
  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated || !!this.getCurrentUser();
  },

  /**
   * Retrieve cached authenticated user profile
   */
  getCurrentUser(): AuthUser | null {
    const storeUser = useAuthStore.getState().user;
    if (storeUser) return storeUser;

    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("edunova_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as AuthUser;
    } catch {
      return null;
    }
  },

  /**
   * Get role-specific dashboard path
   */
  getRoleDashboardPath(role?: string): string {
    switch (role?.toUpperCase()) {
      case "STUDENT":
        return "/dashboard/student";
      case "TEACHER":
        return "/dashboard/teacher";
      case "ADMIN":
      case "SUPER_ADMIN":
      case "ADMINISTRATOR":
        return "/dashboard/admin";
      default:
        return "/dashboard/student";
    }
  },
};
