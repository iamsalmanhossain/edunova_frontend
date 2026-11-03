"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TeacherSubject, ExamType, AttendanceEligibleStudent } from "@/types/teacher";
import { teacherService } from "@/services/teacher.service";

interface CreateResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: TeacherSubject[];
  currentShift: "FIRST_SHIFT" | "SECOND_SHIFT";
  onResultCreated: () => void;
}

export default function CreateResultModal({
  isOpen,
  onClose,
  subjects,
  currentShift,
  onResultCreated,
}: CreateResultModalProps) {
  const [subjectId, setSubjectId] = useState<string>(() => subjects[0]?.id || "");
  const [examName, setExamName] = useState<string>("");
  const [examType, setExamType] = useState<ExamType>("MID_TERM");
  const [semester, setSemester] = useState<number>(() => subjects[0]?.semester || 1);
  const [session, setSession] = useState<string>("2024-25");
  const [totalMarks, setTotalMarks] = useState<number>(100);
  const [passMarks, setPassMarks] = useState<number>(40);
  const [publish, setPublish] = useState<boolean>(false);
  const [examRemarks, setExamRemarks] = useState<string>("");

  const [students, setStudents] = useState<AttendanceEligibleStudent[]>([]);
  const [studentMarks, setStudentMarks] = useState<
    Record<string, { marks: number; remarks: string }>
  >({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load students for the selected subject
  useEffect(() => {
    let mounted = true;
    if (!subjectId || subjectId.trim() === "") return;

    async function loadStudents() {
      try {
        const res = await teacherService.getEligibleAttendanceStudents(
          subjectId,
          semester
        );
        if (mounted) {
          const list = res.students || [];
          setStudents(list);

          // Initialize mark records
          const initialMarks: Record<string, { marks: number; remarks: string }> = {};
          list.forEach((s) => {
            initialMarks[s.id] = { marks: 0, remarks: "" };
          });
          setStudentMarks(initialMarks);
          setLoadingStudents(false);
        }
      } catch (err: unknown) {
        console.error("Failed to load students:", err);
        if (mounted) setLoadingStudents(false);
      }
    }

    loadStudents();
    return () => {
      mounted = false;
    };
  }, [subjectId, semester, currentShift]);

  if (!isOpen) return null;

  const handleSubjectChange = (id: string) => {
    setSubjectId(id);
    const sub = subjects.find((s) => s.id === id);
    if (sub) {
      setSemester(sub.semester);
    }
  };

  const handleMarkChange = (studentId: string, marks: number) => {
    setStudentMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { remarks: "" }),
        marks,
      },
    }));
  };

  const handleStudentRemarksChange = (studentId: string, studentRemarks: string) => {
    setStudentMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { marks: 0 }),
        remarks: studentRemarks,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!subjectId) {
      setError("Please select a course/subject.");
      return;
    }
    if (!examName.trim()) {
      setError("Please provide an Exam Title.");
      return;
    }
    if (totalMarks <= 0) {
      setError("Total marks must be greater than 0.");
      return;
    }
    if (students.length === 0) {
      setError("No students found for this subject and semester.");
      return;
    }

    // Validate student marks
    const marksPayload = students.map((s) => {
      const entry = studentMarks[s.id] || { marks: 0, remarks: "" };
      return {
        studentId: s.id,
        obtainedMarks: Number(entry.marks),
        remarks: entry.remarks.trim() || undefined,
      };
    });

    const invalidMark = marksPayload.find(
      (m) => m.obtainedMarks < 0 || m.obtainedMarks > totalMarks
    );
    if (invalidMark) {
      setError(`All obtained marks must be between 0 and total marks (${totalMarks}).`);
      return;
    }

    try {
      setSubmitting(true);
      await teacherService.submitResult({
        subjectId,
        examName: examName.trim(),
        examType,
        semester: Number(semester),
        session: session.trim(),
        shift: currentShift,
        totalMarks: Number(totalMarks),
        passMarks: passMarks ? Number(passMarks) : undefined,
        publish,
        remarks: examRemarks.trim() || undefined,
        marks: marksPayload,
      });

      setSuccess("Exam results created and marks saved successfully!");
      onResultCreated();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Failed to create result. Please verify all fields.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] shadow-2xl border border-[#dce3df] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#f0f4f1] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0f1f17]">Enter Class Exam Results</h2>
              <p className="text-xs text-[#5a6b62]">
                Create new exam marksheet and record marks for all enrolled students
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#f0f4f1] hover:bg-[#e4ece7] text-[#0f1f17] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Exam Details Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#0a4b32] uppercase tracking-wider">
              Exam Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <Label className="text-xs font-bold text-[#0f1f17]">Course / Subject *</Label>
                <select
                  value={subjectId}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  required
                  className="mt-1 w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a4b32]"
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name} (Sem {s.semester})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-bold text-[#0f1f17]">Exam Title *</Label>
                <Input
                  placeholder="e.g. Midterm Examination 2024"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  required
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#0f1f17]">Exam Type *</Label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as ExamType)}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a4b32]"
                >
                  <option value="MID_TERM">Midterm</option>
                  <option value="CLASS_TEST">Class Test</option>
                  <option value="FINAL">Final</option>
                  <option value="QUIZ">Quiz</option>
                  <option value="ASSIGNMENT">Assignment</option>
                  <option value="LAB">Practical / Lab</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-bold text-[#0f1f17]">Academic Session *</Label>
                <Input
                  placeholder="2024-25"
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  required
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#0f1f17]">Total Marks *</Label>
                <Input
                  type="number"
                  min="1"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  required
                  className="mt-1 text-xs font-semibold"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#0f1f17]">Pass Marks</Label>
                <Input
                  type="number"
                  min="0"
                  value={passMarks}
                  onChange={(e) => setPassMarks(Number(e.target.value))}
                  className="mt-1 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-xs font-bold text-[#0f1f17]">Exam Remarks (Optional)</Label>
                <Input
                  placeholder="e.g. Midterm exam covering modules 1 to 4"
                  value={examRemarks}
                  onChange={(e) => setExamRemarks(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Student Roster Marks Table */}
          <div className="space-y-3 pt-3 border-t border-[#f0f4f1]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#0a4b32] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#c48b28]" />
                Student Roster Marks Entry ({students.length})
              </h3>
              {loadingStudents && (
                <span className="text-[11px] text-[#5a6b62]">Loading enrolled students...</span>
              )}
            </div>

            {students.length === 0 && !loadingStudents ? (
              <div className="p-5 text-center bg-[#f4f7f5] rounded-xl border border-[#dce3df] text-xs text-[#5a6b62]">
                No enrolled students found for the selected subject and semester. Please verify student enrollment.
              </div>
            ) : (
              <div className="border border-[#e2e8e4] rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#f0f7f3] text-[#0f1f17] font-bold sticky top-0 border-b border-[#e2e8e4]">
                    <tr>
                      <th className="py-2.5 px-3 text-left">Roll No</th>
                      <th className="py-2.5 px-3 text-left">Student Name</th>
                      <th className="py-2.5 px-3 text-left w-32">Obtained Marks</th>
                      <th className="py-2.5 px-3 text-left w-20">Percentage</th>
                      <th className="py-2.5 px-3 text-left">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f4f1]">
                    {students.map((student) => {
                      const entry = studentMarks[student.id] || { marks: 0, remarks: "" };
                      const pct = totalMarks > 0 ? ((entry.marks / totalMarks) * 100).toFixed(0) : "0";
                      return (
                        <tr key={student.id} className="hover:bg-[#f9fbfa]">
                          <td className="py-2 px-3 font-bold text-[#0f1f17]">{student.rollNo}</td>
                          <td className="py-2 px-3 text-[#5a6b62]">{student.user?.name || "Student"}</td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              step="0.5"
                              min="0"
                              max={totalMarks}
                              value={entry.marks}
                              onChange={(e) =>
                                handleMarkChange(student.id, parseFloat(e.target.value) || 0)
                              }
                              className="h-8 text-xs font-semibold"
                            />
                          </td>
                          <td className="py-2 px-3 font-semibold text-[#0a4b32]">{pct}%</td>
                          <td className="py-2 px-3">
                            <Input
                              placeholder="Remarks (opt)"
                              value={entry.remarks}
                              onChange={(e) =>
                                handleStudentRemarksChange(student.id, e.target.value)
                              }
                              className="h-8 text-xs"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f4f7f5] border border-[#e2e8e4]">
            <div>
              <p className="text-xs font-bold text-[#0f1f17]">Publish Result Now</p>
              <p className="text-[11px] text-[#5a6b62]">
                Visible to enrolled students immediately on student portal
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0a4b32]" />
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#f0f4f1]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="h-9 px-4 text-xs font-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || students.length === 0}
              className="h-9 px-5 text-xs font-bold bg-[#0a4b32] hover:bg-[#073825] text-white cursor-pointer"
            >
              {submitting ? "Saving Results..." : "Submit Results"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
