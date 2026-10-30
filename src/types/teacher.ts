export interface TeacherUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  instituteId: string;
  departmentId?: string | null;
  shift?: "FIRST_SHIFT" | "SECOND_SHIFT" | null;
  designation?: string | null;
  qualification?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  bloodGroup?: string | null;
  bio?: string | null;
  approvalStatus?: string;
  user: TeacherUser;
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

export interface TeacherResponse {
  success: boolean;
  data: TeacherProfile[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

