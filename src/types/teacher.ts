export interface TeacherUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  instituteId: string;
  departmentId?: string | null;
  shift?: "FIRST_SHIFT" | "SECOND_SHIFT" | null;
  designation?: string | null;
  qualification?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  bloodGroup?: string | null;
  bio?: string | null;
  approvalStatus?: string;
  user: TeacherUser;
  department?: {
    id: string;
    name: string;
    code: string;
  } | null;
  institute?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface TeacherResponse {
  success: boolean;
  data: TeacherProfile[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TeacherScope {
  instituteId: string;
  instituteName?: string;
  departmentId: string;
  departmentName?: string;
  shift: "FIRST_SHIFT" | "SECOND_SHIFT";
}

export interface TeacherOverviewProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  designation?: string | null;
  qualification?: string | null;
  bio?: string | null;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  shift: "FIRST_SHIFT" | "SECOND_SHIFT";
  institute?: {
    id: string;
    name: string;
    code?: string;
  } | null;
  department?: {
    id: string;
    name: string;
    code?: string;
  } | null;
}

export interface TeacherDashboardOverviewData {
  profile: TeacherOverviewProfile;
  scope: TeacherScope;
  overview: {
    totalStudents: number;
    assignedClasses: number;
    todaysClasses: Array<{
      time: string;
      subject: string;
      semester: string;
      department: string;
      room: string;
      studentsCount: number;
    }>;
    upcomingClasses: unknown[];
    pendingAssignmentEvaluations: number;
    pendingTasks: {
      pendingEvaluations: number;
      pendingAttendanceCount: number;
      hasPendingProfileApproval: boolean;
    };
  };
}

export interface TeacherStudentItem {
  id: string; // studentProfileId
  rollNo: string;
  registrationNo?: string | null;
  semester: number;
  shift: "FIRST_SHIFT" | "SECOND_SHIFT";
  session?: string | null;
  gender?: string | null;
  bloodGroup?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  address?: string | null;
  createdAt?: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
    status: string;
  };
  department?: {
    id: string;
    name: string;
    code?: string;
  };
  institute?: {
    id: string;
    name: string;
    code?: string;
  };
}

export interface QueryTeacherStudentsParams {
  semester?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TeacherStudentsResponse {
  data: TeacherStudentItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    scope: TeacherScope;
  };
}

export interface TeacherSubject {
  id: string;
  name: string;
  code: string;
  semester: number;
  credit?: string | number;
  departmentId?: string;
}

export interface AttendanceEligibleStudent {
  id: string; // studentProfileId used as studentId in records
  userId: string;
  instituteId: string;
  departmentId: string;
  rollNo: string;
  registrationNo?: string | null;
  semester: number;
  shift: "FIRST_SHIFT" | "SECOND_SHIFT";
  session?: string | null;
  isClaimed?: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
  };
}

export interface EligibleAttendanceResponse {
  subject: {
    id: string;
    name: string;
    code: string;
    semester: number;
  };
  semester: number;
  shift: "FIRST_SHIFT" | "SECOND_SHIFT";
  students: AttendanceEligibleStudent[];
  totalEligible: number;
}

export interface AttendanceRecordItem {
  studentId: string;
  status: "PRESENT" | "ABSENT";
  remarks?: string;
}

export interface CreateAttendanceSessionPayload {
  subjectId: string;
  semester: number;
  date: string; // YYYY-MM-DD
  type?: "THEORY" | "PRACTICAL" | "LAB";
  remarks?: string;
  records: AttendanceRecordItem[];
}

export interface AttendanceSessionHistoryItem {
  id: string;
  date: string;
  type: "THEORY" | "PRACTICAL";
  semester: number;
  shift: "FIRST_SHIFT" | "SECOND_SHIFT";
  status: "FINALIZED" | "PENDING";
  remarks?: string | null;
  createdAt: string;
  presentCount?: number;
  totalCount?: number;
  subject: {
    id: string;
    name: string;
    code: string;
    semester: number;
  };
  teacher?: {
    id: string;
    designation?: string | null;
    user: {
      id: string;
      name: string;
    };
  };
  _count: {
    records: number;
  };
}

export interface AttendanceSessionDetailRecord {
  id: string;
  status: "PRESENT" | "ABSENT";
  remarks?: string | null;
  student: {
    id: string;
    rollNo: string;
    registrationNo?: string | null;
    semester: number;
    shift: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
    };
  };
}

export interface AttendanceSessionDetailData {
  session: {
    id: string;
    date: string;
    type: "THEORY" | "PRACTICAL";
    semester: number;
    shift: "FIRST_SHIFT" | "SECOND_SHIFT";
    status: string;
    remarks?: string | null;
    createdAt: string;
    subject: {
      id: string;
      name: string;
      code: string;
      semester: number;
    };
    teacher?: {
      id: string;
      designation?: string | null;
      user: {
        id: string;
        name: string;
        email: string;
      };
    };
    records: AttendanceSessionDetailRecord[];
  };
  summary: {
    total: number;
    presentCount: number;
    absentCount: number;
    attendanceRate: number;
  };
}

export interface SubjectAttendanceStat {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  theorySessionsHeld: number;
  practicalSessionsHeld: number;
  totalSessionsHeld: number;
  averageAttendanceRate: number;
}

export interface TeacherAttendanceStatsData {
  scope: TeacherScope;
  subjects: SubjectAttendanceStat[];
}

