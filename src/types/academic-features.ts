// TypeScript definitions for the 5 New Academic Features in Edunova

export interface MasterOverviewExam {
  examId: string;
  examName: string;
  examType: string;
  totalMarks: number;
}

export interface MasterOverviewStudentMark {
  obtainedMarks: number;
  percentage: number;
  grade: string;
}

export interface MasterOverviewStudentRow {
  sl: number;
  studentId: string;
  rollNo: string;
  studentName: string;
  // Theory Attendance
  theoryClassesHeld: number;
  theoryPresent: number;
  theoryAbsent: number;
  theoryAttdPct: number;
  // Practical Attendance
  practicalClassesHeld: number;
  practicalPresent: number;
  practicalAbsent: number;
  practicalAttdPct: number;
  // Combined Attendance
  totalClassesHeld: number;
  totalPresent: number;
  totalAbsent: number;
  attendancePercentage: number;
  examMarks: Record<string, MasterOverviewStudentMark>;
  totalMarksObtained: number;
  totalMaxMarks: number;
  overallPercentage: number;
  overallGrade: string;
  overallGradePoint: number;
  remarks: string;
}

export interface SubjectMasterOverviewData {
  instituteName: string;
  departmentName: string;
  semester: number;
  shift: string;
  subjectName: string;
  subjectCode: string;
  teacherName: string;
  theoryClassesHeld: number;
  practicalClassesHeld: number;
  totalClassesHeld: number;
  classAvgAttendance: number;
  classAvgMarksPct: number;
  exams: MasterOverviewExam[];
  students: MasterOverviewStudentRow[];
}

export interface CreateDiaryPayload {
  subjectId: string;
  semester: number;
  date: string;
  chapter?: string;
  topicsTaught: string;
  nextClassPlan?: string;
  classNoteUrl?: string;
  classNoteTitle?: string;
  hasExam?: boolean;
  examTitle?: string;
  examDate?: string;
  examType?: string;
  examSyllabus?: string;
}

export interface ClassDiaryEntry {
  id: string;
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  semester: number;
  shift: string;
  date?: string;
  entryDate?: string;
  chapter?: string;
  topicsTaught?: string;
  topicsCovered?: string;
  nextClassPlan?: string;
  classNoteUrl?: string;
  classNoteTitle?: string;
  notesUrl?: string;
  hasExam?: boolean;
  hasExamAnnouncement?: boolean;
  examTitle?: string;
  examDate?: string;
  examType?: string;
  examSyllabus?: string;
  syllabus?: string;
  teacherName?: string;
  createdAt?: string;
}

export interface ExamReminderItem {
  id: string;
  source?: string;
  subjectName: string;
  subjectCode: string;
  semester?: number;
  examTitle: string;
  examType: string;
  examDate: string;
  syllabus?: string;
  notesUrl?: string;
  teacherName?: string;
  daysRemaining: number;
  isUrgent: boolean;
  status?: "UPCOMING" | "PAST" | "TODAY";
}

export type GuideTargetRole = "TEACHER" | "STUDENT" | "ADMIN" | "ALL";

export interface PageGuideSection {
  id?: string;
  title: string;
  description: string;
  steps?: string[];
  tips?: string[];
  warning?: string;
}

export interface PageGuideFaq {
  question: string;
  answer: string;
}

export interface PageGuideSupportContact {
  email?: string;
  phone?: string;
  office?: string;
}

export interface PageGuideData {
  id?: string;
  pageKey: string;
  title: string;
  targetRole?: GuideTargetRole;
  badge?: string;
  summary?: string;
  subtitle?: string;
  sections: PageGuideSection[];
  quickFaq?: PageGuideFaq[];
  faqs?: PageGuideFaq[];
  supportContact?: PageGuideSupportContact;
  customizedByAdmin?: boolean;
  updatedAt?: string;
}

export interface CreatePageGuidePayload {
  pageKey: string;
  title: string;
  targetRole: GuideTargetRole;
  badge: string;
  summary: string;
  subtitle?: string;
  sections: PageGuideSection[];
  quickFaq?: PageGuideFaq[];
  faqs?: PageGuideFaq[];
  supportContact?: PageGuideSupportContact;
}

export interface UpdatePageGuidePayload {
  title?: string;
  targetRole?: GuideTargetRole;
  badge?: string;
  summary?: string;
  subtitle?: string;
  sections?: PageGuideSection[];
  quickFaq?: PageGuideFaq[];
  faqs?: PageGuideFaq[];
  supportContact?: PageGuideSupportContact;
}

export interface AttendanceRegisterSession {
  id: string;
  dateStr: string;
  type?: string;
}

export interface AttendanceRegisterStudent {
  studentId: string;
  rollNo: string;
  name: string;
  statuses?: Record<string, "PRESENT" | "ABSENT">;
  attendanceMap?: Record<string, "P" | "A" | "L" | "-">;
  totalPresent: number;
  totalAbsent: number;
  percentage: number;
}

export interface AttendanceRegisterData {
  instituteName: string;
  departmentName: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  shift: string;
  startDate?: string;
  endDate?: string;
  teacherName?: string;
  totalHeld?: number;
  sessions?: AttendanceRegisterSession[];
  dates?: string[];
  students: AttendanceRegisterStudent[];
  summary?: {
    totalStudents: number;
    totalClassDays: number;
    averageAttendanceRate: number;
  };
}

export interface StudentOverviewResponse {
  currentSemester: number;
  viewingSemester: number;
  isCurrentSemester: boolean;
  isFreshSemester: boolean;
  availableSemesters: number[];
  student: {
    name: string;
    rollNo: string;
    semester: number;
    shift: string;
  };
  metrics: {
    attendance: {
      totalClassesHeld: number;
      totalPresent: number;
      attendancePercentage: number;
    };
    academics: {
      totalEnrolledSubjects: number;
      publishedResultsCount: number;
      gpa: number;
    };
  };
  enrolledSubjects: any[];
  recentResults: any[];
  recentAttendance: any[];
}
