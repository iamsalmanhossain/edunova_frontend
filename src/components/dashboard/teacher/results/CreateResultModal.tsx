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

interface ResultEntryStudent {
  id: string;
  name: string;
  rollNo: string;
  registrationNo?: string | null;
  user?: {
    name: string;
  };
}

export default function CreateResultModal({
  isOpen,
  onClose,
  subjects: initialSubjects,
  currentShift,
  onResultCreated,
}: CreateResultModalProps) {
  const [semester, setSemester] = useState<number>(() => initialSubjects[0]?.semester || 4);
  const [availableSubjects, setAvailableSubjects] = useState<TeacherSubject[]>(initialSubjects);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [subjectId, setSubjectId] = useState<string>(() => initialSubjects[0]?.id || "");
  const [examName, setExamName] = useState<string>("");
  const [examType, setExamType] = useState<ExamType>("MID_TERM");
  const [totalMarks, setTotalMarks] = useState<number | string>(100);
  const [passMarks, setPassMarks] = useState<number | string>(40);
  const [publish, setPublish] = useState<boolean>(false);
  const [examRemarks, setExamRemarks] = useState<string>("");

  const [students, setStudents] = useState<ResultEntryStudent[]>([]);
  const [studentMarks, setStudentMarks] = useState<
    Record<string, { marks: number | string; remarks: string }>
  >({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sync available subjects when semester changes or on open
  useEffect(() => {
    let mounted = true;
    async function fetchSubjectsForSemester() {
      try {
        setLoadingSubjects(true);
        const res = await teacherService.getMarksSubjects(semester);
        if (mounted && res?.data && res.data.length > 0) {
          setAvailableSubjects(
            res.data.map((d) => ({
              id: d.id,
              name: d.name,
              code: d.code,
              semester: d.semester,
            }))
          );
          if (!res.data.some((s) => s.id === subjectId)) {
            setSubjectId(res.data[0].id);
          }
        } else if (mounted) {
          // Filter initialSubjects by semester if available
          const filtered = initialSubjects.filter((s) => s.semester === semester);
          if (filtered.length > 0) {
            setAvailableSubjects(filtered);
            if (!filtered.some((s) => s.id === subjectId)) {
              setSubjectId(filtered[0].id);
            }
          } else {
            setAvailableSubjects(initialSubjects);
          }
        }
      } catch {
        if (mounted) {
          const filtered = initialSubjects.filter((s) => s.semester === semester);
          setAvailableSubjects(filtered.length > 0 ? filtered : initialSubjects);
        }
      } finally {
        if (mounted) setLoadingSubjects(false);
      }
    }

    if (isOpen) {
      fetchSubjectsForSemester();
    }

    return () => {
      mounted = false;
    };
  }, [semester, isOpen, initialSubjects]);

  // Load students for the selected subject and semester
  useEffect(() => {
    let mounted = true;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(subjectId);
    if (!subjectId || !isUuid) {
      setStudents([]);
      return;
    }

    const activeSub = availableSubjects.find((s) => s.id === subjectId);
    const targetSemester = activeSub ? activeSub.semester : semester;

    async function loadStudents() {
      try {
        setLoadingStudents(true);
        setError(null);

        let list: ResultEntryStudent[] = [];

        // Step 2: Try GET /dashboard/teacher/marks/students first
        try {
          const marksRes = await teacherService.getMarksStudents({
            semester: targetSemester,
            shift: currentShift,
            subjectId,
          });
          if (marksRes?.students && marksRes.students.length > 0) {
            list = marksRes.students.map((s) => ({
              id: s.studentId,
              name: s.name,
              rollNo: s.rollNo,
              registrationNo: s.registrationNo || undefined,
            }));
          }
        } catch {
          // Fallback to attendance students
        }

        if (list.length === 0) {
          const res = await teacherService.getEligibleAttendanceStudents(
            subjectId,
            targetSemester
          );
          list = (res.students || []).map((s) => ({
            id: s.id,
            name: s.user?.name || "Student",
            rollNo: s.rollNo,
            registrationNo: s.registrationNo,
            user: s.user,
          }));
        }

        if (mounted) {
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
        if (mounted) {
          const msg = err instanceof Error ? err.message : "Failed to load students";
          setError(msg);
          setLoadingStudents(false);
        }
      }
    }

    loadStudents();
    return () => {
      mounted = false;
    };
  }, [subjectId, semester, currentShift, availableSubjects]);

  if (!isOpen) return null;

  const handleSubjectChange = (id: string) => {
    setSubjectId(id);
    const sub = availableSubjects.find((s) => s.id === id);
    if (sub && sub.semester !== semester) {
      setSemester(sub.semester);
    }
  };

  const handleMarkChange = (studentId: string, marks: number | string) => {
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
    const numTotal = Number(totalMarks);
    if (!numTotal || numTotal <= 0) {
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
      const rawNum = typeof entry.marks === "number" ? entry.marks : parseFloat(String(entry.marks)) || 0;
      return {
        studentId: s.id,
        rollNo: s.rollNo,
        obtainedMarks: rawNum,
        remarks: entry.remarks.trim() || undefined,
      };
    });

    const invalidMark = marksPayload.find(
      (m) => m.obtainedMarks < 0 || m.obtainedMarks > numTotal
    );
    if (invalidMark) {
      setError(`All obtained marks must be between 0 and total marks (${numTotal}).`);
      return;
    }

    try {
      setSubmitting(true);
      await teacherService.submitResult({
        subjectId,
        examName: examName.trim(),
        examType,
        semester: Number(semester),
        shift: currentShift,
        totalMarks: numTotal,
        passMarks: passMarks !== "" && passMarks != null ? Number(passMarks) : undefined,
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
      let msg = err instanceof Error ? err.message : "Failed to create result. Please verify all fields.";
      for (const s of students) {
        if (msg.includes(s.id)) {
          msg = msg.replace(s.id, `"${s.name}" (Roll: ${s.rollNo})`);
        }
      }
      setError(msg);
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
                <Label className="text-xs font-bold text-[#0f1f17]">Semester *</Label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a4b32]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-[#0f1f17]">Course / Subject *</Label>
                  {loadingSubjects && <span className="text-[10px] text-[#0a4b32] animate-pulse">Loading...</span>}
                </div>
                <select
                  value={subjectId}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  required
                  className="mt-1 w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a4b32]"
                >
                  <option value="">-- Select Subject --</option>
                  {availableSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code ? `${s.code} - ${s.name} (Sem ${s.semester})` : s.name}
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
                <Label className="text-xs font-bold text-[#0f1f17]">Total Marks *</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="100"
                  value={totalMarks}
                  onFocus={(e) => {
                    if (e.target.value === "0") setTotalMarks("");
                  }}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      setTotalMarks("");
                    } else {
                      const clean = raw.length > 1 && raw.startsWith("0") ? raw.replace(/^0+/, "") : raw;
                      setTotalMarks(clean);
                    }
                  }}
                  onBlur={() => {
                    if (totalMarks === "" || Number(totalMarks) < 1) {
                      setTotalMarks(100);
                    }
                  }}
                  required
                  className="mt-1 text-xs font-semibold"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#0f1f17]">Pass Marks</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="40"
                  value={passMarks}
                  onFocus={(e) => {
                    if (e.target.value === "0") setPassMarks("");
                  }}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      setPassMarks("");
                    } else {
                      const clean = raw.length > 1 && raw.startsWith("0") && !raw.startsWith("0.") ? raw.replace(/^0+/, "") : raw;
                      setPassMarks(clean);
                    }
                  }}
                  onBlur={() => {
                    if (passMarks === "") setPassMarks(0);
                  }}
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
                      const numericMark = typeof entry.marks === "number" ? entry.marks : parseFloat(String(entry.marks)) || 0;
                      const numTotal = Number(totalMarks) || 100;
                      const pct = numTotal > 0 ? ((numericMark / numTotal) * 100).toFixed(0) : "0";
                      return (
                        <tr key={student.id} className="hover:bg-[#f9fbfa]">
                          <td className="py-2 px-3 font-bold text-[#0f1f17]">{student.rollNo}</td>
                          <td className="py-2 px-3 text-[#5a6b62]">{student.name || student.user?.name || "Student"}</td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              step="any"
                              min="0"
                              max={numTotal}
                              placeholder="0"
                              value={entry.marks === 0 ? "0" : entry.marks}
                              onFocus={(e) => {
                                if (e.target.value === "0") {
                                  handleMarkChange(student.id, "");
                                }
                              }}
                              onChange={(e) => {
                                const raw = e.target.value;
                                if (raw === "") {
                                  handleMarkChange(student.id, "");
                                } else {
                                  const clean = raw.length > 1 && raw.startsWith("0") && !raw.startsWith("0.")
                                    ? raw.replace(/^0+/, "")
                                    : raw;
                                  handleMarkChange(student.id, clean);
                                }
                              }}
                              onBlur={(e) => {
                                if (e.target.value === "") {
                                  handleMarkChange(student.id, 0);
                                }
                              }}
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
