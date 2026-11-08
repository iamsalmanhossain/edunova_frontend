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

export interface CreateInstitutePayload {
  name: string;
  code: string;
  division: string;
  district: string;
  address?: string;
  website?: string;
  isActive?: boolean;
}

export interface UpdateInstitutePayload {
  name?: string;
  code?: string;
  division?: string;
  district?: string;
  address?: string;
  website?: string;
  isActive?: boolean;
}

export interface QueryInstitutesParams {
  page?: number;
  limit?: number;
  search?: string;
  division?: string;
  district?: string;
  isActive?: boolean;
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

