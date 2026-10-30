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
  avatarUrl?: string | null;
  status?: string;
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

