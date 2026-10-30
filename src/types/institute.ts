export interface Institute {
  id: string;
  name: string;
  code: string;
  division: string;
  district: string;
  address: string | null;
  website: string | null;
  isActive: boolean;
  studentCount?: number;
  teacherCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface InstituteResponse {
  success: boolean;
  data: Institute | Institute[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

