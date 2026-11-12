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
  /**
   * 1. Get Paginated Backup History
   * GET /backups
   */
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

  /**
   * 2. Trigger Instant Manual Backup
   * POST /backups
   */
  async triggerManualBackup(): Promise<BackupHistoryItem> {
    const res = await apiClient.post<any>("/backups", {}, { timeout: 180000 });
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 3. Get Single Backup by ID
   * GET /backups/:id
   */
  async getBackupById(id: string): Promise<BackupHistoryItem> {
    const res = await apiClient.get<any>(`/backups/${id}`);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 4. Update Backup Metadata / Notes
   * PATCH /backups/:id
   */
  async updateBackupMetadata(
    id: string,
    payload: UpdateBackupPayload,
  ): Promise<BackupHistoryItem> {
    const res = await apiClient.patch<any>(`/backups/${id}`, payload);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 5. Permanently Delete Backup (Google Drive + DB)
   * DELETE /backups/:id
   */
  async deleteBackup(id: string): Promise<{ message: string }> {
    const res = await apiClient.delete<any>(`/backups/${id}`);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 6. Download stream and verify AES-256-GCM integrity
   * POST /backups/:id/verify
   */
  async verifyBackupIntegrity(id: string): Promise<VerifyBackupResponse> {
    const res = await apiClient.post<any>(`/backups/${id}/verify`, {});
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 7. Check Google Drive Service Account Status
   * GET /backups/google-drive/test
   */
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

  /**
   * 9. Import and Restore from Uploaded Backup File (.sql or .sql.enc)
   * POST /backups/import
   */
  async importBackupFile(file: File): Promise<{ message: string; durationMs?: number }> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post<any>("/backups/import", formData);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 10. Download Backup File (.sql or .sql.enc)
   * GET /backups/:id/download
   */
  async downloadBackup(id: string, decrypted = false, fileNameFallback?: string): Promise<void> {
    const blob = await apiClient.getBlob(`/backups/${id}/download?decrypted=${decrypted}`);
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;

    let filename = fileNameFallback || `backup_${id}.${decrypted ? "sql" : "sql.enc"}`;
    if (decrypted && filename.endsWith(".enc")) {
      filename = filename.replace(/\.enc$/, "");
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
  },
};

