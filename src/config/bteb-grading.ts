/**
 * Bangladesh Technical Education Board (BTEB) Diploma in Engineering
 * Official Academic Grading Scale Configuration & Semester Constants.
 */

export interface BtebGradeBand {
  minMarks: number;
  maxMarks: number;
  letterGrade: string;
  gradePoint: number;
  classification: string;
}

export const BTEB_GRADING_SCALE: readonly BtebGradeBand[] = [
  { minMarks: 80, maxMarks: 100, letterGrade: "A+", gradePoint: 4.0, classification: "Outstanding" },
  { minMarks: 75, maxMarks: 79, letterGrade: "A", gradePoint: 3.75, classification: "Excellent" },
  { minMarks: 70, maxMarks: 74, letterGrade: "A-", gradePoint: 3.5, classification: "Very Good" },
  { minMarks: 65, maxMarks: 69, letterGrade: "B+", gradePoint: 3.25, classification: "Good" },
  { minMarks: 60, maxMarks: 64, letterGrade: "B", gradePoint: 3.0, classification: "Above Average" },
  { minMarks: 55, maxMarks: 59, letterGrade: "B-", gradePoint: 2.75, classification: "Average" },
  { minMarks: 50, maxMarks: 54, letterGrade: "C+", gradePoint: 2.5, classification: "Below Average" },
  { minMarks: 45, maxMarks: 49, letterGrade: "C", gradePoint: 2.25, classification: "Pass" },
  { minMarks: 40, maxMarks: 44, letterGrade: "D", gradePoint: 2.0, classification: "Conditional Pass" },
  { minMarks: 0, maxMarks: 39, letterGrade: "F", gradePoint: 0.0, classification: "Fail" },
] as const;

export const DIPLOMA_SEMESTERS = [1, 2, 3, 4, 5, 6, 7] as const;

export const DIPLOMA_SEMESTER_LABELS: Record<number, string> = {
  1: "1st Semester",
  2: "2nd Semester",
  3: "3rd Semester",
  4: "4th Semester",
  5: "5th Semester",
  6: "6th Semester",
  7: "7th Semester",
};
