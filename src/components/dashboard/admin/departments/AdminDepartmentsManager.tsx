"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AuthUser } from "@/types/auth";
import { MasterDepartment, MasterSubject } from "@/types/admin";
import { adminService } from "@/services/admin.service";
import AdminDepartmentsSkeleton from "@/components/dashboard/skeletons/AdminDepartmentsSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  BookOpen,
  Plus,
  Loader2,
  RefreshCw,
  X,
  CheckCircle2,
  Trash2,
} from "lucide-react";

interface AdminDepartmentsManagerProps {
  user: AuthUser;
}

export default function AdminDepartmentsManager({ user }: AdminDepartmentsManagerProps) {
  const [departments, setDepartments] = useState<MasterDepartment[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [subjects, setSubjects] = useState<MasterSubject[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Modals
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [savingDept, setSavingDept] = useState(false);

  const [isSubjModalOpen, setIsSubjModalOpen] = useState(false);
  const [subjName, setSubjName] = useState("");
  const [subjCode, setSubjCode] = useState("");
  const [subjSemester, setSubjSemester] = useState(1);
  const [subjCredit, setSubjCredit] = useState(3);
  const [savingSubj, setSavingSubj] = useState(false);

  // 1. Load Departments
  const loadDepartments = useCallback(async () => {
    try {
      setLoadingDepts(true);
      const res = await adminService.getDepartments(user.instituteId);
      setDepartments(res || []);
      if (res && res.length > 0 && !selectedDeptId) {
        setSelectedDeptId(res[0].id);
      }
    } catch (err: unknown) {
      console.error("Error loading departments:", err);
    } finally {
      setLoadingDepts(false);
    }
  }, [user.instituteId, selectedDeptId]);

  // 2. Load Subjects for selected department & optional semester filter
  const loadSubjects = useCallback(async (deptId: string, sem?: string) => {
    if (!deptId) return;
    try {
      setLoadingSubjects(true);
      const semNum = sem ? Number(sem) : undefined;
      const res = await adminService.getSubjects(deptId, semNum);
      setSubjects(Array.isArray(res) ? res : []);
    } catch (err: unknown) {
      console.error("Error loading subjects:", err);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  useEffect(() => {
    if (selectedDeptId) {
      loadSubjects(selectedDeptId, selectedSemester);
    }
  }, [selectedDeptId, selectedSemester, loadSubjects]);

  const handleCreateDepartment = async () => {
    if (!deptName.trim() || !deptCode.trim()) {
      alert("Please provide department name and code.");
      return;
    }
    try {
      setSavingDept(true);
      const newDept = await adminService.createDepartment({
        name: deptName.trim(),
        code: deptCode.trim().toUpperCase(),
      });
      if (user.instituteId) {
        await adminService.assignDepartmentToInstitute(user.instituteId, newDept.id);
      }
      setIsDeptModalOpen(false);
      setDeptName("");
      setDeptCode("");
      await loadDepartments();
      setSelectedDeptId(newDept.id);
    } catch (err: unknown) {
      alert("Failed to create department: " + (err instanceof Error ? err.message : "Error"));
    } finally {
      setSavingDept(false);
    }
  };

  const handleCreateSubject = async () => {
    if (!subjName.trim() || !subjCode.trim() || !selectedDeptId) {
      alert("Please provide subject name and code.");
      return;
    }
    try {
      setSavingSubj(true);
      await adminService.createSubject({
        name: subjName.trim(),
        code: subjCode.trim(),
        semester: Number(subjSemester),
        credit: Number(subjCredit),
        departmentId: selectedDeptId,
      });
      setIsSubjModalOpen(false);
      setSubjName("");
      setSubjCode("");
      setSubjSemester(1);
      setSubjCredit(3);
      await loadSubjects(selectedDeptId, selectedSemester);
    } catch (err: unknown) {
      alert("Failed to create subject: " + (err instanceof Error ? err.message : "Error"));
    } finally {
      setSavingSubj(false);
    }
  };

  const handleDeleteSubject = async (subjId: string, name: string) => {
    if (!confirm(`Delete subject "${name}"?`)) return;
    try {
      await adminService.deleteSubject(subjId);
      await loadSubjects(selectedDeptId, selectedSemester);
    } catch (err: unknown) {
      alert("Failed to delete subject: " + (err instanceof Error ? err.message : "Error"));
    }
  };

  if (loadingDepts && departments.length === 0) {
    return <AdminDepartmentsSkeleton />;
  }

  const activeDepartment = departments.find((d) => d.id === selectedDeptId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0a4b32]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#0f1f17]">
              Academic Departments &amp; Subjects
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#5a6b62] mt-1">
            Configure institute faculties, BTEB diploma curricula, and subject credit structures
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsDeptModalOpen(true)}
            className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-9 font-bold px-3"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Department
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadDepartments();
              if (selectedDeptId) loadSubjects(selectedDeptId);
            }}
            className="h-9 px-3 rounded-xl border-[#e2e8e4] text-xs font-semibold text-[#0a4b32]"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Main 2-Column: Departments List & Selected Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Department Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#0f1f17]">
            Active Departments ({departments.length})
          </h3>
          <div className="space-y-2.5">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedDeptId === dept.id
                    ? "bg-[#0a4b32] text-white border-[#0a4b32] shadow-sm"
                    : "bg-white text-[#0f1f17] border-[#e2e8e4] hover:border-[#0a4b32]/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge
                    variant="outline"
                    className={`font-mono text-xs ${
                      selectedDeptId === dept.id
                        ? "bg-white/10 text-white border-white/20"
                        : "bg-[#f0f4f1] text-[#0a4b32] border-[#e2e8e4]"
                    }`}
                  >
                    {dept.code}
                  </Badge>
                  <Building2 className={`w-4 h-4 ${selectedDeptId === dept.id ? "text-white/80" : "text-[#5a6b62]"}`} />
                </div>
                <h4 className="font-bold text-sm line-clamp-1">{dept.name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Subjects Management for Selected Department */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-[#e2e8e4] shadow-xs">
            <CardHeader className="p-4 sm:p-5 border-b border-[#e2e8e4]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-[#0f1f17] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#0a4b32]" />
                  {activeDepartment ? `${activeDepartment.name} (${activeDepartment.code})` : "Department"} Curriculum Subjects
                </CardTitle>
                <p className="text-xs text-[#5a6b62]">
                  Registered courses across semesters for this department ({subjects.length} courses)
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Semester Filter */}
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="h-8 px-2.5 text-xs font-semibold rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s.toString()}>
                      Semester {s}
                    </option>
                  ))}
                </select>

                <Button
                  size="sm"
                  onClick={() => setIsSubjModalOpen(true)}
                  disabled={!selectedDeptId}
                  className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-8 font-bold px-3 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Subject
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loadingSubjects ? (
                <div className="p-8 text-center text-[#5a6b62]">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0a4b32] mb-2" />
                  <p className="text-xs">Loading curriculum subjects...</p>
                </div>
              ) : subjects.length === 0 ? (
                <div className="p-12 text-center text-[#5a6b62]">
                  <BookOpen className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-semibold">No subjects registered yet</p>
                  <p className="text-xs mt-1">Click &quot;Add Subject&quot; above to create curriculum courses.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#fcfdfc] text-xs font-semibold text-[#5a6b62] border-b border-[#e2e8e4]">
                      <tr>
                        <th className="py-3 px-4">Subject Name</th>
                        <th className="py-3 px-4">Subject Code</th>
                        <th className="py-3 px-4">Semester</th>
                        <th className="py-3 px-4">Credit Hours</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f4f1] text-[#0f1f17]">
                      {subjects.map((s) => (
                        <tr key={s.id} className="hover:bg-[#fcfdfc] transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#0f1f17]">
                            {s.name}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-[#0a4b32] font-bold">
                            {s.code}
                          </td>
                          <td className="py-3.5 px-4 text-xs">
                            <Badge variant="outline" className="bg-[#f0f4f1] border-[#e2e8e4]">
                              Semester {s.semester}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-semibold text-[#5a6b62]">
                            {s.credit} Credits
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSubject(s.id, s.name)}
                              className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Department Modal */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#dce3df] shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0f4f1]">
              <h3 className="text-base font-bold text-[#0f1f17] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0a4b32]" />
                Create Academic Department
              </h3>
              <button
                onClick={() => setIsDeptModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g. Computer Science & Technology"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                  Department Code *
                </label>
                <input
                  type="text"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  placeholder="e.g. CST"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32] uppercase"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0f4f1]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeptModalOpen(false)}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={savingDept || !deptName.trim() || !deptCode.trim()}
                onClick={handleCreateDepartment}
                className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-9 px-4 font-bold"
              >
                {savingDept ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Save Department
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {isSubjModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#dce3df] shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0f4f1]">
              <h3 className="text-base font-bold text-[#0f1f17] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#0a4b32]" />
                Add Curriculum Subject
              </h3>
              <button
                onClick={() => setIsSubjModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={subjName}
                  onChange={(e) => setSubjName(e.target.value)}
                  placeholder="e.g. Data Communication"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                  BTEB Subject Code *
                </label>
                <input
                  type="text"
                  value={subjCode}
                  onChange={(e) => setSubjCode(e.target.value)}
                  placeholder="e.g. 66643"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                    Semester *
                  </label>
                  <select
                    value={subjSemester}
                    onChange={(e) => setSubjSemester(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                    Credit Hours *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={subjCredit}
                    onChange={(e) => setSubjCredit(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0f4f1]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSubjModalOpen(false)}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={savingSubj || !subjName.trim() || !subjCode.trim()}
                onClick={handleCreateSubject}
                className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-9 px-4 font-bold"
              >
                {savingSubj ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Save Subject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
