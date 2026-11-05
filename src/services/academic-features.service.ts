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
  // 2. Class Diary, Notes & Smart Reminders
  // ==========================================
  async createDiaryEntry(payload: CreateDiaryPayload): Promise<ClassDiaryEntry> {
    const res = await apiClient.post<ClassDiaryEntry>(
      "/dashboard/teacher/diary",
      payload
    );
    return res.data!;
  },

  async createClassDiary(payload: any): Promise<ClassDiaryEntry> {
    const formatted: CreateDiaryPayload = {
      subjectId: payload.subjectId,
      semester: payload.semester,
      date: payload.entryDate || payload.date || new Date().toISOString().split("T")[0],
      chapter: payload.chapter,
      topicsTaught: payload.topicsCovered || payload.topicsTaught || "",
      nextClassPlan: payload.nextClassPlan,
      classNoteUrl: payload.notesUrl || payload.classNoteUrl,
      classNoteTitle: payload.chapter,
      hasExam: payload.hasExamAnnouncement ?? payload.hasExam,
      examTitle: payload.examTitle,
      examDate: payload.examDate,
      examType: payload.examType,
      examSyllabus: payload.syllabus || payload.examSyllabus,
    };
    return this.createDiaryEntry(formatted);
  },

  async getTeacherDiaryEntries(params: {
    subjectId?: string;
    semester?: number;
    shift?: string;
  }): Promise<{ entries: ClassDiaryEntry[]; total: number }> {
    const query = new URLSearchParams();
    if (params.subjectId) query.set("subjectId", params.subjectId);
    if (params.semester) query.set("semester", params.semester.toString());
    if (params.shift) query.set("shift", params.shift);

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await apiClient.get<any>(`/dashboard/teacher/diary${qs}`);
    const raw = res.data ?? res;
    return {
      entries: Array.isArray(raw?.entries) ? raw.entries : Array.isArray(raw) ? raw : [],
      total: raw?.total || 0,
    };
  },

  async getClassDiaryEntries(params?: {
    subjectId?: string;
    semester?: number;
    shift?: string;
  }): Promise<ClassDiaryEntry[]> {
    const query = new URLSearchParams();
    if (params?.subjectId) query.set("subjectId", params.subjectId);
    if (params?.semester) query.set("semester", params.semester.toString());
    if (params?.shift) query.set("shift", params.shift);
    const qs = query.toString() ? `?${query.toString()}` : "";

    const res = await apiClient.get<any>(`/dashboard/teacher/diary${qs}`);
    const raw = res.data ?? res;
    const list = Array.isArray(raw?.entries) ? raw.entries : Array.isArray(raw) ? raw : [];
    return list.map((item: any) => ({
      ...item,
      entryDate: item.entryDate || item.date,
      topicsCovered: item.topicsCovered || item.topicsTaught,
      notesUrl: item.notesUrl || item.classNoteUrl,
      hasExamAnnouncement: item.hasExamAnnouncement ?? item.hasExam,
      syllabus: item.syllabus || item.examSyllabus,
      subject: item.subject || {
        id: item.subjectId,
        name: item.subjectName || "Subject",
        code: item.subjectCode || "SUB",
      },
    }));
  },

  async deleteDiaryEntry(id: string): Promise<boolean> {
    await apiClient.delete(`/dashboard/teacher/diary/${id}`);
    return true;
  },

  async deleteClassDiary(id: string): Promise<boolean> {
    return this.deleteDiaryEntry(id);
  },

  async getStudentDiaryEntries(
    semester?: number
  ): Promise<{ entries: ClassDiaryEntry[]; total: number }> {
    const query = new URLSearchParams();
    if (semester) query.set("semester", semester.toString());
    const qs = query.toString() ? `?${query.toString()}` : "";

    const res = await apiClient.get<any>(`/dashboard/student/diary${qs}`);
    const raw = res.data ?? res;
    const list = Array.isArray(raw?.entries) ? raw.entries : Array.isArray(raw) ? raw : [];
    return {
      entries: list.map((item: any) => ({
        ...item,
        entryDate: item.entryDate || item.date,
        topicsCovered: item.topicsCovered || item.topicsTaught,
        notesUrl: item.notesUrl || item.classNoteUrl,
        hasExamAnnouncement: item.hasExamAnnouncement ?? item.hasExam,
        syllabus: item.syllabus || item.examSyllabus,
        subject: item.subject || {
          id: item.subjectId,
          name: item.subjectName || "Subject",
          code: item.subjectCode || "SUB",
        },
      })),
      total: raw?.total || list.length,
    };
  },

  async getUpcomingReminders(): Promise<{
    reminders: ExamReminderItem[];
    total: number;
  }> {
    const res = await apiClient.get<any>("/dashboard/reminders");
    const raw = res.data ?? res;
    const items = Array.isArray(raw?.reminders) ? raw.reminders : Array.isArray(raw) ? raw : [];
    return {
      reminders: items.map((r: any) => ({
        ...r,
        semester: r.semester || 1,
        notesUrl: r.notesUrl || r.classNoteUrl,
      })),
      total: raw?.total || items.length,
    };
  },

  // ==========================================
  // 3. Dynamic Page Documentation & Help Guides
  // ==========================================
  async getPageGuide(pageKey: string): Promise<PageGuideData | null> {
    try {
      const res = await apiClient.get<any>(`/dashboard/guides/${pageKey}`, {
        skipAuth: true,
      });
      return res.data ?? res;
    } catch {
      return null;
    }
  },

  async listAllGuides(): Promise<PageGuideData[]> {
    try {
      const res = await apiClient.get<any>("/dashboard/guides", { skipAuth: true });
      const raw = res.data ?? res;
      return Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
    } catch {
      return [];
    }
  },

  async updatePageGuide(
    pageKey: string,
    dto: Partial<PageGuideData>
  ): Promise<PageGuideData> {
    const res = await apiClient.patch<PageGuideData>(
      `/dashboard/admin/guides/${pageKey}`,
      dto
    );
    return res.data!;
  },

  // ==========================================
  // 4. Semester Progression & Clean Student State
  // ==========================================
  async getStudentOverviewWithSemester(
    semester?: number
  ): Promise<StudentOverviewResponse> {
    const query = new URLSearchParams();
    if (semester) query.set("semester", semester.toString());
    const qs = query.toString() ? `?${query.toString()}` : "";

    const res = await apiClient.get<StudentOverviewResponse>(
      `/dashboard/student/overview${qs}`
    );
    return res.data!;
  },

  // ==========================================
};
