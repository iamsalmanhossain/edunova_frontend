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
  resolvedAvatarUrl?: string | null;
  institute?: StaffInstitute;
  department?: StaffDepartment | null;
  user?: StaffUser | null;
}

export interface CreateStaffPayload {
  instituteId: string;
  userId?: string;
  name?: string;
  avatarUrl?: string;
  departmentId?: string;
  designation: string;
  role: InstitutionStaffRole;
  shift?: Shift;
  isPublished?: boolean;
  displayOrder?: number;
}

export type UpdateStaffPayload = Partial<CreateStaffPayload>;

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

export const ROLE_LABELS: Record<InstitutionStaffRole, string> = {
  PRINCIPAL: "Principal & Head of Institute",
  CHIEF_INSTRUCTOR: "Chief Instructor",
  INSTRUCTOR: "Instructor",
  JUNIOR_INSTRUCTOR: "Junior Instructor",
  ADMINISTRATIVE_SECTION: "Administrative Section",
  ACCOUNTS_SECTION: "Accounts Section",
  JOB_PLACEMENT_CELL: "Job Placement Cell",
  ROVER_SCOUT_UNIT: "Rover Scout Unit",
  STORE_SECTION: "Store Section",
  SECURITY_SECTION: "Security Section",
  LIBRARY: "Library & Information",
  FOURTH_CLASS_EMPLOYEE_REVENUE: "4th Class Employee (Revenue)",
  OUTSOURCED_STAFF: "Outsourced Staff",
};

export const ROLE_CATEGORIES = {
  ALL: "All Personnel",
  LEADERSHIP: "Leadership & Administration",
  FACULTY: "Academic Faculty",
  CELLS: "Special Units & Cells",
  SUPPORT: "Support & Security Staff",
} as const;

export function getRoleCategory(role: InstitutionStaffRole): keyof typeof ROLE_CATEGORIES {
  switch (role) {
    case "PRINCIPAL":
    case "ADMINISTRATIVE_SECTION":
    case "ACCOUNTS_SECTION":
    case "STORE_SECTION":
      return "LEADERSHIP";
    case "CHIEF_INSTRUCTOR":
    case "INSTRUCTOR":
    case "JUNIOR_INSTRUCTOR":
      return "FACULTY";
    case "JOB_PLACEMENT_CELL":
    case "ROVER_SCOUT_UNIT":
    case "LIBRARY":
      return "CELLS";
    case "SECURITY_SECTION":
    case "FOURTH_CLASS_EMPLOYEE_REVENUE":
    case "OUTSOURCED_STAFF":
      return "SUPPORT";
    default:
      return "ALL";
  }
}
