export type InstitutionStaffRole =
  | "PRINCIPAL"
  | "CHIEF_INSTRUCTOR"
  | "INSTRUCTOR"
  | "JUNIOR_INSTRUCTOR"
  | "ADMINISTRATIVE_SECTION"
  | "ACCOUNTS_SECTION"
  | "JOB_PLACEMENT_CELL"
  | "ROVER_SCOUT_UNIT"
  | "STORE_SECTION"
  | "SECURITY_SECTION"
  | "LIBRARY"
  | "FOURTH_CLASS_EMPLOYEE_REVENUE"
  | "OUTSOURCED_STAFF";

export type Shift = "FIRST_SHIFT" | "SECOND_SHIFT";

export type StaffSource = "AUTO_TEACHER" | "MANUAL";

export interface StaffInstitute {
  id: string;
  name: string;
  code: string;
}

export interface StaffDepartment {
  id: string;
  name: string;
  code: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  status: string;
}

export interface InstitutionStaff {
  id: string;
  instituteId: string;
  userId?: string | null;
  departmentId?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  designation: string;
  role: InstitutionStaffRole;
  shift?: Shift | null;
  source: StaffSource;
  isPublished: boolean;
  displayOrder: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedName: string;
  resolvedEmail?: string | null;
  resolvedPhone?: string | null;
  resolvedAvatarUrl?: string | null;
  institute?: StaffInstitute;
  department?: StaffDepartment | null;
  user?: StaffUser | null;
}

export interface CreateStaffPayload {
  instituteId: string;
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  departmentId?: string;
  designation: string;
  role: InstitutionStaffRole;
  shift?: Shift;
  isPublished?: boolean;
  displayOrder?: number;
}

export interface UpdateStaffPayload extends Partial<CreateStaffPayload> {}

export interface QueryStaffParams {
  instituteId?: string;
  departmentId?: string;
  shift?: Shift;
  role?: InstitutionStaffRole;
  search?: string;
  isPublished?: boolean;
  includeDeleted?: boolean;
  page?: number;
  limit?: number;
}

export interface StaffListResponse {
  data: InstitutionStaff[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

