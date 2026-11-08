"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AuthUser } from "@/types/auth";
import { Institute, CreateInstitutePayload, UpdateInstitutePayload } from "@/types/institute";
import { MasterDepartment } from "@/types/admin";
import { instituteService } from "@/services/institute.service";
import { adminService } from "@/services/admin.service";
import AdminInstitutesSkeleton from "@/components/dashboard/skeletons/AdminInstitutesSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Plus,
  Loader2,
  RefreshCw,
  X,
  CheckCircle2,
  Trash2,
  Edit2,
  Globe,
  MapPin,
  Users,
  GraduationCap,
  Layers,
  Search,
  ExternalLink,
  AlertTriangle,
  FolderPlus,
} from "lucide-react";

interface AdminInstitutesManagerProps {
  user: AuthUser;
}

const BD_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

export default function AdminInstitutesManager({ user }: AdminInstitutesManagerProps) {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Create Institute Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateInstitutePayload>({
    name: "",
    code: "",
    division: "Dhaka",
    district: "",
    address: "",
    website: "",
    isActive: true,
  });
  const [savingCreate, setSavingCreate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit Institute Modal State
  const [editingInstitute, setEditingInstitute] = useState<Institute | null>(null);
  const [editForm, setEditForm] = useState<UpdateInstitutePayload>({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Modal State
  const [deletingInstitute, setDeletingInstitute] = useState<Institute | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Department Assignment Modal State
  const [deptModalInstitute, setDeptModalInstitute] = useState<Institute | null>(null);
  const [assignedDepts, setAssignedDepts] = useState<MasterDepartment[]>([]);
  const [allMasterDepts, setAllMasterDepts] = useState<MasterDepartment[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [selectedDeptToAssign, setSelectedDeptToAssign] = useState("");
  const [assigningDept, setAssigningDept] = useState(false);
  const [removingDeptId, setRemovingDeptId] = useState<string | null>(null);

  // Success Feedback Toast/Notification
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // 1. Load All Institutes
  const loadInstitutes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await instituteService.getInstitutesWithMeta({
        limit: 100,
      });
      setInstitutes(res.items || []);
    } catch (err: unknown) {
      console.error("Error loading institutes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInstitutes();
  }, [loadInstitutes]);

  // 2. Metrics calculation
  const metrics = useMemo(() => {
    const total = institutes.length;
    const active = institutes.filter((i) => i.isActive).length;
    const totalStudents = institutes.reduce((acc, i) => acc + (i.studentCount || 0), 0);
    const totalTeachers = institutes.reduce((acc, i) => acc + (i.teacherCount || 0), 0);
    return { total, active, totalStudents, totalTeachers };
  }, [institutes]);

  // 3. Filtered Institutes
  const filteredInstitutes = useMemo(() => {
    return institutes.filter((inst) => {
      // Search
      const search = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !search ||
        inst.name.toLowerCase().includes(search) ||
        inst.code.toLowerCase().includes(search) ||
        inst.district.toLowerCase().includes(search);

      // Division
      const matchesDivision = !selectedDivision || inst.division === selectedDivision;

      // Status
      const matchesStatus =
        selectedStatus === "ALL" ||
        (selectedStatus === "ACTIVE" && inst.isActive) ||
        (selectedStatus === "INACTIVE" && !inst.isActive);

      return matchesSearch && matchesDivision && matchesStatus;
    });
  }, [institutes, searchQuery, selectedDivision, selectedStatus]);

  // 4. Handle Create Institute
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!createForm.name.trim() || !createForm.code.trim() || !createForm.district.trim()) {
      setCreateError("Please fill in all required fields (Name, Code, Division, District).");
      return;
    }

    try {
      setSavingCreate(true);
      await instituteService.createInstitute({
        ...createForm,
        name: createForm.name.trim(),
        code: createForm.code.trim().toUpperCase(),
        division: createForm.division.trim(),
        district: createForm.district.trim(),
        address: createForm.address?.trim() || undefined,
        website: createForm.website?.trim() || undefined,
      });

      showFeedback(`Institute "${createForm.name}" created successfully!`);
      setIsCreateModalOpen(false);
      setCreateForm({
        name: "",
        code: "",
        division: "Dhaka",
        district: "",
        address: "",
        website: "",
        isActive: true,
      });
      await loadInstitutes();
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Failed to create institute");
    } finally {
      setSavingCreate(false);
    }
  };

  // 5. Open Edit Modal
  const openEditModal = (inst: Institute) => {
    setEditingInstitute(inst);
    setEditForm({
      name: inst.name,
      code: inst.code,
      division: inst.division,
      district: inst.district,
      address: inst.address || "",
      website: inst.website || "",
      isActive: inst.isActive,
    });
    setEditError(null);
  };

  // 6. Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInstitute) return;
    setEditError(null);

    try {
      setSavingEdit(true);
      await instituteService.updateInstitute(editingInstitute.id, {
        name: editForm.name?.trim(),
        code: editForm.code?.trim().toUpperCase(),
        division: editForm.division?.trim(),
        district: editForm.district?.trim(),
        address: editForm.address?.trim() || undefined,
        website: editForm.website?.trim() || undefined,
        isActive: editForm.isActive,
      });

      showFeedback(`Institute "${editForm.name || editingInstitute.name}" updated successfully!`);
      setEditingInstitute(null);
      await loadInstitutes();
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Failed to update institute");
    } finally {
      setSavingEdit(false);
    }
  };

  // 7. Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingInstitute) return;
    try {
      setIsDeleting(true);
      await instituteService.deleteInstitute(deletingInstitute.id);
      showFeedback(`Institute "${deletingInstitute.name}" deleted.`);
      setDeletingInstitute(null);
      await loadInstitutes();
    } catch (err: unknown) {
      showFeedback("Failed to delete institute: " + (err instanceof Error ? err.message : "Error"));
    } finally {
      setIsDeleting(false);
    }
  };

  // 8. Open Departments Assignment Modal
  const openDepartmentsModal = async (inst: Institute) => {
    setDeptModalInstitute(inst);
    setLoadingDepts(true);
    try {
      // Fetch both: departments assigned to this institute and global master departments
      const [assigned, master] = await Promise.all([
        adminService.getDepartments(inst.id),
        adminService.getDepartments(),
      ]);
      setAssignedDepts(assigned || []);
      setAllMasterDepts(master || []);
    } catch (err: unknown) {
      console.error("Error loading departments for institute:", err);
    } finally {
      setLoadingDepts(false);
    }
  };

  // 9. Assign Department
  const handleAssignDept = async () => {
    if (!deptModalInstitute || !selectedDeptToAssign) return;
    try {
      setAssigningDept(true);
      await adminService.assignDepartmentToInstitute(deptModalInstitute.id, selectedDeptToAssign);
      showFeedback("Department assigned to institute successfully!");
      setSelectedDeptToAssign("");
      // Reload assigned list
      const updated = await adminService.getDepartments(deptModalInstitute.id);
      setAssignedDepts(updated || []);
    } catch (err: unknown) {
      showFeedback("Failed to assign department: " + (err instanceof Error ? err.message : "Error"));
    } finally {
      setAssigningDept(false);
    }
  };

  // 10. Remove Department
  const handleRemoveDept = async (deptId: string) => {
    if (!deptModalInstitute) return;
    if (!confirm("Are you sure you want to remove this department offering from this institute?")) return;
    try {
      setRemovingDeptId(deptId);
      await adminService.removeDepartmentFromInstitute(deptModalInstitute.id, deptId);
      showFeedback("Department removed from institute.");
      const updated = await adminService.getDepartments(deptModalInstitute.id);
      setAssignedDepts(updated || []);
    } catch (err: unknown) {
      showFeedback("Failed to remove department: " + (err instanceof Error ? err.message : "Error"));
    } finally {
      setRemovingDeptId(null);
    }
  };

  // Unassigned departments list for dropdown
  const unassignedDepts = useMemo(() => {
    const assignedIds = new Set(assignedDepts.map((d) => d.id));
    return allMasterDepts.filter((d) => !assignedIds.has(d.id));
  }, [allMasterDepts, assignedDepts]);

  if (loading && institutes.length === 0) {
    return <AdminInstitutesSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#073825] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-[#0a4b32] animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{feedbackMessage}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-gray-300 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e4] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-[#eef7f2] text-[#0a4b32] rounded-xl inline-block">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#0f1f17] tracking-tight">
              Polytechnic & Institute Management
            </h1>
          </div>
          <p className="text-sm text-[#5a6b62]">
            Register institutions, update campus addresses, and configure assigned academic departments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={loadInstitutes}
            disabled={loading}
            className="rounded-xl border-[#e2e8e4] hover:bg-[#f4f7f5] text-[#0f1f17] font-semibold text-xs h-10 px-3.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={() => {
              setCreateError(null);
              setIsCreateModalOpen(true);
            }}
            className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs font-bold h-10 px-4 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Institute
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-[#e2e8e4] bg-white shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5a6b62] uppercase tracking-wider">
                Total Institutes
              </p>
              <p className="text-2xl font-bold text-[#0f1f17] mt-1">{metrics.total}</p>
              <p className="text-[11px] text-[#5a6b62] mt-0.5">Registered nationwide</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#e2e8e4] bg-white shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5a6b62] uppercase tracking-wider">
                Active Campuses
              </p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{metrics.active}</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">Accepting admissions & staff</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#e2e8e4] bg-white shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5a6b62] uppercase tracking-wider">
                Total Students
              </p>
              <p className="text-2xl font-bold text-[#0f1f17] mt-1">
                {metrics.totalStudents.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#5a6b62] mt-0.5">Across all institutes</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#e2e8e4] bg-white shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#5a6b62] uppercase tracking-wider">
                Total Teachers
              </p>
              <p className="text-2xl font-bold text-[#0f1f17] mt-1">
                {metrics.totalTeachers.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#5a6b62] mt-0.5">Faculty instructors</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2e8e4] shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, code, district..."
            className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
          />
        </div>

        {/* Division & Status Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="text-xs px-3 py-2.5 rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] font-medium focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
          >
            <option value="">All Divisions</option>
            {BD_DIVISIONS.map((div) => (
              <option key={div} value={div}>
                {div} Division
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-2.5 rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] font-medium focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          {(searchQuery || selectedDivision || selectedStatus !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedDivision("");
                setSelectedStatus("ALL");
              }}
              className="text-xs text-[#5a6b62] hover:text-[#0f1f17] h-9 px-2.5"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Institutes Cards Grid */}
      {filteredInstitutes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8e4] p-12 text-center text-[#5a6b62]">
          <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-[#0f1f17]">No Institutes Found</h3>
          <p className="text-xs text-[#5a6b62] mt-1 max-w-sm mx-auto">
            {searchQuery || selectedDivision || selectedStatus !== "ALL"
              ? "No institutions matched your active filter criteria. Try resetting your search filters."
              : "No polytechnic institutes have been added yet. Click 'Add New Institute' to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInstitutes.map((inst) => (
            <Card
              key={inst.id}
              className="rounded-2xl border border-[#e2e8e4] bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3.5">
                {/* Title & Code Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#0f1f17] truncate leading-tight">
                      {inst.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs font-bold text-[#0a4b32] bg-[#eef7f2] px-2 py-0.5 rounded-md">
                        {inst.code}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          inst.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {inst.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Location & Details */}
                <div className="space-y-1.5 text-xs text-[#5a6b62]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0a4b32] shrink-0" />
                    <span className="truncate">
                      {inst.district}, {inst.division} Division
                    </span>
                  </div>

                  {inst.address && (
                    <p className="text-[11px] text-gray-500 line-clamp-1 pl-5">
                      {inst.address}
                    </p>
                  )}

                  {inst.website && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <a
                        href={inst.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate inline-flex items-center gap-1"
                      >
                        {inst.website.replace(/^https?:\/\//, "")}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Counts */}
                <div className="pt-2 border-t border-[#f0f4f1] grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#fcfdfc] p-2 rounded-xl border border-[#f0f4f1]">
                    <span className="text-[10px] text-[#5a6b62] block">Students</span>
                    <span className="font-bold text-[#0f1f17] text-sm">
                      {inst.studentCount || 0}
                    </span>
                  </div>
                  <div className="bg-[#fcfdfc] p-2 rounded-xl border border-[#f0f4f1]">
                    <span className="text-[10px] text-[#5a6b62] block">Faculty</span>
                    <span className="font-bold text-[#0f1f17] text-sm">
                      {inst.teacherCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-[#fcfdfc] border-t border-[#e2e8e4] flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDepartmentsModal(inst)}
                  className="rounded-xl text-[11px] font-semibold h-8 px-2.5 border-[#e2e8e4] text-[#0a4b32] hover:bg-[#eef7f2] flex-1"
                >
                  <Layers className="w-3.5 h-3.5 mr-1" />
                  Departments
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(inst)}
                    className="h-8 w-8 p-0 rounded-xl text-[#5a6b62] hover:text-[#0f1f17] hover:bg-gray-100"
                    title="Edit Institute"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingInstitute(inst)}
                    className="h-8 w-8 p-0 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete Institute"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE INSTITUTE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-[#e2e8e4] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0f4f1]">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#eef7f2] text-[#0a4b32] rounded-xl">
                  <Building2 className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-[#0f1f17]">Register New Institute</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                  Institute Name *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. Chittagong Polytechnic Institute"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                    Institute Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.code}
                    onChange={(e) => setCreateForm({ ...createForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. CPI"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32] font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                    Division *
                  </label>
                  <select
                    value={createForm.division}
                    onChange={(e) => setCreateForm({ ...createForm, division: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  >
                    {BD_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.district}
                    onChange={(e) => setCreateForm({ ...createForm, district: e.target.value })}
                    placeholder="e.g. Chattogram"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                    Official Website
                  </label>
                  <input
                    type="url"
                    value={createForm.website}
                    onChange={(e) => setCreateForm({ ...createForm, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                  Full Campus Address
                </label>
                <input
                  type="text"
                  value={createForm.address}
                  onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                  placeholder="e.g. Nasirabad, Chattogram-4000"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#0f1f17] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createForm.isActive}
                    onChange={(e) => setCreateForm({ ...createForm, isActive: e.target.checked })}
                    className="rounded text-[#0a4b32] focus:ring-[#0a4b32]"
                  />
                  <span>Active Institute (Accepting Students & Faculty)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f0f4f1]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={savingCreate}
                  className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-9 px-4 font-bold"
                >
                  {savingCreate ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                  Create Institute
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT INSTITUTE MODAL */}
      {editingInstitute && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-[#e2e8e4] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0f4f1]">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#eef7f2] text-[#0a4b32] rounded-xl">
                  <Edit2 className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-[#0f1f17]">Edit Institute Information</h3>
              </div>
              <button
                onClick={() => setEditingInstitute(null)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                  Institute Name
                </label>
                <input
                  type="text"
                  value={editForm.name || ""}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                    Institute Code
                  </label>
                  <input
                    type="text"
                    value={editForm.code || ""}
                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32] font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                    Division
                  </label>
                  <select
                    value={editForm.division || ""}
                    onChange={(e) => setEditForm({ ...editForm, division: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  >
                    {BD_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={editForm.district || ""}
                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                    Official Website
                  </label>
                  <input
                    type="url"
                    value={editForm.website || ""}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0f1f17] block mb-1">
                  Full Campus Address
                </label>
                <input
                  type="text"
                  value={editForm.address || ""}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#0f1f17] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isActive ?? true}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="rounded text-[#0a4b32] focus:ring-[#0a4b32]"
                  />
                  <span>Active Institute</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f0f4f1]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingInstitute(null)}
                  className="rounded-xl text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={savingEdit}
                  className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-9 px-4 font-bold"
                >
                  {savingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSTITUTE DEPARTMENTS MANAGEMENT MODAL */}
      {deptModalInstitute && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl border border-[#e2e8e4] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0f4f1]">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#eef7f2] text-[#0a4b32] rounded-xl">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#0f1f17]">
                    Manage Departments for {deptModalInstitute.name}
                  </h3>
                  <p className="text-xs text-[#5a6b62]">
                    Code: <span className="font-mono font-bold text-[#0a4b32]">{deptModalInstitute.code}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeptModalInstitute(null)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {/* Assign New Department Section */}
              <div className="p-4 bg-[#fcfdfc] rounded-2xl border border-[#e2e8e4]">
                <h4 className="text-xs font-bold text-[#0f1f17] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FolderPlus className="w-3.5 h-3.5 text-[#0a4b32]" />
                  Offer New Department at this Institute
                </h4>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <select
                    value={selectedDeptToAssign}
                    onChange={(e) => setSelectedDeptToAssign(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-[#e2e8e4] bg-white text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  >
                    <option value="">-- Select Master Department to Assign --</option>
                    {unassignedDepts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>

                  <Button
                    size="sm"
                    disabled={!selectedDeptToAssign || assigningDept}
                    onClick={handleAssignDept}
                    className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs font-bold h-10 px-4 shrink-0"
                  >
                    {assigningDept ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Plus className="w-3.5 h-3.5 mr-1" />}
                    Assign Department
                  </Button>
                </div>
                {unassignedDepts.length === 0 && (
                  <p className="text-[11px] text-gray-500 mt-2">
                    All available global master departments are already assigned to this institute.
                  </p>
                )}
              </div>

              {/* Current Assigned Departments Table */}
              <div>
                <h4 className="text-xs font-bold text-[#0f1f17] uppercase tracking-wider mb-2">
                  Currently Offered Departments ({assignedDepts.length})
                </h4>

                {loadingDepts ? (
                  <div className="p-8 text-center text-[#5a6b62]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#0a4b32] mb-2" />
                    <p className="text-xs">Loading assigned departments...</p>
                  </div>
                ) : assignedDepts.length === 0 ? (
                  <div className="p-8 text-center text-[#5a6b62] bg-[#fcfdfc] rounded-2xl border border-dashed border-[#e2e8e4]">
                    <Layers className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-xs font-semibold">No departments currently offered</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Use the dropdown above to offer academic departments at this institute.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto rounded-2xl border border-[#e2e8e4]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#fcfdfc] text-[#5a6b62] border-b border-[#e2e8e4] sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3.5 font-semibold">Department</th>
                          <th className="py-2.5 px-3.5 font-semibold">Code</th>
                          <th className="py-2.5 px-3.5 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f4f1] text-[#0f1f17]">
                        {assignedDepts.map((d) => (
                          <tr key={d.id} className="hover:bg-[#fcfdfc]">
                            <td className="py-2.5 px-3.5 font-bold">{d.name}</td>
                            <td className="py-2.5 px-3.5 font-mono text-[#0a4b32] font-semibold">
                              {d.code}
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={removingDeptId === d.id}
                                onClick={() => handleRemoveDept(d.id)}
                                className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-[11px]"
                              >
                                {removingDeptId === d.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  "Remove"
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-[#f0f4f1]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeptModalInstitute(null)}
                className="rounded-xl text-xs h-9 px-4"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingInstitute && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#e2e8e4] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <span className="p-2.5 bg-red-50 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-base font-bold text-[#0f1f17]">Delete Institute</h3>
                <p className="text-xs text-red-600">This action will soft-delete the institution.</p>
              </div>
            </div>

            <p className="text-xs text-[#5a6b62] leading-relaxed my-3">
              Are you sure you want to delete{" "}
              <strong className="text-[#0f1f17]">{deletingInstitute.name}</strong> ({deletingInstitute.code})?
              Existing student and faculty records linked to this institution will remain in the database.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f0f4f1]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingInstitute(null)}
                disabled={isDeleting}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs h-9 px-4 font-bold"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Yes, Delete Institute
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

