import { apiClient } from "./api-client";
import { AcademicNotification } from "@/types/notification";

export interface GetNotificationsResult {
  items: AcademicNotification[];
  unreadCount: number;
}

export const notificationService = {
  /**
   * Get academic notifications list
   */
  async getNotifications(params?: {
    unreadOnly?: boolean;
    limit?: number;
  }): Promise<GetNotificationsResult> {
    const query = new URLSearchParams();
    if (params?.unreadOnly) query.set("unreadOnly", "true");
    if (params?.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    const endpoint = `/dashboard/notifications${qs ? `?${qs}` : ""}`;
    const res = await apiClient.get<any>(endpoint);
    const raw = res.data;

    let items: AcademicNotification[] = [];
    let unreadCount = 0;

    if (Array.isArray(raw)) {
      items = raw;
      unreadCount = items.filter((n) => !n.isRead).length;
    } else if (raw && typeof raw === "object") {
      if (Array.isArray(raw.data)) {
        items = raw.data;
      } else if (Array.isArray(raw.notifications)) {
        items = raw.notifications;
      }
      if (typeof raw.unreadCount === "number") {
        unreadCount = raw.unreadCount;
      } else {
        unreadCount = items.filter((n) => !n.isRead).length;
      }
    }

    return { items, unreadCount };
  },

  /**
   * Get unread notifications count for header badge
   */
  async getUnreadCount(): Promise<number> {
    try {
      const res = await apiClient.get<any>(
        "/dashboard/notifications/unread-count"
      );
      const raw = res.data;
      if (typeof raw === "number") return raw;
      if (raw && typeof raw === "object") {
        if (typeof raw.unreadCount === "number") return raw.unreadCount;
        if (typeof raw.count === "number") return raw.count;
      }
      return 0;
    } catch {
      return 0;
    }
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(id: string): Promise<AcademicNotification> {
    const res = await apiClient.patch<AcademicNotification>(
      `/dashboard/notifications/${id}/read`,
      {}
    );
    return res.data || (res as unknown as AcademicNotification);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ success: boolean; updatedCount: number }> {
    const res = await apiClient.patch<{ success: boolean; updatedCount: number }>(
      "/dashboard/notifications/mark-all-read",
      {}
    );
    return res.data || (res as unknown as { success: boolean; updatedCount: number });
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete<{ success: boolean }>(
      `/dashboard/notifications/${id}`
    );
    return res.data || (res as unknown as { success: boolean });
  },
};
