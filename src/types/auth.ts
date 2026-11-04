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

export interface ClaimStudentAccountPayload {
  departmentId: string;
  shift: "FIRST" | "SECOND" | "FIRST_SHIFT" | "SECOND_SHIFT";
  rollNo: string;
  name?: string;
  email: string;
  password: string;
  phone?: string;
  registrationNo?: string;
}

export interface ClaimStudentAccountResponse {
  success: boolean;
  message: string;
  data: {
    student: {
      id: string;
      userId: string;
      rollNo: string;
      registrationNo?: string;
      semester: number;
      shift: string;
      isClaimed: boolean;
      user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        role: "STUDENT";
        status: string;
      };
      department: {
        id: string;
        name: string;
        code: string;
      };
      institute: {
        id: string;
        name: string;
        code: string;
      };
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
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

