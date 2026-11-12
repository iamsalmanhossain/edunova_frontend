"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { AuthUser } from "@/types/auth";
import { BackupHistoryItem, BackupStatus, BackupTriggerType } from "@/types/backup";
import { backupService } from "@/services/backup.service";
import { useToastStore } from "@/store/useToastStore";
import { appConfirm } from "@/store/useConfirmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Database,
  ShieldCheck,
  HardDrive,
  Cloud,
  Clock,
  User,
  Trash2,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCode,
  FileText,
  Lock,
  ShieldAlert,
  Upload,
  Download,
  RotateCcw,
  Loader2,
  ChevronDown,
} from "lucide-react";

interface AdminBackupManagerProps {
  user: AuthUser;
}

export default function AdminBackupManager({ user }: AdminBackupManagerProps) {
  const toast = useToastStore();
  const [backups, setBackups] = useState<BackupHistoryItem[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isRestoringId, setIsRestoringId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [statusFilter, setStatusFilter] = useState<BackupStatus | "ALL">("ALL");
  const [triggerFilter, setTriggerFilter] = useState<BackupTriggerType | "ALL">("ALL");
  const [driveStatus, setDriveStatus] = useState<{
    tested: boolean;
    connected: boolean;
    folderAccessible: boolean;
    loading: boolean;
  }>({
    tested: false,
    connected: false,
    folderAccessible: false,
    loading: false,
  });

  const isSuperAdmin = user.role === "SUPER_ADMIN";

  const loadBackups = useCallback(
    async (page = 1) => {
      if (!isSuperAdmin) return;
      try {
        setLoading(true);
        const res = await backupService.getBackups({
          page,
          limit: 10,
          status: statusFilter === "ALL" ? undefined : statusFilter,
          triggeredBy: triggerFilter === "ALL" ? undefined : triggerFilter,
        });
        setBackups(res.data);
        setMeta(res.meta);
      } catch (err: any) {
        useToastStore.getState().error(err.message || "Failed to load backup history", "Error");
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, triggerFilter, isSuperAdmin],
  );

  useEffect(() => {
    if (isSuperAdmin) {
      loadBackups(1);
    }
  }, [loadBackups, isSuperAdmin]);

  // Test Google Drive Connection
  const checkDriveConnection = async () => {
    try {
      setDriveStatus((prev) => ({ ...prev, loading: true }));
      const result = await backupService.testGoogleDrive();
      setDriveStatus({
        tested: true,
        connected: result.connected,
        folderAccessible: result.folderAccessible,
        loading: false,
      });

      if (result.connected && result.folderAccessible) {
        toast.success("Google Drive authenticated and target folder verified.", "Connected");
      } else if (result.connected && !result.folderAccessible) {
        toast.warning("Google Drive connected, but target backup folder is not accessible.", "Folder Missing");
      } else {
        toast.error(result.message || "Could not connect to Google Drive", "Connection Failed");
      }
    } catch (err: any) {
      setDriveStatus({
        tested: true,
        connected: false,
        folderAccessible: false,
        loading: false,
      });
      toast.error(err.message || "Google Drive connection test failed", "Drive Error");
    }
  };

  // Trigger Instant Manual Backup
  const handleTriggerBackup = async () => {
    if (!isSuperAdmin) {
      toast.error("Only Super Administrators can trigger database backups.", "Forbidden");
      return;
    }

    const confirmed = await appConfirm({
      title: "Trigger Immediate Database Backup",
      message:
        "This will take a full dump of the PostgreSQL database, encrypt it with AES-256-GCM, and upload it to Google Drive. The process takes around 25-30 seconds. Do you want to proceed?",
      confirmText: "Start Backup Now",
      variant: "default",
    });

    if (!confirmed) return;

    try {
      setIsTriggering(true);
      toast.info("Database dump initiated. Encrypting and uploading to Google Drive...", "Backup in Progress");
      await backupService.triggerManualBackup();
      toast.success("Backup successfully generated, encrypted, and uploaded to Google Drive!", "Backup Complete");
      await loadBackups(1);
    } catch (err: any) {
      toast.error(err.message || "Manual backup failed. Please check server logs.", "Backup Failed");
    } finally {
      setIsTriggering(false);
    }
  };

  // Verify Backup Integrity
  const handleVerify = async (item: BackupHistoryItem) => {
    try {
      setVerifyingId(item.id);
      toast.info(`Downloading and verifying integrity for ${item.fileName}...`, "Verifying");
      const res = await backupService.verifyBackupIntegrity(item.id);
      toast.success(
        res.message || "AES-256-GCM integrity verified! Authentication tag and checksum match.",
        "Integrity Valid",
      );
    } catch (err: any) {
      toast.error(err.message || "Integrity verification failed for this backup file.", "Verification Failed");
    } finally {
      setVerifyingId(null);
    }
  };

  return <div>Backup Manager Initializing...</div>;
}
