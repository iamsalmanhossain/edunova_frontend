"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Award,
  BookOpen,
  Calendar,
  PenTool,
  CheckCheck,
  CheckCircle2,
  Trash2,
  Loader2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { notificationService } from "@/services/notification.service";
import { AcademicNotification, NotificationType } from "@/types/notification";
import { appToast } from "@/store/useToastStore";

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    const now = new Date();
    const diffSec = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDays = Math.floor(diffHr / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

function getNotificationVisuals(type?: string) {
  const normType = String(type || "").toUpperCase();
  switch (normType) {
    case "RESULT_PUBLISHED":
      return {
        icon: Award,
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        badge: "Exam Result",
        badgeColor: "bg-emerald-100 text-emerald-800",
      };
    case "LECTURE_NOTE_ADDED":
      return {
        icon: BookOpen,
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        badge: "Lecture Note",
        badgeColor: "bg-blue-100 text-blue-800",
      };
    case "EXAM_ANNOUNCED":
      return {
        icon: Calendar,
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        badge: "Exam Notice",
        badgeColor: "bg-amber-100 text-amber-800",
      };
    case "DIARY_ENTRY_ADDED":
      return {
        icon: PenTool,
        bg: "bg-teal-50 text-teal-700 border-teal-200",
        badge: "Class Diary",
        badgeColor: "bg-teal-100 text-teal-800",
      };
    default:
      return {
        icon: Bell,
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        badge: "Notice",
        badgeColor: "bg-gray-100 text-gray-800",
      };
  }
}

export default function NotificationBellPopover() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<AcademicNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load unread count periodically or on mount
  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // ignore
    }
  }, []);

  // Initial count load & 45s periodic polling
  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, 45000);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  // Load notifications when popover opens
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications({ limit: 20 });
      setNotifications(res.items || []);
      if (typeof res.unreadCount === "number") {
        setUnreadCount(res.unreadCount);
      }
    } catch (err: unknown) {
      console.warn("Could not load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      loadNotifications();
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Mark single notification as read & navigate to target route
  const handleItemClick = async (notif: AcademicNotification) => {
    try {
      if (!notif.isRead) {
        // Optimistically update
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        await notificationService.markAsRead(notif.id);
      }
    } catch (e) {
      console.warn("Failed marking notification as read:", e);
    } finally {
      setIsOpen(false);
      if (notif.route) {
        router.push(notif.route);
      }
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      setMarkingAll(true);
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      appToast.success("All academic notifications marked as read.", "Notices Updated");
    } catch (err: unknown) {
      appToast.error(
        err instanceof Error ? err.message : "Failed to mark all as read."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  // Delete single notification
  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const target = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      await notificationService.deleteNotification(id);
    } catch {
      // rollback or silent
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Student Notifications"
        title={
          unreadCount > 0
            ? `${unreadCount} unread academic notification${unreadCount > 1 ? "s" : ""}`
            : "Student Notices"
        }
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all relative cursor-pointer ${
          isOpen
            ? "bg-[#0a4b32] text-white shadow-xs"
            : "bg-[#f0f4f1] hover:bg-[#e4ece7] text-[#0f1f17]"
        }`}
      >
        <Bell
          className={`w-4 h-4 transition-transform ${
            isOpen ? "text-white scale-110" : "text-[#5a6b62]"
          }`}
        />

        {/* Dynamic Unread Badge / Pulsing Indicator */}
        {unreadCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-black text-white bg-rose-600 ring-2 ring-white shadow-xs animate-in zoom-in-50 duration-200`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Popover */}
      {isOpen && (
        <>
          {/* Mobile Backdrop for outside tap dismiss */}
          <div
            className="fixed inset-0 bg-black/25 z-40 sm:hidden animate-in fade-in duration-150"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed left-3 right-3 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2.5 sm:w-96 max-w-md sm:max-w-sm mx-auto sm:mx-0 bg-white rounded-2xl shadow-2xl border border-[#dce3df] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-[#fcfdfc] border-b border-[#e2e8e4] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center font-bold">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0f1f17]">
                Academic Notices
              </h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="text-[11px] font-bold text-[#0a4b32] hover:text-[#063020] hover:underline flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
              >
                {markingAll ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCheck className="w-3.5 h-3.5" />
                )}
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notification List Container */}
          <div className="max-h-[26rem] overflow-y-auto divide-y divide-[#f0f4f1] scroll-smooth">
            {loading && notifications.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center gap-2 text-center">
                <Loader2 className="w-6 h-6 text-[#0a4b32] animate-spin" />
                <p className="text-xs text-gray-500">Checking for academic notices...</p>
              </div>
            ) : notifications.length === 0 ? (
              /* Empty State */
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-[#0f1f17]">All Caught Up!</h4>
                <p className="text-[11px] text-[#5a6b62] mt-1 max-w-[220px]">
                  No new academic notices. You are all caught up!
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const visual = getNotificationVisuals(item.type);
                const IconComponent = visual.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`p-3.5 sm:p-4 transition-colors cursor-pointer flex items-start gap-3 relative group ${
                      !item.isRead
                        ? "bg-emerald-50/40 hover:bg-emerald-50/70"
                        : "bg-white hover:bg-[#f6f9f7]"
                    }`}
                  >
                    {/* Unread indicator dot */}
                    {!item.isRead && (
                      <span
                        className="absolute left-1.5 top-5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white"
                        title="Unread"
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${visual.bg}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${visual.badgeColor}`}
                        >
                          {visual.badge}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>

                      <h4
                        className={`text-xs leading-snug line-clamp-1 ${
                          !item.isRead
                            ? "font-extrabold text-[#0f1f17]"
                            : "font-semibold text-gray-800"
                        }`}
                      >
                        {item.title}
                      </h4>

                      <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-emerald-800/80 truncate">
                          From: {item.senderName}
                        </span>

                        <span className="text-[10px] font-bold text-[#0a4b32] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                          <span>View</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* Dismiss Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(e, item.id)}
                      title="Dismiss notification"
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-600 rounded-md transition-all cursor-pointer shrink-0 mt-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2.5 bg-[#fcfdfc] border-t border-[#e2e8e4] text-center">
              <span className="text-[10px] text-gray-400 font-medium">
                Tap any notification to view details
              </span>
            </div>
          )}
          </div>
        </>
      )}
    </div>
  );
}

