import { apiClient } from "./api-client";
import {
  InstitutionStaff,
  CreateStaffPayload,
  UpdateStaffPayload,
  QueryStaffParams,
  StaffListResponse,
} from "@/types/staff";

/**
 * Normalizes API response structures from NestJS / Axios / Fetch
 * into a consistent StaffListResponse format.
 */
function parseStaffList(res: unknown, defaultLimit = 50): StaffListResponse {
  const container = (res as { data?: unknown; meta?: unknown }) ?? {};
  const raw = container.data ?? res;
  let items: InstitutionStaff[] = [];

  if (Array.isArray(raw)) {
    items = raw as InstitutionStaff[];
  } else if (raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data)) {
    items = (raw as { data: InstitutionStaff[] }).data;
  }

  const rawMeta =
    (container.meta as { total?: number; page?: number; limit?: number; totalPages?: number }) ??
    (raw && typeof raw === "object" ? (raw as { meta?: { total?: number; page?: number; limit?: number; totalPages?: number } }).meta : undefined) ?? {
      total: items.length,
      page: 1,
      limit: defaultLimit,
      totalPages: Math.max(1, Math.ceil(items.length / defaultLimit)),
    };

  return {
    data: items,
    meta: {
      total: Number(rawMeta?.total ?? items.length),
      page: Number(rawMeta?.page ?? 1),
      limit: Number(rawMeta?.limit ?? defaultLimit),
      totalPages: Number(rawMeta?.totalPages ?? 1),
    },
  };
}

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
    query.set("limit", (params?.limit || 100).toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    try {
      const res = await apiClient.get<unknown>(`/institution-staff${qs}`, {
        skipAuth: true,
      });
      return parseStaffList(res, params?.limit || 100);
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 100, totalPages: 1 } };
    }
  },

  /**
   * Public retrieval of a single staff record
   * GET /api/v1/institution-staff/:id
   */
  async getStaffById(id: string): Promise<InstitutionStaff | null> {
    try {
      const res = await apiClient.get<unknown>(`/institution-staff/${id}`, {
        skipAuth: true,
      });
      const container = res as { data?: unknown };
      const raw = container?.data ?? res;
      if (raw && typeof raw === "object" && "id" in raw) {
        return raw as InstitutionStaff;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Admin-only query (includes unlisted and option for deleted staff)
   * GET /api/v1/institution-staff/admin/all
   * Gracefully falls back to public staff endpoint if admin authorization fails
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
    query.set("limit", (params?.limit || 100).toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    try {
      const res = await apiClient.get<unknown>(`/institution-staff/admin/all${qs}`);
      const parsed = parseStaffList(res, params?.limit || 100);
      if (parsed.data.length > 0) {
        return parsed;
      }
      // If admin response returned empty array, attempt public directory query
      return await staffService.getPublicStaff(params);
    } catch {
      // Graceful fallback to public directory on 401/403 or network issues
      try {
        return await staffService.getPublicStaff(params);
      } catch {
        return { data: [], meta: { total: 0, page: 1, limit: 100, totalPages: 1 } };
      }
    }
  },

  /**
   * Admin creates a staff member
   * POST /api/v1/institution-staff
   */
  async createStaff(payload: CreateStaffPayload): Promise<InstitutionStaff> {
    const res = await apiClient.post<unknown>("/institution-staff", payload);
    const container = res as { data?: unknown };
    return (container?.data ?? res) as InstitutionStaff;
  },

  /**
   * Admin updates an existing staff member
   * PATCH /api/v1/institution-staff/:id
   */
  async updateStaff(id: string, payload: UpdateStaffPayload): Promise<InstitutionStaff> {
    const res = await apiClient.patch<unknown>(`/institution-staff/${id}`, payload);
    const container = res as { data?: unknown };
    return (container?.data ?? res) as InstitutionStaff;
  },

  /**
   * Admin soft-deletes a staff member
   * DELETE /api/v1/institution-staff/:id
   */
  async deleteStaff(id: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete<{ success: boolean; message: string }>(
      `/institution-staff/${id}`
    );
    const container = res as { data?: { success: boolean; message: string }; message?: string };
    return (
      container?.data ?? {
        success: true,
        message: container?.message ?? "Staff soft-deleted successfully",
      }
    );
  },

  /**
   * Admin restores a soft-deleted staff member
   * POST /api/v1/institution-staff/:id/restore
   */
  async restoreStaff(id: string): Promise<InstitutionStaff> {
    const res = await apiClient.post<unknown>(`/institution-staff/${id}/restore`);
    const container = res as { data?: unknown };
    return (container?.data ?? res) as InstitutionStaff;
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
    const container = res as {
      data?: { success: boolean; message: string; syncedCount: number };
      message?: string;
    };
    return (
      container?.data ?? {
        success: true,
        message: container?.message ?? "Teachers synchronized",
        syncedCount: 0,
      }
    );
  },
};
