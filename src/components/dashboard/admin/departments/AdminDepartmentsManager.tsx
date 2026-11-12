"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AuthUser } from "@/types/auth";
import { MasterDepartment, MasterSubject } from "@/types/admin";
import { adminService } from "@/services/admin.service";
import { appToast } from "@/store/useToastStore";
import { appConfirm } from "@/store/useConfirmStore";
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
  FileCode,
  ListPlus,
  Sparkles,
  Layers,
  AlertCircle,
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
  const [subjModalMode, setSubjModalMode] = useState<"single" | "bulk_form" | "bulk_json">("single");

  // Single mode states
  const [subjName, setSubjName] = useState("");
  const [subjCode, setSubjCode] = useState("");
  const [subjSemester, setSubjSemester] = useState(1);
  const [subjCredit, setSubjCredit] = useState<number | string>(3);
  const [savingSubj, setSavingSubj] = useState(false);

  // Bulk Row Builder states
  interface BulkSubjectRow {
    id: string;
    name: string;
    code: string;
    semester: number;
    credit: number | string;
  }

  const createEmptyRow = (sem = 1): BulkSubjectRow => ({
    id: Math.random().toString(36).substring(2, 9),
    name: "",
    code: "",
    semester: sem,
    credit: 3,
  });

  const [bulkRows, setBulkRows] = useState<BulkSubjectRow[]>([
    createEmptyRow(1),
    createEmptyRow(1),
    createEmptyRow(1),
  ]);
  const [bulkDefaultSemester, setBulkDefaultSemester] = useState(1);

  // Bulk JSON states
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Bulk Progress state
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number } | null>(null);

  const resetSubjModal = () => {
    setSubjName("");
    setSubjCode("");
    setSubjSemester(1);
    setSubjCredit(3);
    setBulkRows([createEmptyRow(1), createEmptyRow(1), createEmptyRow(1)]);
    setJsonInput("");
    setJsonError(null);
    setBulkProgress(null);
  };

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
      appToast.warning("Please provide department name and code.", "Validation Error");
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
      appToast.success("Department created successfully!", "Department Created");
    } catch (err: unknown) {
      appToast.error("Failed to create department: " + (err instanceof Error ? err.message : "Error"), "Creation Failed");
    } finally {
      setSavingDept(false);
    }
  };

  const handleCreateSubject = async () => {
    if (!subjName.trim() || !subjCode.trim() || !selectedDeptId) {
      appToast.warning("Please provide subject name and code.", "Validation Error");
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
      resetSubjModal();
      await loadSubjects(selectedDeptId, selectedSemester);
      appToast.success("Subject created successfully!", "Subject Created");
    } catch (err: unknown) {
      appToast.error("Failed to create subject: " + (err instanceof Error ? err.message : "Error"), "Creation Failed");
    } finally {
      setSavingSubj(false);
    }
  };

  const handleCreateBulkSubjects = async (
    itemsToSave: Array<{
      name: string;
      code: string;
      semester: number;
      credit: number;
      departmentId: string;
    }>
  ) => {
    if (!itemsToSave.length) {
      appToast.warning("No valid subjects found to save.", "Validation Error");
      return;
    }

    for (let i = 0; i < itemsToSave.length; i++) {
      const item = itemsToSave[i];
      if (!item.name?.trim()) {
        appToast.warning(`Subject #${i + 1} is missing a subject name.`, "Validation Error");
        return;
      }
      if (!item.code?.trim()) {
        appToast.warning(`Subject "${item.name || `#${i + 1}`}" is missing a BTEB subject code.`, "Validation Error");
        return;
      }
    }

    try {
      setSavingSubj(true);
      setBulkProgress({ current: 0, total: itemsToSave.length });

      const result = await adminService.createBulkSubjects(itemsToSave);

      if (result.successCount > 0) {
        appToast.success(
          `Successfully registered ${result.successCount} subject${result.successCount > 1 ? "s" : ""} to ${activeDepartment?.name || "department"}!`,
          "Curriculum Updated"
        );
        if (result.failedCount > 0) {
          appToast.warning(
            `${result.failedCount} subject(s) failed: ${result.errors.slice(0, 2).join("; ")}`,
            "Partial Save"
          );
        }
        setIsSubjModalOpen(false);
        resetSubjModal();
        await loadSubjects(selectedDeptId, selectedSemester);
      } else {
        appToast.error(
          `Failed to add subjects: ${result.errors[0] || "Unknown error"}`,
          "Creation Failed"
        );
      }
    } catch (err: unknown) {
      appToast.error(
        "Failed to add bulk subjects: " + (err instanceof Error ? err.message : "Error"),
        "Save Error"
      );
    } finally {
      setSavingSubj(false);
      setBulkProgress(null);
    }
  };

  const handleSaveBulkForm = () => {
    const validRows = bulkRows.filter((r) => r.name.trim() || r.code.trim());
    if (validRows.length === 0) {
      appToast.warning("Please fill in at least one subject in the row builder.", "No Data");
      return;
    }
    const payload = validRows.map((r) => ({
      name: r.name.trim(),
      code: r.code.trim(),
      semester: Number(r.semester) || 1,
      credit: Number(r.credit) || 3,
      departmentId: selectedDeptId,
    }));
    handleCreateBulkSubjects(payload);
  };

  const handleSaveBulkJson = () => {
    if (!jsonInput.trim()) {
      setJsonError("Please paste a JSON object or array of subjects.");
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      if (arr.length === 0) {
        setJsonError("JSON array is empty.");
        return;
      }
      const payload = arr.map((item: any, idx: number) => {
        if (!item.name || !item.code) {
          throw new Error(`Item #${idx + 1} must include both "name" and "code".`);
        }
        return {
          name: String(item.name).trim(),
          code: String(item.code).trim(),
          semester: Number(item.semester) || 1,
          credit: Number(item.credit) || 3,
          departmentId: item.departmentId || selectedDeptId,
        };
      });
      setJsonError(null);
      handleCreateBulkSubjects(payload);
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON syntax.");
    }
  };

  const handleLoadJsonToRowBuilder = () => {
    if (!jsonInput.trim()) {
      setJsonError("Please paste JSON first.");
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const newRows: BulkSubjectRow[] = arr.map((item: any) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: String(item.name || "").trim(),
        code: String(item.code || "").trim(),
        semester: Number(item.semester) || 1,
        credit: Number(item.credit) || 3,
      }));
      setBulkRows(newRows);
      setJsonError(null);
      setSubjModalMode("bulk_form");
      appToast.info(`Parsed ${newRows.length} subjects into the Row Builder for visual review!`, "JSON Loaded");
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON syntax.");
    }
  };

  const handleInsertJsonTemplate = () => {
    const currentDeptId = selectedDeptId || "c974d975-9386-4f7d-9724-e0021fcf07ce";
    const sample = [
      {
        name: "Engineering Drawing",
        code: "61011",
        semester: 1,
        credit: 2,
        departmentId: currentDeptId,
      },
      {
        name: "Electrical Engineering Fundamental",
        code: "66621",
        semester: 1,
        credit: 4,
        departmentId: currentDeptId,
      },
      {
        name: "Mathematics I",
        code: "65911",
        semester: 1,
        credit: 4,
        departmentId: currentDeptId,
      },
      {
        name: "Basic Electronics",
        code: "66811",
        semester: 1,
        credit: 3,
        departmentId: currentDeptId,
      },
      {
        name: "Automotive Engine",
        code: "66231",
        semester: 3,
        credit: 4,
        departmentId: currentDeptId,
      },
    ];
    setJsonInput(JSON.stringify(sample, null, 2));
    setJsonError(null);
  };

  const handleDeleteSubject = async (subjId: string, name: string) => {
    const confirmed = await appConfirm({
      title: "Delete Subject Course",
      message: `Are you sure you want to permanently delete subject "${name}"? This action cannot be undone.`,
      confirmText: "Delete Subject",
      variant: "destructive",
    });
    if (!confirmed) return;
    try {
      await adminService.deleteSubject(subjId);
      await loadSubjects(selectedDeptId, selectedSemester);
      appToast.success(`Subject "${name}" deleted successfully!`, "Subject Deleted");
    } catch (err: unknown) {
      appToast.error("Failed to delete subject: " + (err instanceof Error ? err.message : "Error"), "Delete Failed");
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
                  {[1, 2, 3, 4, 5, 6, 7].map((s) => (
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

      {/* Add Subject Modal (Supports Single, Bulk Multi-Row, and JSON Array) */}
      {isSubjModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div
            className={`bg-white rounded-3xl ${
              subjModalMode === "single" ? "max-w-md" : "max-w-3xl"
            } w-full border border-[#dce3df] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all`}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#f0f4f1] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-5 h-5 text-[#0a4b32] shrink-0" />
                <h3 className="text-base font-bold text-[#0f1f17] truncate">
                  Add Curriculum Subject{subjModalMode !== "single" ? "s" : ""}
                </h3>
                {activeDepartment && (
                  <Badge
                    variant="outline"
                    className="bg-[#f0f4f1] text-[#0a4b32] border-[#e2e8e4] text-[10px] font-mono shrink-0 hidden xs:inline-flex"
                  >
                    {activeDepartment.code}
                  </Badge>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSubjModalOpen(false);
                  resetSubjModal();
                }}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="px-4 sm:px-5 pt-3 pb-2 shrink-0 border-b border-[#f0f4f1] bg-[#fbfcfb]">
              <div className="flex items-center gap-1.5 p-1 bg-[#edf2ee] rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSubjModalMode("single")}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    subjModalMode === "single"
                      ? "bg-white text-[#0a4b32] shadow-xs font-bold"
                      : "text-[#5a6b62] hover:text-[#0f1f17]"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Single Subject</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubjModalMode("bulk_form")}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    subjModalMode === "bulk_form"
                      ? "bg-white text-[#0a4b32] shadow-xs font-bold"
                      : "text-[#5a6b62] hover:text-[#0f1f17]"
                  }`}
                >
                  <ListPlus className="w-3.5 h-3.5" />
                  <span>Batch Rows ({bulkRows.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubjModalMode("bulk_json")}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    subjModalMode === "bulk_json"
                      ? "bg-white text-[#0a4b32] shadow-xs font-bold"
                      : "text-[#5a6b62] hover:text-[#0f1f17]"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Paste JSON</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {/* MODE 1: Single Subject Form */}
              {subjModalMode === "single" && (
                <div className="space-y-3.5">
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
                        className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32] cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                          <option key={s} value={s}>
                            Semester {s}
                          </option>
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
                        placeholder="3"
                        value={subjCredit}
                        onFocus={(e) => {
                          if (e.target.value === "0") setSubjCredit("");
                        }}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === "") {
                            setSubjCredit("");
                          } else {
                            const clean =
                              raw.length > 1 && raw.startsWith("0") ? raw.replace(/^0+/, "") : raw;
                            setSubjCredit(clean);
                          }
                        }}
                        onBlur={() => {
                          if (subjCredit === "" || Number(subjCredit) < 1) {
                            setSubjCredit(3);
                          }
                        }}
                        className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: Bulk Multi-Row Builder */}
              {subjModalMode === "bulk_form" && (
                <div className="space-y-3.5">
                  {/* Top Bar for Batch Semester Application */}
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <div className="text-xs text-[#0a4b32] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 shrink-0 text-[#c48b28]" />
                      <span>
                        Add multiple courses for <strong>{activeDepartment?.name}</strong> at once.
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-[11px] font-semibold text-[#5a6b62]">Default Semester:</span>
                      <select
                        value={bulkDefaultSemester}
                        onChange={(e) => setBulkDefaultSemester(Number(e.target.value))}
                        className="text-xs h-8 px-2 rounded-lg border border-emerald-200 bg-white font-bold text-[#0a4b32] cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                          <option key={s} value={s}>
                            Semester {s}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBulkRows((prev) =>
                            prev.map((r) => ({ ...r, semester: bulkDefaultSemester }))
                          );
                          appToast.info(
                            `Applied Semester ${bulkDefaultSemester} to all rows!`,
                            "Updated"
                          );
                        }}
                        className="h-8 px-2 text-[11px] font-bold text-[#0a4b32] border-emerald-200 hover:bg-emerald-100/50 cursor-pointer"
                      >
                        Apply to All
                      </Button>
                    </div>
                  </div>

                  {/* Multi-Row Table */}
                  <div className="space-y-2 max-h-[46vh] overflow-y-auto pr-1">
                    {bulkRows.map((row, index) => (
                      <div
                        key={row.id}
                        className="p-2.5 sm:p-3 rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 hover:border-[#0a4b32]/40 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#f0f4f1] text-[#0a4b32] text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </div>

                        {/* Subject Name */}
                        <div className="flex-1 min-w-[180px]">
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBulkRows((prev) =>
                                prev.map((r) => (r.id === row.id ? { ...r, name: val } : r))
                              );
                            }}
                            placeholder="Subject Name (e.g. Automotive Engine)"
                            className="w-full text-xs p-2 rounded-lg border border-[#e2e8e4] bg-white focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                          />
                        </div>

                        {/* Subject Code */}
                        <div className="w-full sm:w-28 shrink-0">
                          <input
                            type="text"
                            value={row.code}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBulkRows((prev) =>
                                prev.map((r) => (r.id === row.id ? { ...r, code: val } : r))
                              );
                            }}
                            placeholder="Code (66231)"
                            className="w-full text-xs p-2 rounded-lg border border-[#e2e8e4] bg-white focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                          />
                        </div>

                        {/* Semester */}
                        <div className="w-full sm:w-28 shrink-0">
                          <select
                            value={row.semester}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setBulkRows((prev) =>
                                prev.map((r) => (r.id === row.id ? { ...r, semester: val } : r))
                              );
                            }}
                            className="w-full text-xs p-2 rounded-lg border border-[#e2e8e4] bg-white focus:outline-none focus:ring-1 focus:ring-[#0a4b32] cursor-pointer"
                          >
                            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                              <option key={s} value={s}>
                                Sem {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Credit */}
                        <div className="w-full sm:w-16 shrink-0">
                          <input
                            type="number"
                            min={1}
                            max={6}
                            value={row.credit}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBulkRows((prev) =>
                                prev.map((r) => (r.id === row.id ? { ...r, credit: val } : r))
                              );
                            }}
                            placeholder="Credits"
                            className="w-full text-xs p-2 rounded-lg border border-[#e2e8e4] bg-white text-center focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                          />
                        </div>

                        {/* Remove Row Button */}
                        <button
                          type="button"
                          disabled={bulkRows.length <= 1}
                          onClick={() => {
                            if (bulkRows.length > 1) {
                              setBulkRows((prev) => prev.filter((r) => r.id !== row.id));
                            }
                          }}
                          className={`p-2 rounded-lg transition-colors shrink-0 ${
                            bulkRows.length <= 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-rose-500 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                          }`}
                          title="Remove Row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Row Button & Summary */}
                  <div className="flex items-center justify-between pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setBulkRows((prev) => [...prev, createEmptyRow(bulkDefaultSemester)])}
                      className="text-xs h-8.5 rounded-xl border-dashed border-[#0a4b32]/40 text-[#0a4b32] hover:bg-emerald-50 cursor-pointer gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Another Row</span>
                    </Button>

                    <div className="text-[11px] text-[#5a6b62] font-semibold">
                      {bulkRows.filter((r) => r.name.trim() && r.code.trim()).length} of {bulkRows.length} valid
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 3: Paste JSON Array */}
              {subjModalMode === "bulk_json" && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-xs text-[#5a6b62]">
                      Paste JSON array of curriculum subjects. Department ID will auto-bind to{" "}
                      <strong className="text-[#0f1f17]">{activeDepartment?.name}</strong>.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleInsertJsonTemplate}
                      className="h-7.5 px-2.5 text-[11px] font-bold text-[#0a4b32] border-emerald-200 hover:bg-emerald-50 cursor-pointer shrink-0 gap-1 self-start sm:self-auto"
                    >
                      <Sparkles className="w-3 h-3 text-[#c48b28]" />
                      <span>Insert Sample Template</span>
                    </Button>
                  </div>

                  <div className="relative">
                    <textarea
                      value={jsonInput}
                      onChange={(e) => {
                        setJsonInput(e.target.value);
                        setJsonError(null);
                      }}
                      rows={10}
                      placeholder={`[\n  {\n    "name": "Automotive Engine",\n    "code": "66231",\n    "semester": 3,\n    "credit": 4\n  }\n]`}
                      className="w-full text-xs font-mono p-3 rounded-2xl border border-[#e2e8e4] bg-[#fcfdfc] text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32]/10 focus:border-[#0a4b32] transition-all leading-relaxed"
                    />
                  </div>

                  {jsonError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{jsonError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleLoadJsonToRowBuilder}
                      className="h-8.5 px-3 text-xs font-semibold rounded-xl border-[#e2e8e4] hover:bg-gray-50 text-[#0f1f17] cursor-pointer gap-1"
                    >
                      <ListPlus className="w-3.5 h-3.5 text-[#0a4b32]" />
                      <span>Load into Row Builder</span>
                    </Button>
                    <span className="text-[11px] text-[#5a6b62]">Supports single object or full array</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-[#f0f4f1] bg-[#fbfcfb] flex items-center justify-end gap-2.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSubjModalOpen(false);
                  resetSubjModal();
                }}
                disabled={savingSubj}
                className="rounded-xl text-xs h-9 px-3.5 cursor-pointer"
              >
                Cancel
              </Button>

              {subjModalMode === "single" && (
                <Button
                  type="button"
                  size="sm"
                  disabled={savingSubj || !subjName.trim() || !subjCode.trim()}
                  onClick={handleCreateSubject}
                  className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-9 px-4 font-bold cursor-pointer gap-1"
                >
                  {savingSubj && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
                  <span>Save Subject</span>
                </Button>
              )}

              {subjModalMode === "bulk_form" && (
                <Button
                  type="button"
                  size="sm"
                  disabled={
                    savingSubj ||
                    bulkRows.filter((r) => r.name.trim() && r.code.trim()).length === 0
                  }
                  onClick={handleSaveBulkForm}
                  className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-9 px-4 font-bold cursor-pointer gap-1"
                >
                  {savingSubj && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
                  <span>
                    {savingSubj
                      ? "Saving Subjects..."
                      : `Save All Subjects (${
                          bulkRows.filter((r) => r.name.trim() && r.code.trim()).length
                        })`}
                  </span>
                </Button>
              )}

              {subjModalMode === "bulk_json" && (
                <Button
                  type="button"
                  size="sm"
                  disabled={savingSubj || !jsonInput.trim()}
                  onClick={handleSaveBulkJson}
                  className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-9 px-4 font-bold cursor-pointer gap-1"
                >
                  {savingSubj && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
                  <span>{savingSubj ? "Saving JSON Subjects..." : "Save Directly from JSON"}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
