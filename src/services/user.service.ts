import { apiClient } from "./api-client";
import { UserProfile, UpdateUserProfilePayload } from "@/types/user";
import { useAuthStore } from "@/store/useAuthStore";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const userService = {
  /**
   * Fetch current authenticated user's detailed profile
   * Backend endpoint: GET /api/v1/users/profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const res = await apiClient.get<ApiResponse<UserProfile>>("/users/profile");
      const profile = (res && typeof res === "object" && "data" in res && res.data
        ? res.data
        : res) as unknown as UserProfile;

      if (profile && profile.id) {
        const current = useAuthStore.getState().user;
        const isDifferent =
          !current ||
          current.name !== profile.name ||
          current.phone !== profile.phone ||
          current.avatarUrl !== profile.avatarUrl ||
          JSON.stringify(current.studentProfile) !== JSON.stringify(profile.studentProfile) ||
          JSON.stringify(current.teacherProfile) !== JSON.stringify(profile.teacherProfile);

        if (isDifferent) {
          useAuthStore.getState().updateUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            phone: profile.phone,
            avatarUrl: profile.avatarUrl,
            status: profile.status,
            studentProfile: profile.studentProfile,
            teacherProfile: profile.teacherProfile,
          });
        }
      }

      return profile;
    } catch (error) {
      console.warn("[userService.getProfile] Error fetching remote profile:", error);
      throw error;
    }
  },

  /**
   * Update current authenticated user's profile
   * Backend endpoint: PATCH /api/v1/users/profile
   */
  async updateProfile(payload: UpdateUserProfilePayload): Promise<UserProfile> {
    try {
      const res = await apiClient.patch<ApiResponse<UserProfile>>("/users/profile", payload);
      const updated = (res && typeof res === "object" && "data" in res && res.data
        ? res.data
        : res) as unknown as UserProfile;

      if (updated && updated.id) {
        // Sync with Zustand auth store
        useAuthStore.getState().updateUser({
          id: updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          phone: updated.phone,
          avatarUrl: updated.avatarUrl,
          status: updated.status,
          studentProfile: updated.studentProfile,
          teacherProfile: updated.teacherProfile,
        });
      }

      return updated;
    } catch (error) {
      console.error("[userService.updateProfile] Error updating profile:", error);
      throw error;
    }
  },
};

