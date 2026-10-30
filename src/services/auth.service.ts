import { apiClient } from "./api-client";
import {
  AuthResponse,
  LoginCredentials,
  StudentRegisterPayload,
  TeacherRegisterPayload,
} from "@/types/auth";

export const authService = {
  /**
   * User login (Student, Teacher, Admin)
   * Endpoint: POST /auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    if (response.data?.data?.accessToken && typeof window !== "undefined") {
      localStorage.setItem("edunova_token", response.data.data.accessToken);
      if (response.data.data.refreshToken) {
        localStorage.setItem("edunova_refresh_token", response.data.data.refreshToken);
      }
      if (response.data.data.user) {
        localStorage.setItem("edunova_user", JSON.stringify(response.data.data.user));
      }
    }
    return response.data;
  },

  /**
   * Register as Student
   * Endpoint: POST /auth/register/student
   */
  async registerStudent(payload: StudentRegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register/student",
      payload
    );
    return response.data;
  },

  /**
   * Register as Teacher
   * Endpoint: POST /auth/register/teacher
   */
  async registerTeacher(payload: TeacherRegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register/teacher",
      payload
    );
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("edunova_refresh_token")
          : undefined;
      await apiClient.post("/auth/logout", { refreshToken });
    } catch {
      // Ignore network errors on logout
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("edunova_token");
        localStorage.removeItem("edunova_refresh_token");
        localStorage.removeItem("edunova_user");
      }
    }
  },

  /**
   * Check if current user is logged in
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("edunova_token");
  },
};

