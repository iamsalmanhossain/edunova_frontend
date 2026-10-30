export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  slug?: string;
  subjects?: Array<{
    id: string;
    code: string;
    name: string;
    semester: number;
    credit: number;
  }>;
  _count?: {
    subjects?: number;
    studentProfiles?: number;
    teacherProfiles?: number;
    instituteDepartments?: number;
  };
  instituteDepartmentId?: string;
  imageUrl?: string;
  highlights?: string[];
}

export interface DepartmentResponse {
  success: boolean;
  data: Department | Department[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

