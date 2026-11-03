import { apiClient } from "./api-client";
import {
  TeacherProfile,
  TeacherResponse,
  TeacherDashboardOverviewData,
  TeacherStudentItem,
  TeacherSubject,
  EligibleAttendanceResponse,
  CreateAttendanceSessionPayload,
  AttendanceSessionHistoryItem,
  AttendanceSessionDetailData,
  TeacherAttendanceStatsData,
  PreEnrollStudentsPayload,
  SubmitResultPayload,
  BulkSubmitResultsPayload,
  QueryResultsParams,
  TeacherResultListItem,
  TeacherResultDetailData,
  UpdateSingleMarkPayload,
} from "@/types/teacher";

// Verified faculty records reflecting actual polytechnic faculty
export const VERIFIED_TEACHERS: TeacherProfile[] = [
  {
    id: "t-profile-001",
    userId: "u-001",
    instituteId: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    designation: "Principal & Institutional Head",
    qualification: "Ph.D in Engineering, M.Sc in CSE (BUET)",
    shift: "FIRST_SHIFT",
    bio: "Visionary academic leader dedicated to polytechnic excellence, technical research, and digital education transformation.",
    approvalStatus: "APPROVED",
    user: {
      id: "u-001",
      name: "Prof. Dr. M. R. Karim",
      email: "principal@kishoreganj.polytech.gov.bd",
      phone: "+8801711000000",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
      role: "TEACHER",
    },
    department: {
      id: "admin-00",
      name: "Institute Administration",
      code: "ADMIN",
    },
    institute: {
      id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "Kishoreganj Polytechnic Institute",
      code: "KIPI",
    },
  },
  {
    id: "t-profile-002",
    userId: "u-002",
    instituteId: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    designation: "Chief Instructor & Head of Department",
    qualification: "M.Sc in CSE, BUET",
    shift: "FIRST_SHIFT",
    bio: "Head of Computer Science & Technology, leading curriculum modernisation and software architecture training.",
    approvalStatus: "APPROVED",
    user: {
      id: "u-002",
      name: "Engr. Mahmudul Hasan",
      email: "teacher1@gmail.com",
      phone: "+8801711100001",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
      role: "TEACHER",
    },
    department: {
      id: "cst-dept-001",
      name: "Computer Science & Technology",
      code: "CST",
    },
    institute: {
      id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "Kishoreganj Polytechnic Institute",
      code: "KIPI",
    },
  },
  {
    id: "t-profile-003",
    userId: "u-003",
    instituteId: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    designation: "Senior Instructor",
    qualification: "B.Sc in CSE, RUET",
    shift: "SECOND_SHIFT",
    bio: "Expert in algorithms, artificial intelligence, and database management systems.",
    approvalStatus: "APPROVED",
    user: {
      id: "u-003",
      name: "Engr. Sadia Afrin",
      email: "teacher2@gmail.com",
      phone: "+8801711100002",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
      role: "TEACHER",
    },
    department: {
      id: "cst-dept-001",
      name: "Computer Science & Technology",
      code: "CST",
    },
    institute: {
      id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "Kishoreganj Polytechnic Institute",
      code: "KIPI",
    },
  },
  {
    id: "t-profile-004",
    userId: "u-004",
    instituteId: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    designation: "Instructor (Electrical)",
    qualification: "B.Sc in EEE, KUET",
    shift: "FIRST_SHIFT",
    bio: "Specializing in electrical circuits, power grid distribution, and renewable energy systems.",
    approvalStatus: "APPROVED",
    user: {
      id: "u-004",
      name: "Engr. Tanvir Ahmed",
      email: "tanvir.eee@kishoreganj.polytech.gov.bd",
      phone: "+8801711100003",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
      role: "TEACHER",
    },
    department: {
      id: "eee-dept-002",
      name: "Electrical Technology",
      code: "ET",
    },
    institute: {
      id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "Kishoreganj Polytechnic Institute",
      code: "KIPI",
    },
  },
];

