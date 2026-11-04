export interface StudentScopeDepartment {
  id: string;
  name: string;
  code: string;
}

export interface StudentScopeInstitute {
  id: string;
  name: string;
  code?: string;
  address?: string | null;
}

export interface StudentScopeInfo {
  id: string;
  userId?: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string | null;
  rollNo: string;
  registrationNo: string;
  semester: number;
  shift: string;
  session?: string | null;
  department?: StudentScopeDepartment | null;
  institute?: StudentScopeInstitute | null;
}

export interface StudentAttendanceMetrics {
  totalClassesHeld: number;
  totalPresent: number;
  totalAbsent: number;
  attendancePercentage: number;
}

export interface StudentAcademicMetrics {
  totalEnrolledSubjects: number;
  publishedResultsCount: number;
  passedCount: number;
  failedCount: number;
  gpa: number;
}

export interface StudentEnrolledSubject {
  id: string;
  name: string;
  code: string;
  credit: number;
}

export interface StudentRecentResult {
  markId: string;
  examId: string;
  examName: string;
  examType: string;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  grade: string;
  gradePoint: number;
  obtainedMarks: number;
  totalMarks: number;
  publishedAt: string;
}

export interface StudentRecentAttendance {
  id: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  date: string;
  sessionType: 'THEORY' | 'PRACTICAL';
  subject: {
    id: string;
    name: string;
    code: string;
  };
}

export interface StudentDashboardOverviewData {
  student: StudentScopeInfo;
  metrics: {
    attendance: StudentAttendanceMetrics;
    academics: StudentAcademicMetrics;
  };
  enrolledSubjects: StudentEnrolledSubject[];
  recentResults: StudentRecentResult[];
  recentAttendance: StudentRecentAttendance[];
}

export interface AttendanceTypeBreakdown {
  classesHeld: number;
  present: number;
  absent: number;
  percentage: number;
}

export interface StudentSubjectAttendanceItem {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  credit: number;
  totalClassesHeld: number;
  presentClasses: number;
  absentClasses: number;
  attendancePercentage: number;
  breakdown: {
    theory: AttendanceTypeBreakdown;
    practical: AttendanceTypeBreakdown;
  };
}

export interface StudentAttendanceStatsData {
  message?: string;
  student?: StudentScopeInfo;
  summary?: StudentAttendanceMetrics & { overallPercentage: number };
  overallPercentage?: number;
  subjects: StudentSubjectAttendanceItem[];
}

export interface StudentAttendanceHistorySessionTeacher {
  designation?: string | null;
  user?: {
    name: string;
  };
}

export interface StudentAttendanceHistorySession {
  id: string;
  date: string;
  type: 'THEORY' | 'PRACTICAL';
  semester: number;
  shift: string;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  teacher?: StudentAttendanceHistorySessionTeacher | null;
}

export interface StudentAttendanceHistoryItem {
  id: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string | null;
  createdAt: string;
  session: StudentAttendanceHistorySession;
}

export interface StudentAttendanceHistoryResponse {
  data: StudentAttendanceHistoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QueryStudentAttendanceParams {
  subjectId?: string;
  type?: 'ALL' | 'THEORY' | 'PRACTICAL' | 'LAB';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface StudentResultsStats {
  totalSubjects: number;
  passedCount: number;
  failedCount: number;
  gpa: number;
}

export interface StudentPublishedResultItem {
  markId: string;
  examId: string;
  examName: string;
  examType: string;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  semester: number;
  shift: string;
  session?: string | null;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  gradePoint: number;
  remarks?: string | null;
  publishedAt?: string | null;
  teacherName?: string;
}

export interface StudentResultsResponse {
  message?: string;
  student: StudentScopeInfo;
  stats: StudentResultsStats | null;
  results: StudentPublishedResultItem[];
}

export interface StudentExamDetailData {
  markId: string;
  examId: string;
  examName: string;
  examType: string;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  department?: {
    id: string;
    name: string;
  };
  semester: number;
  shift: string;
  session?: string | null;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  gradePoint: number;
  remarks?: string | null;
  publishedAt?: string | null;
  teacherName?: string;
}

export interface QueryStudentResultsParams {
  semester?: number;
  session?: string;
  subjectId?: string;
  examType?: string;
}

