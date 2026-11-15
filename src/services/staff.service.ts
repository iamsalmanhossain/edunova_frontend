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
   * Admin-only query (includes unlisted and option for deleted staff)
   * GET /api/v1/institution-staff/admin/all
   */
  async getAdminStaff(params?: QueryStaffParams): Promise<StaffListResponse> {
    const query = new URLSearchParams();
    if (params?.instituteId) query.set("instituteId", params.instituteId);
    if (params?.departmentId) query.set("departmentId", params.departmentId);
    if (params?.shift) query.set("shift", params.shift);
    if (params?.role) query.set("role", params.role);
    if (params?.search) query.set("search", params.search.trim());
    if (params?.isPublished !== undefined) query.set("isPublished", String(params.isPublished));
    if (params?.includeDeleted !== undefined) query.set("includeDeleted", String(params.includeDeleted));
    if (params?.page) query.set("page", params.page.toString());
    query.set("limit", (params?.limit || 30).toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await apiClient.get<StaffListResponse>(`/institution-staff/admin/all${qs}`);

    const raw = res.data ?? (res as unknown as StaffListResponse);
    if (raw && "data" in raw && Array.isArray(raw.data)) {
      return raw;
    }
    return { data: [], meta: { total: 0, page: 1, limit: 30, totalPages: 1 } };
  },

  /**
   * Admin creates a staff member
   * POST /api/v1/institution-staff
   */
  async createStaff(payload: CreateStaffPayload): Promise<InstitutionStaff> {
    const res = await apiClient.post<InstitutionStaff>("/institution-staff", payload);
    return res.data ?? (res as unknown as InstitutionStaff);
  },

  /**
   * Admin updates an existing staff member
   * PATCH /api/v1/institution-staff/:id
   */
  async updateStaff(id: string, payload: UpdateStaffPayload): Promise<InstitutionStaff> {
    const res = await apiClient.patch<InstitutionStaff>(`/institution-staff/${id}`, payload);
    return res.data ?? (res as unknown as InstitutionStaff);
  },

  /**
   * Admin soft-deletes a staff member
   * DELETE /api/v1/institution-staff/:id
   */
  async deleteStaff(id: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete<{ success: boolean; message: string }>(
      `/institution-staff/${id}`
    );
    return res.data ?? { success: true, message: "Staff soft-deleted successfully" };
  },

  /**
   * Admin restores a soft-deleted staff member
   * POST /api/v1/institution-staff/:id/restore
   */
  async restoreStaff(id: string): Promise<InstitutionStaff> {
    const res = await apiClient.post<InstitutionStaff>(`/institution-staff/${id}/restore`);
    return res.data ?? (res as unknown as InstitutionStaff);
  },

  /**
   * Admin triggers automatic sync of all registered teachers
   * POST /api/v1/institution-staff/sync-teachers
   */
  async syncTeachers(instituteId?: string): Promise<{ success: boolean; message: string; syncedCount: number }> {
    const query = instituteId ? `?instituteId=${instituteId}` : "";
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      syncedCount: number;
    }>(`/institution-staff/sync-teachers${query}`);
    return res.data ?? { success: true, message: "Teachers synchronized", syncedCount: 0 };
  },
};
