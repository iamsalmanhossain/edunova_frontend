import { apiClient } from "./api-client";
import { useAuthStore } from "@/store/useAuthStore";

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  bytes: number;
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  data: CloudinaryUploadResult;
}

export const uploaderService = {
  /**
   * Upload an image or file buffer to backend Cloudinary uploader endpoint
   * Endpoint: POST /api/v1/uploader/upload
   * Form-Data: file
   */
  async uploadFile(file: File): Promise<CloudinaryUploadResult> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post<CloudinaryUploadResult>(
      "/uploader/upload",
      formData
    );

    const rawData = res.data as unknown as Record<string, unknown>;
    const payload = (
      rawData && typeof rawData === "object" && "secureUrl" in rawData
        ? rawData
        : (rawData?.data as Record<string, unknown>) || rawData
    ) as unknown as CloudinaryUploadResult;

    if (!payload?.secureUrl && !payload?.url) {
      throw new Error("Upload failed: Missing image URL in server response.");
    }

    return payload;
  },

  /**
   * Update the authenticated user's profile avatar URL
   * Endpoint: PATCH /api/v1/users/profile
   */
  async updateProfileAvatar(avatarUrl: string): Promise<string> {
    await apiClient.patch("/users/profile", { avatarUrl });

    // Instantly update Zustand global auth store and localStorage
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, avatarUrl };
      useAuthStore.getState().setUser(updatedUser);
    }

    return avatarUrl;
  },
};
