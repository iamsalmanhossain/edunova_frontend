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
