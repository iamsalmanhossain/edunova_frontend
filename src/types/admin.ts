export interface AdminInstituteInfo {
  id: string;
  name: string;
  code: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface AdminStudentMetrics {
  total: number;
  active: number;
  pending: number;
  suspended: number;
}

export interface AdminTeacherMetrics {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface AdminAcademicMetrics {
  departmentsCount: number;
  subjectsCount: number;
}

export interface PendingTeacherRegistration {
  teacherId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  shift: string;
  department: string;
  submittedAt: string;
}

export interface RecentAuditActivity {
  id: string;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  performedBy: string;
  role: string;
  timestamp: string;
}

export interface AdminOverviewData {
  institute: AdminInstituteInfo;
  metrics: {
    students: AdminStudentMetrics;
    teachers: AdminTeacherMetrics;
    academics: AdminAcademicMetrics;
  };
  pendingApprovals: PendingTeacherRegistration[];
  recentActivity: RecentAuditActivity[];
}

export type UserAccountStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "DEACTIVATED";
export type TeacherApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminTeacherProfile {
  id: string;
  designation: string;
  shift: string;
  qualification?: string | null;
  bio?: string | null;
  approvalStatus: TeacherApprovalStatus;
  rejectionReason?: string | null;
  approvedAt?: string | null;
  department?: {
    id: string;
    name: string;
    code: string;
  } | null;
  institute?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface AdminTeacherItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  status: UserAccountStatus;
  createdAt: string;
  emailVerifiedAt?: string | null;
  teacherProfile?: AdminTeacherProfile | null;
}

export interface AdminTeachersResponse {
  success: boolean;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: AdminTeacherItem[];
}

export interface QueryAdminTeachersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserAccountStatus;
  approvalStatus?: TeacherApprovalStatus;
  departmentId?: string;
  shift?: "FIRST" | "SECOND" | "FIRST_SHIFT" | "SECOND_SHIFT";
}

export interface PendingTeacherQueueItem {
  id: string;
  designation: string;
  shift: string;
  approvalStatus: TeacherApprovalStatus;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
  };
  institute?: {
    id: string;
    name: string;
    code: string;
  } | null;
  department?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface PendingTeachersResponse {
  teachers: PendingTeacherQueueItem[];
}

export interface TeacherDecisionPayload {
  rejectionReason: string;
}

export interface UpdateTeacherPayload {
  name?: string;
  phone?: string;
  teacherProfile?: {
    designation?: string;
    shift?: string;
    qualification?: string;
    bio?: string;
    departmentId?: string;
  };
}

export interface AdminStudentProfile {
  id: string;
  rollNo: string;
  registrationNo: string;
  semester: number;
  shift: string;
  session?: string | null;
  bloodGroup?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  address?: string | null;
  department?: {
    id: string;
    name: string;
    code: string;
  } | null;
  institute?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface AdminStudentItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  status: UserAccountStatus;
  createdAt?: string;
  studentProfile?: AdminStudentProfile | null;
}

export interface AdminStudentsResponse {
  success: boolean;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: AdminStudentItem[];
}

export interface QueryAdminStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserAccountStatus;
  departmentId?: string;
  semester?: number;
  shift?: "FIRST" | "SECOND" | "FIRST_SHIFT" | "SECOND_SHIFT";
  session?: string;
  rollNo?: string;
}

export interface UpdateStudentPayload {
  name?: string;
  phone?: string;
  studentProfile?: {
    rollNo?: string;
    registrationNo?: string;
    semester?: number;
    shift?: string;
    session?: string;
    bloodGroup?: string;
    guardianName?: string;
    guardianPhone?: string;
    address?: string;
    departmentId?: string;
  };
}

export interface UpdateUserStatusPayload {
  status: UserAccountStatus;
}

export interface AuditLogActor {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditLogItem {
  id: string;
  actorId?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  actor?: AuditLogActor | null;
}

export interface AuditLogsResponse {
  success: boolean;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: AuditLogItem[];
}

export interface QueryAuditLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  actorId?: string;
}

export interface MasterDepartment {
  id: string;
  name: string;
  code: string;
  institutesCount?: number;
}

export interface MasterSubject {
  id: string;
  name: string;
  code: string;
  semester: number;
  credit: number;
  departmentId: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

