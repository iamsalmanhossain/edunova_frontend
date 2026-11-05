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
