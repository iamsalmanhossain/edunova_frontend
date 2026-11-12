export type BackupStatus = "SUCCESS" | "FAILED" | "IN_PROGRESS";
export type BackupTriggerType = "SCHEDULED" | "MANUAL";

export interface BackupHistoryItem {
  id: string;
  fileId?: string | null;
  fileName: string;
  fileSize?: number | null;
  checksum?: string | null;
  status: BackupStatus;
  triggeredBy: BackupTriggerType;
  userId?: string | null;
  encryptionAlgorithm: string;
  driveFolderId?: string | null;
  errorMessage?: string | null;
  metadata?: {
    durationMs?: number;
    webViewLink?: string;
    originalSize?: number;
    encryptedSize?: number;
    adminNotes?: string;
    [key: string]: any;
  } | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export interface BackupPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BackupHistoryResponse {
  meta: BackupPaginationMeta;
  data: BackupHistoryItem[];
}

export interface QueryBackupParams {
  page?: number;
  limit?: number;
  status?: BackupStatus;
  triggeredBy?: BackupTriggerType;
  startDate?: string;
  endDate?: string;
}

export interface UpdateBackupPayload {
  notes?: string;
  metadata?: Record<string, any>;
}

export interface VerifyBackupResponse {
  id: string;
  fileName: string;
  verified: boolean;
  checksum?: string;
  encryptionAlgorithm: string;
  message: string;
}

export interface GoogleDriveStatusResponse {
  connected: boolean;
  folderAccessible: boolean;
  message: string;
}

