export type NotificationType =
  | "RESULT_PUBLISHED"
  | "LECTURE_NOTE_ADDED"
  | "EXAM_ANNOUNCED"
  | "DIARY_ENTRY_ADDED"
  | "SYSTEM_NOTICE";

export interface AcademicNotification {
  id: string;
  recipientUserId: string;
  senderUserId?: string;
  senderName: string;
  senderRole: string;
  type: NotificationType;
  title: string;
  message: string;
  route: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface NotificationsListResponse {
  success: boolean;
  total: number;
  unreadCount: number;
  data: AcademicNotification[];
}

export interface UnreadCountResponse {
  success: boolean;
  unreadCount: number;
}

