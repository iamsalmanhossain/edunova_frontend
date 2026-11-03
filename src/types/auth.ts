import { StudentProfileData, TeacherProfileData } from "./user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface StudentRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  instituteId: string;
  departmentId: string;
  rollNo: string;
  registrationNo?: string;
  semester: number;
  shift: "FIRST_SHIFT" | "SECOND_SHIFT";
  session?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface TeacherRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  instituteId: string;
  departmentId: string;
  shift: "FIRST_SHIFT" | "SECOND_SHIFT";
  designation?: string;
  qualification?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "STUDENT";
  phone?: string | null;
  avatarUrl?: string | null;
  status?: string;
  instituteId?: string;
  departmentId?: string;
  teacherApprovalStatus?: string;
  studentProfile?: StudentProfileData | null;
  teacherProfile?: TeacherProfileData | null;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: AuthUser;
  };
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface VerifyEmailPayload {
  email?: string;
  code?: string;
  otp?: string;
  token?: string;
}