export interface PreEnrollStudentItem {
  name: string;
  rollNo: string;
  registrationNo?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  guardianName?: string;
  guardianPhone?: string;
}

export interface PreEnrollStudentsPayload {
  semester: number;
  session?: string;
  students: PreEnrollStudentItem[];
}

export type ExamType =
  | "CLASS_TEST"
  | "MID_TERM"
  | "FINAL"
  | "QUIZ"
  | "ASSIGNMENT"
  | "LAB";

export type ResultPublicationStatus = "DRAFT" | "PUBLISHED";

export interface StudentMarkEntry {
  studentId: string;
  obtainedMarks: number;
  remarks?: string;
}

export interface SubmitResultPayload {
  subjectId: string;
  examName: string;
  examType?: ExamType;
  semester: number;
  session?: string;
  shift?: "FIRST_SHIFT" | "SECOND_SHIFT";
  totalMarks: number;
  passMarks?: number;
  publish?: boolean;
  remarks?: string;
  marks: StudentMarkEntry[];
}

export interface BulkSubmitResultsPayload {
  results: SubmitResultPayload[];
}

export interface QueryResultsParams {
  semester?: number;
  subjectId?: string;
  session?: string;
  shift?: "FIRST_SHIFT" | "SECOND_SHIFT";
  status?: ResultPublicationStatus;
  examType?: ExamType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TeacherResultListItem {
  id: string;
  name: string;
  examType: ExamType;
  semester: number;
  session: string;
  shift: "FIRST_SHIFT" | "SECOND_SHIFT";
  totalMarks: number;
  passMarks?: number;
  status: ResultPublicationStatus;
  publishedAt?: string | null;
  createdAt: string;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  department?: {
    id: string;
    name: string;
    code: string;
  };
  stats?: {
    totalEligibleStudents?: number;
    marksEnteredCount?: number;
    pendingMarksCount?: number;
    averageMarks?: number;
    highestMarks?: number;
    lowestMarks?: number;
    passRate?: number;
  };
}

export interface TeacherResultDetailStudent {
  studentId: string;
  userId: string;
  name: string;
  rollNo: string;
  registrationNo?: string | null;
  semester: number;
  shift: "FIRST_SHIFT" | "SECOND_SHIFT";
  session?: string | null;
  marksEntry: {
    id: string;
    obtainedMarks: number;
    totalMarks: number;
    percentage: number;
    grade: string;
    gradePoint: number;
    remarks?: string | null;
    status: string;
    updatedAt: string;
  } | null;
}

export interface TeacherResultDetailData {
  exam: {
    id: string;
    name: string;
    examType: ExamType;
    totalMarks: number;
    passMarks?: number;
    semester: number;
    shift: "FIRST_SHIFT" | "SECOND_SHIFT";
    session: string;
    status: ResultPublicationStatus;
    publishedAt?: string | null;
    subject: {
      id: string;
      name: string;
      code: string;
    };
    department: {
      id: string;
      name: string;
      code: string;
    };
    institute: {
      id: string;
      name: string;
      code: string;
    };
  };
  stats: {
    totalEligibleStudents: number;
    marksEnteredCount: number;
    pendingMarksCount: number;
  };
  students: TeacherResultDetailStudent[];
}

export interface UpdateSingleMarkPayload {
  obtainedMarks: number;
  remarks?: string;
}

export interface MarksSubjectItem {
  id: string;
  name: string;
  code: string;
  semester: number;
  credit?: number;
}

export interface MarksStudentItem {
  studentId: string;
  rollNo: string;
  registrationNo?: string | null;
  name: string;
  semester: number;
  shift?: string;
  session?: string;
}

export interface PasteJsonPayload {
  rawJson?: string;
  subjectId?: string;
  examName?: string;
  examType?: ExamType;
  semester?: number;
  session?: string;
  shift?: "FIRST_SHIFT" | "SECOND_SHIFT" | "FIRST" | "SECOND";
  totalMarks?: number;
  passMarks?: number;
  publish?: boolean;
  remarks?: string;
  marks?: Array<{
    rollNo?: string;
    studentId?: string;
    obtainedMarks: number;
    remarks?: string;
  }>;
  [key: string]: unknown;
}

export interface ResultGuideData {
  title: string;
  version: string;
  description: string;
  lastUpdated: string;
  updatedBy: string;
  markdownDocumentation?: string | null;
  workflow: Array<{
    step: number;
    title: string;
    description: string;
    endpoint?: string;
  }>;
  instructions: string[];
  customNotes?: string | null;
  supportedMethods: Array<{
    method: string;
    endpoint: string;
    name: string;
    description: string;
  }>;
  examples: {
    recommendedCopyPasteUsingRollNo?: Record<string, unknown>;
    midtermExamWithPassMarks?: Record<string, unknown>;
    usingStudentUuid?: Record<string, unknown>;
    bulkMultipleExamsSubmit?: Array<Record<string, unknown>>;
    excelCsvFormat?: {
      headers: string[];
      sampleRows?: Array<Record<string, unknown>>;
      explanation?: string;
    };
    textareaWrapperExample?: Record<string, unknown>;
    [key: string]: unknown;
  };
  gradingScale: Array<{
    marksPercentage: string;
    grade: string;
    gradePoint: number;
    remarks?: string;
  }>;
  rules: string[];
}

