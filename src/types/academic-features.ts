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
