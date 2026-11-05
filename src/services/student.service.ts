import { apiClient } from "./api-client";
import {
  StudentDashboardOverviewData,
  StudentAttendanceStatsData,
  StudentAttendanceHistoryResponse,
  QueryStudentAttendanceParams,
  StudentResultsResponse,
  StudentExamDetailData,
  QueryStudentResultsParams,
} from "@/types/student";

export const studentService = {
  /**
   * 1. Student Dashboard Overview
   * GET /dashboard/student/overview
   */
  async getOverview(semester?: number): Promise<StudentDashboardOverviewData> {
    const qs = semester ? `?semester=${semester}` : "";
    const res = await apiClient.get<StudentDashboardOverviewData>(`/dashboard/student/overview${qs}`);
    return res.data!;
  },

  /**
   * 2. Student Personal Attendance Stats & Breakdown
   * GET /dashboard/student/attendance/my-stats
   */
  async getAttendanceStats(): Promise<StudentAttendanceStatsData> {
    const res = await apiClient.get<StudentAttendanceStatsData>("/dashboard/student/attendance/my-stats");
    return res.data!;
  },

  /**
   * 3. Student Personal Attendance History Log
   * GET /dashboard/student/attendance/my-history
   */
  async getAttendanceHistory(
    params?: QueryStudentAttendanceParams
  ): Promise<StudentAttendanceHistoryResponse> {
    const query = new URLSearchParams();
    if (params?.subjectId) query.set("subjectId", params.subjectId);
    if (params?.type && params.type !== "ALL") query.set("type", params.type);
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    const qs = query.toString();
    const endpoint = `/dashboard/student/attendance/my-history${qs ? `?${qs}` : ""}`;
    const res = await apiClient.get<StudentAttendanceHistoryResponse>(endpoint);
    return res.data!;
  },

  /**
   * 4. View My Published Results
   * GET /dashboard/student/results
   */
  async getResults(
    params?: QueryStudentResultsParams
  ): Promise<StudentResultsResponse> {
    const query = new URLSearchParams();
    if (params?.semester != null) query.set("semester", params.semester.toString());
    if (params?.session) query.set("session", params.session);
    if (params?.subjectId) query.set("subjectId", params.subjectId);
    if (params?.examType && params.examType !== "ALL") query.set("examType", params.examType);

    const qs = query.toString();
    const endpoint = `/dashboard/student/results${qs ? `?${qs}` : ""}`;
    const res = await apiClient.get<StudentResultsResponse>(endpoint);
    return res.data!;
  },

  /**
   * 5. View Individual Result Details
   * GET /dashboard/student/results/:examId
   */
  async getResultDetails(examId: string): Promise<StudentExamDetailData> {
    const res = await apiClient.get<StudentExamDetailData>(`/dashboard/student/results/${examId}`);
    return res.data!;
  },

  /**
   * 6. Download / View My Result PDF
   * GET /dashboard/student/results/:examId/pdf
   */
  async downloadResultPdf(examId: string, download = true): Promise<Blob> {
    return apiClient.getBlob(
      `/dashboard/student/results/${examId}/pdf${download ? "?download=true" : ""}`
    );
  },
};
