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
  // 5. Date-wise Attendance Register & Matrix
  // ==========================================
  async getAttendanceRegister(params: {
    subjectId: string;
    semester?: number;
    startDate?: string;
    endDate?: string;
    shift?: string;
  }): Promise<AttendanceRegisterData> {
    const query = new URLSearchParams();
    query.set("subjectId", params.subjectId);
    if (params.semester) query.set("semester", params.semester.toString());
    if (params.startDate) query.set("startDate", params.startDate);
    if (params.endDate) query.set("endDate", params.endDate);
    if (params.shift) query.set("shift", params.shift);

    const res = await apiClient.get<any>(
      `/dashboard/teacher/attendance/register?${query.toString()}`
    );
    const data: AttendanceRegisterData = res.data ?? res;

    // Normalization: Ensure dates and attendanceMap are mapped
    const sessionDates = data.sessions?.map((s) => s.dateStr) || data.dates || [];
    const normalizedStudents = (data.students || []).map((st) => {
      const map: Record<string, "P" | "A" | "L" | "-"> = {};
      if (st.statuses) {
        Object.entries(st.statuses).forEach(([d, status]) => {
          map[d] = status === "PRESENT" ? "P" : "A";
        });
      }
      return {
        ...st,
        attendanceMap: st.attendanceMap || map,
      };
    });

    const totalStudents = normalizedStudents.length;
    const totalClassDays = sessionDates.length;
    const avgRate = totalStudents > 0
      ? Number(
          (
            normalizedStudents.reduce((sum, s) => sum + (s.percentage || 0), 0) /
            totalStudents
          ).toFixed(1)
        )
      : 0;

    return {
      ...data,
      dates: sessionDates,
      students: normalizedStudents,
      summary: data.summary || {
        totalStudents,
        totalClassDays,
        averageAttendanceRate: avgRate,
      },
    };
  },

  async downloadAttendanceRegisterPdf(params: {
    subjectId: string;
    semester?: number;
    startDate?: string;
    endDate?: string;
    shift?: string;
    subjectName?: string;
    filename?: string;
  }): Promise<void> {
    const query = new URLSearchParams();
    query.set("subjectId", params.subjectId);
    if (params.semester) query.set("semester", params.semester.toString());
    if (params.startDate) query.set("startDate", params.startDate);
    if (params.endDate) query.set("endDate", params.endDate);
    if (params.shift) query.set("shift", params.shift);
    query.set("download", "true");

    const endpoint = `/dashboard/teacher/attendance/register/pdf?${query.toString()}`;
    const cleanSub = (params.subjectName || "Subject").replace(/[^a-zA-Z0-9_\-]/g, "_");
    const fallbackFilename = params.filename || `${cleanSub}_Attendance_Register.pdf`;

    await downloadSecureFile(endpoint, fallbackFilename);
  },

  async downloadAttendanceRegisterExcel(params: {
    subjectId: string;
    semester?: number;
    startDate?: string;
    endDate?: string;
    shift?: string;
    subjectName?: string;
    filename?: string;
  }): Promise<void> {
    const query = new URLSearchParams();
    query.set("subjectId", params.subjectId);
    if (params.semester) query.set("semester", params.semester.toString());
    if (params.startDate) query.set("startDate", params.startDate);
    if (params.endDate) query.set("endDate", params.endDate);
    if (params.shift) query.set("shift", params.shift);

    const endpoint = `/dashboard/teacher/attendance/register/excel?${query.toString()}`;
    const cleanSub = (params.subjectName || "Subject").replace(/[^a-zA-Z0-9_\-]/g, "_");
    const fallbackFilename = params.filename || `${cleanSub}_Attendance_Register.xlsx`;

    await downloadSecureFile(endpoint, fallbackFilename);
  },
};
