import { apiClient } from "./api-client";
import {
  BackupHistoryItem,
  BackupHistoryResponse,
  GoogleDriveStatusResponse,
  QueryBackupParams,
  UpdateBackupPayload,
  VerifyBackupResponse,
} from "@/types/backup";

export const backupService = {
  async getBackups(params?: QueryBackupParams): Promise<BackupHistoryResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.status) query.set("status", params.status);
    if (params?.triggeredBy) query.set("triggeredBy", params.triggeredBy);
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);

    const qs = query.toString();
    const res = await apiClient.get<any>(`/backups${qs ? `?${qs}` : ""}`);

    const raw = res.data ?? res;
    if (raw && "data" in raw && "meta" in raw) {
      return {
        meta: raw.meta,
        data: Array.isArray(raw.data) ? raw.data : [],
      };
    }

    return {
      meta: {
        total: Array.isArray(raw) ? raw.length : 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 1,
      },
      data: Array.isArray(raw) ? raw : [],
    };
  },

  async triggerManualBackup(): Promise<BackupHistoryItem> {
    const res = await apiClient.post<any>("/backups", {}, { timeout: 180000 });
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  async getBackupById(id: string): Promise<BackupHistoryItem> {
    const res = await apiClient.get<any>(`/backups/${id}`);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  async updateBackupMetadata(
    id: string,
    payload: UpdateBackupPayload,
  ): Promise<BackupHistoryItem> {
    const res = await apiClient.patch<any>(`/backups/${id}`, payload);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  async deleteBackup(id: string): Promise<{ message: string }> {
    const res = await apiClient.delete<any>(`/backups/${id}`);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  async verifyBackupIntegrity(id: string): Promise<VerifyBackupResponse> {
    const res = await apiClient.post<any>(`/backups/${id}/verify`, {});
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  async testGoogleDrive(): Promise<GoogleDriveStatusResponse> {
    const res = await apiClient.get<any>("/backups/google-drive/test");
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 8. Restore Database from Archive
   * POST /backups/:id/restore
   */
  async restoreBackup(id: string): Promise<{ message: string; durationMs?: number }> {
    const res = await apiClient.post<any>(`/backups/${id}/restore`, {});
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },
};
