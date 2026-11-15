import { apiClient } from "./api-client";
import {
  InstitutionStaff,
  CreateStaffPayload,
  UpdateStaffPayload,
  QueryStaffParams,
  StaffListResponse,
} from "@/types/staff";

export const staffService = {
  /**
   * Public directory list of published staff members
   * GET /api/v1/institution-staff
   */
  async getPublicStaff(params?: QueryStaffParams): Promise<StaffListResponse> {
    const query = new URLSearchParams();
    if (params?.instituteId) query.set("instituteId", params.instituteId);
    if (params?.departmentId) query.set("departmentId", params.departmentId);
    if (params?.shift) query.set("shift", params.shift);
    if (params?.role) query.set("role", params.role);
    if (params?.search) query.set("search", params.search.trim());
    if (params?.page) query.set("page", params.page.toString());
    query.set("limit", (params?.limit || 50).toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await apiClient.get<StaffListResponse>(`/institution-staff${qs}`, {
      skipAuth: true,
    });

    const raw = res.data ?? (res as unknown as StaffListResponse);
    if (raw && "data" in raw && Array.isArray(raw.data)) {
      return raw;
    }
    if (Array.isArray(raw)) {
      return {
        data: raw as InstitutionStaff[],
        meta: { total: (raw as InstitutionStaff[]).length, page: 1, limit: 50, totalPages: 1 },
      };
    }
    return { data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 1 } };
  },

  /**
   * Public retrieval of a single staff record
   * GET /api/v1/institution-staff/:id
   */
  async getStaffById(id: string): Promise<InstitutionStaff | null> {
    try {
      const res = await apiClient.get<InstitutionStaff>(`/institution-staff/${id}`, {
        skipAuth: true,
      });
      return res.data ?? (res as unknown as InstitutionStaff);
    } catch {
      return null;
    }
  },

  /**
};