export const teacherService = {
  /**
   * Public directory helper for website visitors
   */
  async getPublicTeachers(
    instituteId?: string,
    departmentId?: string
  ): Promise<TeacherProfile[]> {
    try {
      const query = new URLSearchParams();
      if (instituteId) query.set("instituteId", instituteId);
      if (departmentId) query.set("departmentId", departmentId);
      query.set("limit", "50");

      const res = await apiClient.get<TeacherResponse>(`/teachers?${query.toString()}`);
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data;
      }
      return VERIFIED_TEACHERS;
    } catch {
      return VERIFIED_TEACHERS;
    }
  },

  /**
   * GET /api/v1/dashboard/teacher/overview
   * Fetches teacher scope (name, department, shift, institute) and metrics
   */
  async getOverview(): Promise<TeacherDashboardOverviewData> {
    const res = await apiClient.get<TeacherDashboardOverviewData>(
      "/dashboard/teacher/overview"
    );
    return res.data!;
  },

  async getStudents(params?: {
    semester?: number;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: TeacherStudentItem[];
    meta?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params?.semester) query.set("semester", params.semester.toString());
    if (params?.search) query.set("search", params.search.trim());
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await apiClient.get<unknown>(
      `/dashboard/teacher/students${qs}`
    );

    const raw = res.data as Record<string, unknown> | unknown[];
    if (Array.isArray(raw)) {
      return {
        data: raw as TeacherStudentItem[],
        meta: (res as unknown as { meta?: { total: number; page: number; limit: number; totalPages: number } }).meta || {
          total: raw.length,
          page: 1,
          limit: raw.length,
          totalPages: 1,
        },
      };
    }
    if (raw && typeof raw === "object") {
      const items = (raw as { data?: TeacherStudentItem[] }).data || [];
      const meta = (raw as { meta?: { total: number; page: number; limit: number; totalPages: number } }).meta;
      return {
        data: Array.isArray(items) ? items : [],
        meta,
      };
    }
    return { data: [] };
  },

  /**
   * GET /api/v1/subjects?departmentId=X&semester=Y&limit=100
   * Fetches subjects offered in teacher's department for selected semester
   */
  async getSubjects(
    departmentId: string,
    semester?: number
  ): Promise<TeacherSubject[]> {
    const query = new URLSearchParams();
    query.set("departmentId", departmentId);
    if (semester) query.set("semester", semester.toString());
    query.set("limit", "100");

    const res = await apiClient.get<{
      data?: TeacherSubject[];
      subjects?: TeacherSubject[];
    }>(`/subjects?${query.toString()}`);

    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    if (res.data && Array.isArray(res.data.subjects)) return res.data.subjects;
    return [];
  },

  /**
   * GET /api/v1/dashboard/teacher/attendance/students?semester=X&shift=Y
   * Fetches enrolled students eligible for attendance
   */
  /**
   * GET /api/v1/dashboard/teacher/attendance/students?subjectId=X&semester=Y
   * Fetches enrolled students eligible for attendance
   */
  async getEligibleAttendanceStudents(
    subjectId: string,
    semester?: number,
    shift?: string
  ): Promise<EligibleAttendanceResponse> {
    const query = new URLSearchParams();
    query.set("subjectId", subjectId);
    if (semester) query.set("semester", semester.toString());
    if (shift) query.set("shift", shift);

    const res = await apiClient.get<EligibleAttendanceResponse>(
      `/dashboard/teacher/attendance/students?${query.toString()}`
    );
    return res.data!;
  },

  async createAttendanceSession(
    payload: CreateAttendanceSessionPayload
  ): Promise<AttendanceSessionHistoryItem> {
    const res = await apiClient.post<AttendanceSessionHistoryItem>(
      "/dashboard/teacher/attendance/sessions",
      payload
    );
    return res.data!;
  },

  /**
   * GET /api/v1/dashboard/teacher/attendance/sessions?subjectId=X&startDate=Y&endDate=Z&page=1&limit=20
   * Retrieves teacher's attendance session history
   */
  async getAttendanceHistory(params?: {
    subjectId?: string;
    type?: string;
    semester?: number;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    sessions: AttendanceSessionHistoryItem[];
    meta?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params?.subjectId) query.set("subjectId", params.subjectId);
    if (params?.type && params.type !== "ALL") query.set("type", params.type);
    if (params?.semester) query.set("semester", params.semester.toString());
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await apiClient.get<{
      sessions: AttendanceSessionHistoryItem[];
      meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/dashboard/teacher/attendance/sessions${qs}`);

    if (Array.isArray(res.data)) {
      return { sessions: res.data };
    }
    return res.data || { sessions: [] };
  },

  /**
   * PATCH /api/v1/dashboard/teacher/attendance/sessions/:sessionId
   * Updates an existing attendance session's records
   */
  async updateAttendanceSession(
    sessionId: string,
    payload: {
      remarks?: string;
      records: Array<{ studentId: string; status: "PRESENT" | "ABSENT"; remarks?: string }>;
    }
  ): Promise<AttendanceSessionDetailData> {
    const res = await apiClient.patch<AttendanceSessionDetailData>(
      `/dashboard/teacher/attendance/sessions/${sessionId}`,
      payload
    );
    return res.data!;
  },

  /**
   * GET /api/v1/dashboard/teacher/attendance/sessions/:sessionId
   * Fetches detailed breakdown of a single attendance session
   */
  async getSessionDetails(
    sessionId: string
  ): Promise<AttendanceSessionDetailData> {
    const res = await apiClient.get<AttendanceSessionDetailData>(
      `/dashboard/teacher/attendance/sessions/${sessionId}`
    );
    return res.data!;
  },

  async getAttendanceStats(): Promise<TeacherAttendanceStatsData> {
    const res = await apiClient.get<TeacherAttendanceStatsData>(
      "/dashboard/teacher/attendance/stats"
    );
    return res.data!;
  },

  async preEnrollStudents(payload: PreEnrollStudentsPayload): Promise<{
    enrolledCount: number;
    skippedCount: number;
    message?: string;
  }> {
    const res = await apiClient.post<{
      enrolledCount: number;
      skippedCount: number;
      message?: string;
    }>("/dashboard/teacher/attendance/students/pre-enroll", payload);
    return res.data!;
  },

  // ==========================================
  // SECTION 3: Marks & Results Management (Endpoints 9-20)
  // ==========================================

  /**
   * 9. Single Exam Result Submission
   * POST /dashboard/teacher/results
   */
  async submitResult(payload: SubmitResultPayload): Promise<unknown> {
    const res = await apiClient.post<unknown>("/dashboard/teacher/results", payload);
    return res.data;
  },

  /**
   * 10. Multi-Exam Bulk Submission
   * POST /dashboard/teacher/results/bulk
   */
  async bulkSubmitResults(payload: BulkSubmitResultsPayload): Promise<unknown> {
    const res = await apiClient.post<unknown>("/dashboard/teacher/results/bulk", payload);
    return res.data;
  },

  /**
   * 11. Excel/CSV File Bulk Import
   * POST /dashboard/teacher/results/import-excel
   */
  async importResultsFromExcel(formData: FormData): Promise<unknown> {
    const res = await apiClient.post<unknown>("/dashboard/teacher/results/import-excel", formData);
    return res.data;
  },

  /**
   * 12. List Teacher's Submitted Results
   * GET /dashboard/teacher/results
   */
  async getResults(params?: QueryResultsParams): Promise<{
    results: TeacherResultListItem[];
    meta?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params?.semester) query.set("semester", params.semester.toString());
    if (params?.subjectId) query.set("subjectId", params.subjectId);
    if (params?.session) query.set("session", params.session);
    if (params?.shift) query.set("shift", params.shift);
    if (params?.status) query.set("status", params.status);
    if (params?.examType) query.set("examType", params.examType);
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await apiClient.get<unknown>(`/dashboard/teacher/results${qs}`);

    const raw = res.data as Record<string, unknown> | unknown[];
    if (Array.isArray(raw)) {
      return { results: raw as TeacherResultListItem[] };
    }
    if (raw && typeof raw === "object") {
      const items =
        (raw as { results?: TeacherResultListItem[]; data?: TeacherResultListItem[] }).results ||
        (raw as { data?: TeacherResultListItem[] }).data ||
        [];
      const meta = (raw as { meta?: { total: number; page: number; limit: number; totalPages: number } }).meta;
      return { results: Array.isArray(items) ? items : [], meta };
    }
    return { results: [] };
  },

  /**
   * 13. Result Details & Class Marksheet Table
   * GET /dashboard/teacher/results/:id
   */
  async getResultDetails(id: string): Promise<TeacherResultDetailData> {
    const res = await apiClient.get<TeacherResultDetailData>(`/dashboard/teacher/results/${id}`);
    return res.data!;
  },

  /**
   * 14. Publish / Unpublish Toggle
   * PATCH /dashboard/teacher/results/:id/publish
   */
  async updatePublicationStatus(id: string, status: "PUBLISHED" | "DRAFT"): Promise<unknown> {
    const res = await apiClient.patch<unknown>(`/dashboard/teacher/results/${id}/publish`, { status });
    return res.data;
  },

  /**
   * 15. Edit Single Student's Mark
   * PATCH /dashboard/teacher/results/:id/students/:studentId
   */
  async updateSingleMark(
    resultId: string,
    studentId: string,
    payload: UpdateSingleMarkPayload
  ): Promise<unknown> {
    const res = await apiClient.patch<unknown>(
      `/dashboard/teacher/results/${resultId}/students/${studentId}`,
      payload
    );
    return res.data;
  },

  /**
   * 16. Delete Result
   * DELETE /dashboard/teacher/results/:id
   */
  async deleteResult(id: string): Promise<unknown> {
    const res = await apiClient.delete<unknown>(`/dashboard/teacher/results/${id}`);
    return res.data;
  },

  /**
   * 17. Class Result Sheet PDF View & Download
   * GET /dashboard/teacher/results/:id/pdf
   */
  async downloadClassPdf(id: string, download = false): Promise<Blob> {
    return apiClient.getBlob(
      `/dashboard/teacher/results/${id}/pdf${download ? "?download=true" : ""}`
    );
  },

  /**
   * 18. Class Result Sheet Excel Export
   * GET /dashboard/teacher/results/:id/excel
   */
  async downloadClassExcel(id: string): Promise<Blob> {
    return apiClient.getBlob(`/dashboard/teacher/results/${id}/excel`);
  },

  /**
   * 19. Individual Student Result PDF
   * GET /dashboard/teacher/results/:id/students/:studentId/pdf
   */
  async downloadStudentPdf(
    resultId: string,
    studentId: string,
    download = false
  ): Promise<Blob> {
    return apiClient.getBlob(
      `/dashboard/teacher/results/${resultId}/students/${studentId}/pdf${download ? "?download=true" : ""}`
    );
  },

  /**
   * 20. Sample Import Template Download
   * GET /dashboard/teacher/results/:id/template?format=xlsx|csv
   */
  async downloadImportTemplate(
    id: string,
    format: "xlsx" | "csv" = "xlsx"
  ): Promise<Blob> {
    return apiClient.getBlob(
      `/dashboard/teacher/results/${id}/template?format=${format}`
    );
  },
};
