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
