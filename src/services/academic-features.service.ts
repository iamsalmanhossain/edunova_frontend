import { apiClient } from "./api-client";
import { downloadSecureFile } from "@/utils/fileDownload";
import {
  SubjectMasterOverviewData,
  CreateDiaryPayload,
  ClassDiaryEntry,
  ExamReminderItem,
  PageGuideData,
  AttendanceRegisterData,
  StudentOverviewResponse,
} from "@/types/academic-features";

export const academicFeaturesService = {
  // ==========================================
  // 1. Master Subject Overview & Landscape PDF
  // ==========================================
  async getMasterSubjectOverview(
    subjectId: string,
    semester?: number
  ): Promise<SubjectMasterOverviewData> {
    const query = new URLSearchParams();
    query.set("subjectId", subjectId);
    if (semester) query.set("semester", semester.toString());

    const res = await apiClient.get<SubjectMasterOverviewData>(
      `/dashboard/teacher/marks/subject-overview?${query.toString()}`
    );
    return res.data!;
  },

  async downloadMasterSubjectOverviewPdf(
    subjectId: string,
    semester?: number,
    subjectName?: string
  ): Promise<void> {
    const query = new URLSearchParams();
    query.set("subjectId", subjectId);
    if (semester) query.set("semester", semester.toString());
    query.set("download", "true");

    const endpoint = `/dashboard/teacher/marks/subject-overview/pdf?${query.toString()}`;
    const cleanSubject = (subjectName || "Subject").replace(/[^a-zA-Z0-9_\-]/g, "_");
    const fallbackFilename = `${cleanSubject}_Semester_${semester || 1}_Master_Overview.pdf`;

    await downloadSecureFile(endpoint, fallbackFilename);
  },

  // ==========================================
};
