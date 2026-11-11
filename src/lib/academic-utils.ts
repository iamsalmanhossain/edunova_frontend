/**
 * Academic calculation and string formatting helpers for Bangladesh Technical Education Board (BTEB)
 * standard diploma curriculum.
 */

export interface GradeResult {
  letter: string;
  gradePoint: number;
  remarks: "Outstanding" | "Excellent" | "Very Good" | "Good" | "Satisfactory" | "Pass" | "Fail";
}

/**
 * Determine letter grade and grade point from achieved marks percentage
 * Follows official 4.00 CGPA grading scale
 */
export function calculateBtebGrade(pct: number): GradeResult {
  if (pct >= 80) {
    return { letter: "A+", gradePoint: 4.0, remarks: "Outstanding" };
  }
  if (pct >= 75) {
    return { letter: "A", gradePoint: 3.75, remarks: "Excellent" };
  }
  if (pct >= 70) {
    return { letter: "A-", gradePoint: 3.5, remarks: "Very Good" };
  }
  if (pct >= 65) {
    return { letter: "B+", gradePoint: 3.25, remarks: "Good" };
  }
  if (pct >= 60) {
    return { letter: "B", gradePoint: 3.0, remarks: "Good" };
  }
  if (pct >= 55) {
    return { letter: "B-", gradePoint: 2.75, remarks: "Satisfactory" };
  }
  if (pct >= 50) {
    return { letter: "C+", gradePoint: 2.5, remarks: "Satisfactory" };
  }
  if (pct >= 45) {
    return { letter: "C", gradePoint: 2.25, remarks: "Pass" };
  }
  if (pct >= 40) {
    return { letter: "D", gradePoint: 2.0, remarks: "Pass" };
  }
  return { letter: "F", gradePoint: 0.0, remarks: "Fail" };
}

/**
 * Format 6-digit roll number
 */
export function formatRollNo(roll: string | number): string {
  if (!roll) return "N/A";
  const str = String(roll).trim();
  return str.padStart(6, "0");
}

/**
 * Format attendance rate with safety check
 */
export function formatAttendancePercentage(present: number, total: number): string {
  if (!total || total <= 0) return "0.0%";
  const pct = Math.min(100, Math.max(0, (present / total) * 100));
  return `${pct.toFixed(1)}%`;
}

/**
 * Get semantic status color class based on attendance percentage
 */
export function getAttendanceStatusClass(pct: number): {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  label: string;
} {
  if (pct >= 85) {
    return {
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-700",
      badgeBorder: "border-emerald-200",
      label: "Excellent",
    };
  }
  if (pct >= 75) {
    return {
      badgeBg: "bg-teal-50",
      badgeText: "text-teal-700",
      badgeBorder: "border-teal-200",
      label: "Good",
    };
  }
  if (pct >= 60) {
    return {
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-700",
      badgeBorder: "border-amber-200",
      label: "Warning",
    };
  }
  return {
    badgeBg: "bg-red-50",
    badgeText: "text-red-700",
    badgeBorder: "border-red-200",
    label: "Critical",
  };
}
