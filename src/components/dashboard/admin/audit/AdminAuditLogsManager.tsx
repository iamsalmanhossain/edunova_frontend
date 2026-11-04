"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AuthUser } from "@/types/auth";
import { AuditLogItem } from "@/types/admin";
import { adminService } from "@/services/admin.service";
import AdminAuditLogsSkeleton from "@/components/dashboard/skeletons/AdminAuditLogsSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Globe,
  User,
  Clock,
  Loader2,
} from "lucide-react";

interface AdminAuditLogsManagerProps {
  user: AuthUser;
}

export default function AdminAuditLogsManager({ user }: AdminAuditLogsManagerProps) {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [actionFilter, setActionFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLogs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminService.getAuditLogs({
        page,
        limit: 20,
        action: actionFilter || undefined,
      });
      setLogs(res.data);
      setMeta(res.meta);
    } catch (err: unknown) {
      console.error("Error loading audit logs:", err);
    } finally {
      setLoading(false);
    }
  }, [actionFilter]);

  useEffect(() => {
    loadLogs(1);
  }, [loadLogs]);

  const getActionBadge = (action: string) => {
    if (action.includes("APPROVED")) {
      return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">{action}</Badge>;
    }
    if (action.includes("REJECTED") || action.includes("SUSPENDED")) {
      return <Badge className="bg-rose-100 text-rose-800 border-rose-200">{action}</Badge>;
    }
    if (action.includes("STATUS")) {
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200">{action}</Badge>;
    }
    return <Badge variant="outline" className="font-mono bg-gray-50">{action}</Badge>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0a4b32]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#0f1f17]">
              Security &amp; Action Audit Logs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#5a6b62] mt-1">
            Immutable administrative trace records tracking credential decisions and account status changes
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadLogs(meta.page)}
          className="h-9 px-3 rounded-xl border-[#e2e8e4] text-xs font-semibold text-[#0a4b32]"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="border-[#e2e8e4] shadow-xs">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-9 px-3 text-xs font-semibold rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
            >
              <option value="">All Security Actions</option>
              <option value="TEACHER_APPROVED">TEACHER_APPROVED</option>
              <option value="TEACHER_REJECTED">TEACHER_REJECTED</option>
              <option value="USER_STATUS_UPDATED">USER_STATUS_UPDATED</option>
              <option value="TEACHER_PROFILE_UPDATED">TEACHER_PROFILE_UPDATED</option>
              <option value="STUDENT_PROFILE_UPDATED">STUDENT_PROFILE_UPDATED</option>
            </select>
          </div>
          <span className="text-xs text-[#5a6b62]">
            Total Logged Events: <span className="font-bold text-[#0f1f17]">{meta.total}</span>
          </span>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-[#e2e8e4] shadow-xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-[#e2e8e4]/80">
          <CardTitle className="text-base font-bold text-[#0f1f17]">
            Audit Trail Records
          </CardTitle>
          <p className="text-xs text-[#5a6b62]">
            Cryptographically timestamped action entries
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-[#5a6b62]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0a4b32] mb-2" />
              <p className="text-xs">Loading audit trail...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-[#5a6b62]">
              <ShieldCheck className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold">No audit logs matching selection</p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#fcfdfc] text-xs font-semibold text-[#5a6b62] border-b border-[#e2e8e4]">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Performed By (Actor)</th>
                      <th className="py-3 px-4">Target Entity</th>
                      <th className="py-3 px-4 text-right">IP &amp; Client</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f4f1] text-[#0f1f17]">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#fcfdfc] transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                          <span className="font-bold text-[#0f1f17] block">
                            {new Date(log.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-[#5a6b62] text-[11px]">
                            {new Date(log.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {getActionBadge(log.action)}
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <span className="font-bold text-[#0f1f17] block">
                            {log.actor?.name || "System Admin"}
                          </span>
                          <span className="text-[#5a6b62] block">
                            {log.actor?.email} ({log.actor?.role || "ADMIN"})
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono">
                          <span className="font-semibold text-[#0f1f17] block">
                            {log.entityType || "Record"}
                          </span>
                          <span className="text-[11px] text-[#5a6b62] truncate max-w-[140px] block" title={log.entityId || ""}>
                            ID: {log.entityId?.slice(0, 13) || "N/A"}...
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-xs">
                          <span className="font-mono text-[#0a4b32] font-semibold block">
                            {log.ipAddress || "127.0.0.1"}
                          </span>
                          <span className="text-[11px] text-[#5a6b62] truncate max-w-[160px] block ml-auto" title={log.userAgent || ""}>
                            {log.userAgent ? log.userAgent.split(" ")[0] : "Browser Client"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-[#f0f4f1]">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      {getActionBadge(log.action)}
                      <span className="text-[11px] text-[#5a6b62]">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#0f1f17]">
                      {log.actor?.name} ({log.actor?.role})
                    </p>
                    <p className="text-[11px] text-[#5a6b62]">
                      Entity: {log.entityType} • IP: {log.ipAddress || "Localhost"}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="p-4 border-t border-[#e2e8e4] flex items-center justify-between">
              <span className="text-xs text-[#5a6b62]">
                Page {meta.page} of {meta.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => loadLogs(meta.page - 1)}
                  className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => loadLogs(meta.page + 1)}
                  className="h-8 px-2.5 rounded-xl border-[#e2e8e4] text-xs"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
