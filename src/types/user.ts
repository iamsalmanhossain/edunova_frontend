export interface DepartmentRef {
  id: string;
  name: string;
  code?: string;
}

export interface InstituteRef {
  id: string;
  name: string;
  code?: string;
}

export interface StudentProfileData {
  id?: string;
  rollNo?: string | null;
  registrationNo?: string | null;
  session?: string | null;
  semester?: number | null;
  shift?: "FIRST_SHIFT" | "SECOND_SHIFT" | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  dateOfBirth?: string | null;
  bloodGroup?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  address?: string | null;
  institute?: InstituteRef | null;
  department?: DepartmentRef | null;
}

export interface TeacherProfileData {
  id?: string;
  designation?: string | null;
  qualification?: string | null;
  shift?: "FIRST_SHIFT" | "SECOND_SHIFT" | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  bloodGroup?: string | null;
  dateOfBirth?: string | null;
  dateOfJoining?: string | null;
  bio?: string | null;
  institute?: InstituteRef | null;
  department?: DepartmentRef | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: "STUDENT" | "TEACHER" | "ADMIN" | "SUPER_ADMIN";
  status?: string;
  emailVerifiedAt?: string | null;
  createdAt?: string;
  studentProfile?: StudentProfileData | null;
  teacherProfile?: TeacherProfileData | null;
}

export interface UpdateUserProfilePayload {
  name?: string;
  phone?: string | null;
  avatarUrl?: string | null;
  studentProfile?: {
    instituteId?: string;
    departmentId?: string;
    rollNo?: string;
    registrationNo?: string;
    session?: string;
    semester?: number;
    shift?: "FIRST_SHIFT" | "SECOND_SHIFT";
    gender?: "MALE" | "FEMALE" | "OTHER";
    dateOfBirth?: string;
    bloodGroup?: string;
    guardianName?: string;
    guardianPhone?: string;
    address?: string;
  };
  teacherProfile?: {
    instituteId?: string;
    departmentId?: string;
    shift?: "FIRST_SHIFT" | "SECOND_SHIFT";
    designation?: string;
    qualification?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    bloodGroup?: string;
    dateOfBirth?: string;
    dateOfJoining?: string;
    bio?: string;
  };
}

