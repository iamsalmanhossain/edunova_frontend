import { apiClient } from "./api-client";
import {
  AdminOverviewData,
  AdminTeachersResponse,
  QueryAdminTeachersParams,
  PendingTeachersResponse,
  UpdateTeacherPayload,
  AdminTeacherItem,
  AdminStudentsResponse,
  QueryAdminStudentsParams,
  AdminStudentItem,
  UpdateStudentPayload,
  UserAccountStatus,
  AuditLogsResponse,
  QueryAuditLogsParams,
  MasterDepartment,
  MasterSubject,
} from "@/types/admin";

export const adminService = {
  /**
   * 1. Admin Dashboard Overview
   * GET /dashboard/admin/overview
   */
  async getOverview(instituteId?: string): Promise<AdminOverviewData> {
    const qs = instituteId ? `?instituteId=${instituteId}` : "";
    const res = await apiClient.get<any>(`/dashboard/admin/overview${qs}`);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 2. List All Teachers (With Filters & Pagination)
   * GET /dashboard/admin/teachers
   */
  async getTeachers(params?: QueryAdminTeachersParams): Promise<AdminTeachersResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    if (params?.approvalStatus) query.set("approvalStatus", params.approvalStatus);
    if (params?.departmentId) query.set("departmentId", params.departmentId);
    if (params?.shift && (params.shift as string) !== "ALL") {
      const s =
        (params.shift as string) === "FIRST"
          ? "FIRST_SHIFT"
          : (params.shift as string) === "SECOND"
          ? "SECOND_SHIFT"
          : params.shift;
      query.set("shift", s);
    }

    const qs = query.toString();
    const res = await apiClient.get<any>(`/dashboard/admin/teachers${qs ? `?${qs}` : ""}`);

    const rawData = res.data ?? res;
    let items: AdminTeacherItem[] = [];
    if (Array.isArray(rawData)) {
      items = rawData;
    } else if (Array.isArray(rawData?.data)) {
      items = rawData.data;
    }

    const rawMeta = res.meta ?? rawData?.meta ?? {
      page: 1,
      limit: 20,
      total: items.length,
      totalPages: 1,
    };

    return {
      success: true,
      data: items,
      meta: rawMeta,
    };
  },

  /**
   * 3. Get Pending Teachers Queue
   * GET /dashboard/admin/teachers/pending
   */
  async getPendingTeachers(): Promise<PendingTeachersResponse> {
    const res = await apiClient.get<any>("/dashboard/admin/teachers/pending");
    const raw = res.data ?? res;
    if (raw && Array.isArray(raw.teachers)) {
      return { teachers: raw.teachers };
    }
    if (Array.isArray(raw)) {
      return { teachers: raw };
    }
    if (Array.isArray(raw?.data)) {
      return { teachers: raw.data };
    }
    return { teachers: [] };
  },

  /**
   * 4. Approve Teacher Registration
   * PATCH /dashboard/admin/teachers/:teacherId/approve
   */
  async approveTeacher(teacherId: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.patch<any>(
      `/dashboard/admin/teachers/${teacherId}/approve`
    );
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 5. Reject Teacher Registration
   * PATCH /dashboard/admin/teachers/:teacherId/reject
   */
  async rejectTeacher(
    teacherId: string,
    rejectionReason: string
  ): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.patch<any>(
      `/dashboard/admin/teachers/${teacherId}/reject`,
      { rejectionReason }
    );
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 6. Get Single Teacher Details
   * GET /dashboard/admin/teachers/:id
   */
  async getTeacherById(id: string): Promise<AdminTeacherItem> {
    const res = await apiClient.get<any>(`/dashboard/admin/teachers/${id}`);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 7. Update Teacher Profile (By Admin)
   * PATCH /dashboard/admin/teachers/:id
   */
  async updateTeacher(id: string, payload: UpdateTeacherPayload): Promise<AdminTeacherItem> {
    const res = await apiClient.patch<any>(
      `/dashboard/admin/teachers/${id}`,
      payload
    );
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 8. List All Students (With Filters & Pagination)
   * GET /dashboard/admin/students
   */
  async getStudents(params?: QueryAdminStudentsParams): Promise<AdminStudentsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    if (params?.departmentId) query.set("departmentId", params.departmentId);
    if (params?.semester != null) query.set("semester", params.semester.toString());
    if (params?.shift && (params.shift as string) !== "ALL") {
      const s =
        (params.shift as string) === "FIRST"
          ? "FIRST_SHIFT"
          : (params.shift as string) === "SECOND"
          ? "SECOND_SHIFT"
          : params.shift;
      query.set("shift", s);
    }
    if (params?.session) query.set("session", params.session);
    if (params?.rollNo) query.set("rollNo", params.rollNo);

    const qs = query.toString();
    const res = await apiClient.get<any>(`/dashboard/admin/students${qs ? `?${qs}` : ""}`);

    const rawData = res.data ?? res;
    let items: AdminStudentItem[] = [];
    if (Array.isArray(rawData)) {
      items = rawData;
    } else if (Array.isArray(rawData?.data)) {
      items = rawData.data;
    }

    const rawMeta = res.meta ?? rawData?.meta ?? {
      page: 1,
      limit: 20,
      total: items.length,
      totalPages: 1,
    };

    return {
      success: true,
      data: items,
      meta: rawMeta,
    };
  },

  /**
   * 9. Get Single Student Details
   * GET /dashboard/admin/students/:id
   */
  async getStudentById(id: string): Promise<AdminStudentItem> {
    const res = await apiClient.get<any>(`/dashboard/admin/students/${id}`);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 10. Update Student Record (By Admin)
   * PATCH /dashboard/admin/students/:id
   */
  async updateStudent(id: string, payload: UpdateStudentPayload): Promise<AdminStudentItem> {
    const res = await apiClient.patch<any>(
      `/dashboard/admin/students/${id}`,
      payload
    );
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 11. Suspend, Activate, or Deactivate Any User Account
   * PATCH /dashboard/admin/users/:userId/status
   */
  async updateUserStatus(
    userId: string,
    status: UserAccountStatus
  ): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.patch<any>(
      `/dashboard/admin/users/${userId}/status`,
      { status }
    );
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 12. View Security & Action Audit Logs
   * GET /dashboard/admin/audit-logs
   */
  async getAuditLogs(params?: QueryAuditLogsParams): Promise<AuditLogsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.action) query.set("action", params.action);
    if (params?.actorId) query.set("actorId", params.actorId);

    const qs = query.toString();
    const res = await apiClient.get<any>(`/dashboard/admin/audit-logs${qs ? `?${qs}` : ""}`);

    const rawData = res.data ?? res;
    let items: any[] = [];
    if (Array.isArray(rawData)) {
      items = rawData;
    } else if (Array.isArray(rawData?.data)) {
      items = rawData.data;
    }

    const rawMeta = res.meta ?? rawData?.meta ?? {
      page: 1,
      limit: 20,
      total: items.length,
      totalPages: 1,
    };

    return {
      success: true,
      data: items,
      meta: rawMeta,
    };
  },

  /**
   * 13. Academic Master Data: Departments
   */
  async getDepartments(instituteId?: string): Promise<MasterDepartment[]> {
    const qs = instituteId ? `?instituteId=${instituteId}` : "";
    const res = await apiClient.get<any>(`/departments${qs}`);
    const raw = res.data ?? res;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    return [];
  },

  async createDepartment(payload: { name: string; code: string }): Promise<MasterDepartment> {
    const res = await apiClient.post<any>("/departments", payload);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  async assignDepartmentToInstitute(
    instituteId: string,
    departmentId: string
  ): Promise<unknown> {
    const res = await apiClient.post(`/departments/institutes/${instituteId}/assign`, {
      departmentId,
    });
    return res.data;
  },

  async removeDepartmentFromInstitute(
    instituteId: string,
    departmentId: string
  ): Promise<unknown> {
    const res = await apiClient.delete(
      `/departments/institutes/${instituteId}/remove/${departmentId}`
    );
    return res.data;
  },

  /**
   * 14. Academic Master Data: Subjects
   */
  async getSubjects(departmentId?: string, semester?: number): Promise<MasterSubject[]> {
    const query = new URLSearchParams();
    if (departmentId) query.set("departmentId", departmentId);
    if (semester != null) query.set("semester", semester.toString());
    const qs = query.toString();
    const res = await apiClient.get<any>(`/subjects${qs ? `?${qs}` : ""}`);
    const raw = res.data ?? res;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    return [];
  },

  async createSubject(payload: {
    name: string;
    code: string;
    semester: number;
    credit: number;
    departmentId: string;
  }): Promise<MasterSubject> {
    const res = await apiClient.post<any>("/subjects", payload);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  async updateSubject(
    id: string,
    payload: Partial<{ name: string; code: string; semester: number; credit: number }>
  ): Promise<MasterSubject> {
    const res = await apiClient.patch<any>(`/subjects/${id}`, payload);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  async deleteSubject(id: string): Promise<unknown> {
    const res = await apiClient.delete(`/subjects/${id}`);
    return res.data;
  },

  /**
   * 15. Result Submission Guidelines (Admin View & Update)
   * GET /dashboard/admin/result-guide
   * POST /dashboard/admin/result-guide
   */
  async getResultGuide(): Promise<any> {
    const res = await apiClient.get<any>("/dashboard/admin/result-guide");
    return res.data ?? res;
  },

  async updateResultGuide(payload: {
    title?: string;
    description?: string;
    customNotes?: string;
    instructions?: string[];
    rules?: string[];
    samplePayload?: any;
    examples?: any;
  }): Promise<any> {
    const res = await apiClient.post<any>("/dashboard/admin/result-guide", payload);
    return res.data ?? res;
  },

  /**
   * 16. Soft Delete Teacher (Admin Only)
   * DELETE /dashboard/admin/teachers/:id
   */
  async deleteTeacher(id: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete<any>(`/dashboard/admin/teachers/${id}`);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },

  /**
   * 17. Soft Delete Student (Admin Only)
   * DELETE /dashboard/admin/students/:id
   */
  async deleteStudent(id: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete<any>(`/dashboard/admin/students/${id}`);
    const raw = res.data ?? res;
    return raw?.data ?? raw;
  },
};
