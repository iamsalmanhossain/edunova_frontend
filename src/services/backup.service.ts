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
};
