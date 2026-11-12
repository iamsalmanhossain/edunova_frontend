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

  // Delete Backup
  const handleDelete = async (item: BackupHistoryItem) => {
    if (!isSuperAdmin) {
      toast.error("Only Super Administrators can delete backups.", "Forbidden");
      return;
    }

    const confirmed = await appConfirm({
      title: "Permanently Delete Backup",
      message: `Are you sure you want to permanently delete backup "${item.fileName}"? This will permanently remove the encrypted file from Google Drive and the database record. This action cannot be undone.`,
      confirmText: "Delete Permanently",
      variant: "destructive",
    });

    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      await backupService.deleteBackup(item.id);
      toast.success(`Backup [${item.fileName}] was permanently deleted.`, "Deleted");
      await loadBackups(meta.page);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete backup file.", "Delete Error");
    } finally {
      setDeletingId(null);
    }
  };

  // Restore Database from an existing Cloud Backup
  const handleRestoreArchive = async (item: BackupHistoryItem) => {
    if (!isSuperAdmin) {
      toast.error("Only Super Administrators can restore databases.", "Forbidden");
      return;
    }

    const confirmed = await appConfirm({
      title: "CRITICAL: Restore Database Snapshot",
      message: `WARNING: Restoring from "${item.fileName}" will download the snapshot from Google Drive, decrypt it with AES-256-GCM, and restore all tables and data into your active PostgreSQL database. Do you want to proceed?`,
      confirmText: "Restore Database Now",
      variant: "destructive",
    });

    if (!confirmed) return;

    try {
      setIsRestoringId(item.id);
      toast.info(`Downloading and restoring database from ${item.fileName}... This may take 20-40 seconds.`, "Restoring");
      const res = await backupService.restoreBackup(item.id);
      toast.success(res.message || "Database successfully restored from archive!", "Restore Complete");
      await loadBackups(meta.page);
    } catch (err: any) {
      toast.error(err.message || "Database restore failed. Please check server logs.", "Restore Error");
    } finally {
      setIsRestoringId(null);
    }
  };

  // Trigger Local File Input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Import & Restore from uploaded local file
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmed = await appConfirm({
      title: "Import & Restore Database Dump",
      message: `WARNING: You are about to import "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB) into the PostgreSQL database. If encrypted, it will be automatically decrypted with your AES-256 key. Do you want to proceed?`,
      confirmText: "Import & Restore",
      variant: "destructive",
    });

    if (!confirmed) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setIsImporting(true);
      toast.info(`Uploading and importing "${file.name}" into database...`, "Import in Progress");
      const res = await backupService.importBackupFile(file);
      toast.success(res.message || "Database successfully restored from imported file!", "Import Successful");
      await loadBackups(1);
    } catch (err: any) {
      toast.error(err.message || "Failed to import backup file.", "Import Error");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Download Backup (Decrypted SQL or Encrypted)
  const handleDownload = async (item: BackupHistoryItem, decrypted = false) => {
    try {
      setDownloadingId(item.id);
      toast.info(
        `Preparing ${decrypted ? "Decrypted SQL (.sql)" : "Encrypted (.sql.enc)"} download...`,
        "Downloading",
      );
      await backupService.downloadBackup(item.id, decrypted, item.fileName);
      toast.success("Download started successfully.", "Download Ready");
    } catch (err: any) {
      toast.error(err.message || "Download failed.", "Download Error");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes || bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getStatusBadge = (status: BackupStatus) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            SUCCESS
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-rose-100 text-rose-800 border-rose-300 font-medium flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            FAILED
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300 font-medium flex items-center gap-1">
            <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            IN PROGRESS
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="max-w-2xl mx-auto mt-16 p-8 bg-white border border-amber-200 rounded-2xl shadow-sm text-center">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-700">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Super Administrator Privileges Required</h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Database dumps, AES-256 encryption keys, Google Drive cloud backups, and permanent deletion controls are restricted strictly to <strong>Super Administrators</strong>.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
          Your current account role: <span className="font-bold">{user.role}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-2 sm:px-4">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#073825] to-[#0d5c3d] rounded-2xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4" /> Production Disaster Recovery
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              Automated Database Backups
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
              AES-256-GCM encrypted PostgreSQL snapshots scheduled twice daily (01:00 & 13:00) with Google Drive cloud synchronization, 30-day retention pruning, and immutable audit logs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            {/* Hidden file input for backup import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".sql,.enc"
              className="hidden"
            />

            <Button
              onClick={checkDriveConnection}
              disabled={driveStatus.loading}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs sm:text-sm w-full sm:w-auto justify-center"
            >
              {driveStatus.loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
              ) : (
                <Cloud className="w-4 h-4 mr-2" />
              )}
              {driveStatus.loading ? "Testing..." : "Test Google Drive"}
            </Button>

            {isSuperAdmin && (
              <>
                <Button
                  onClick={triggerFileInput}
                  disabled={isImporting}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-medium text-xs sm:text-sm w-full sm:w-auto justify-center"
                >
                  {isImporting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  {isImporting ? "Importing & Restoring..." : "Import & Restore File"}
                </Button>

                <Button
                  onClick={handleTriggerBackup}
                  disabled={isTriggering}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg hover:shadow-emerald-500/30 transition-all text-xs sm:text-sm w-full sm:w-auto justify-center"
                >
                  {isTriggering ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                  ) : (
                    <Database className="w-4 h-4 mr-2" />
                  )}
                  {isTriggering ? "Backing up Database (25-30s)..." : "Trigger Instant Backup"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Metric & Info Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border border-[#e2e8e4] bg-white shadow-sm p-3 sm:p-5">
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-0">
            <CardTitle className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Backups
            </CardTitle>
            <Database className="w-4 h-4 text-emerald-600 shrink-0" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-xl sm:text-2xl font-bold text-slate-800">{meta.total}</div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Recorded in database</p>
          </CardContent>
        </Card>

        <Card className="border border-[#e2e8e4] bg-white shadow-sm p-3 sm:p-5">
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-0">
            <CardTitle className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Encryption Protocol
            </CardTitle>
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-base sm:text-lg font-bold text-slate-800">AES-256-GCM</div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Authenticated AEAD</p>
          </CardContent>
        </Card>

        <Card className="border border-[#e2e8e4] bg-white shadow-sm p-3 sm:p-5">
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-0">
            <CardTitle className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Automated Schedule
            </CardTitle>
            <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-base sm:text-lg font-bold text-slate-800">1:00 AM & 1:00 PM</div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Twice daily full dumps</p>
          </CardContent>
        </Card>

        <Card className="border border-[#e2e8e4] bg-white shadow-sm p-3 sm:p-5">
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-0">
            <CardTitle className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Retention Policies
            </CardTitle>
            <HardDrive className="w-4 h-4 text-emerald-600 shrink-0" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-base sm:text-lg font-bold text-slate-800">30d Backup / 7d Audit</div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Auto-purged by cron</p>
          </CardContent>
        </Card>
      </div>

      {/* History & Table Container */}
      <Card className="border border-[#e2e8e4] bg-white shadow-sm overflow-hidden">
        <CardHeader className="border-b border-[#f0f3f1] p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <CardTitle className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Backup History & Cloud Storage</span>
            </CardTitle>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                aria-label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs bg-[#f8faf9] border border-[#d8e0db] rounded-lg px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 flex-1 sm:flex-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>

              <select
                aria-label="Filter by Trigger"
                value={triggerFilter}
                onChange={(e) => setTriggerFilter(e.target.value as any)}
                className="text-xs bg-[#f8faf9] border border-[#d8e0db] rounded-lg px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 flex-1 sm:flex-none"
              >
                <option value="ALL">All Triggers</option>
                <option value="SCHEDULED">Scheduled (Cron)</option>
                <option value="MANUAL">Manual (Admin)</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => loadBackups(meta.page)}
                disabled={loading}
                className="text-xs h-8 px-3"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-slate-600" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                )}
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Loading / Empty States */}
          {loading && backups.length === 0 ? (
            <div className="py-14 text-center text-slate-400">
              <Loader2 className="w-7 h-7 animate-spin mx-auto mb-2 text-emerald-600" />
              <p className="text-sm">Loading backup archive records...</p>
            </div>
          ) : backups.length === 0 ? (
            <div className="py-14 text-center text-slate-400">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No database backups found matching current filters.</p>
            </div>
          ) : (
        </CardContent>
      </Card>
    </div>
  );
}
