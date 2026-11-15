"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  Users,
  UserPlus,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  Edit,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Building2,
  Shield,
  Briefcase,
  GraduationCap,
  Award,
  Compass,
  BookOpen,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  Mail,
  X,
} from "lucide-react";
import {
  InstitutionStaff,
  InstitutionStaffRole,
  Shift,
  CreateStaffPayload,
  ROLE_LABELS,
} from "@/types/staff";
import { staffService } from "@/services/staff.service";
import { departmentService } from "@/services/department.service";
import { instituteService } from "@/services/institute.service";
import { Department } from "@/types/department";
import { Institute } from "@/types/institute";
import { AuthUser } from "@/types/auth";
import { useToastStore } from "@/store/useToastStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AdminStaffManagerProps {
  user: AuthUser;
}

const ALL_ROLES: InstitutionStaffRole[] = [
  "PRINCIPAL",
  "CHIEF_INSTRUCTOR",
  "INSTRUCTOR",
  "JUNIOR_INSTRUCTOR",
  "ADMINISTRATIVE_SECTION",
  "ACCOUNTS_SECTION",
  "JOB_PLACEMENT_CELL",
  "ROVER_SCOUT_UNIT",
  "STORE_SECTION",
  "SECURITY_SECTION",
  "LIBRARY",
  "FOURTH_CLASS_EMPLOYEE_REVENUE",
  "OUTSOURCED_STAFF",
];

export default function AdminStaffManager({ user }: AdminStaffManagerProps) {
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [staffList, setStaffList] = useState<InstitutionStaff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Filters
  const [viewTab, setViewTab] = useState<"ACTIVE" | "DELETED">("ACTIVE");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [filterShift, setFilterShift] = useState<string>("ALL");
  const [filterDept, setFilterDept] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingStaff, setEditingStaff] = useState<InstitutionStaff | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<{
    instituteId: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
    designation: string;
    role: InstitutionStaffRole;
    shift: string;
    departmentId: string;
    displayOrder: number;
    isPublished: boolean;
  }>({
    instituteId: user.instituteId || "",
    name: "",
    email: "",
    phone: "",
    avatarUrl: "",
    designation: "",
    role: "INSTRUCTOR",
    shift: "",
    departmentId: "",
    displayOrder: 10,
    isPublished: true,
  });

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<InstitutionStaff | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Target Institute
  const targetInstituteId = user.instituteId || (institutes[0]?.id ?? "");

  // Load institutes and departments
  useEffect(() => {
    async function loadMeta() {
      try {
        const [instList, deptList] = await Promise.all([
          instituteService.getInstitutes(),
          departmentService.getDepartments(user.instituteId || "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b"),
        ]);
        setInstitutes(instList);
        setDepartments(deptList);
      } catch {
        // Fallback
      }
    }
    loadMeta();
  }, [user.instituteId]);

  // Fetch staff list
  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await staffService.getAdminStaff({
        includeDeleted: viewTab === "DELETED",
        limit: 100,
      });

      // Filter by deleted status according to viewTab
      const filtered = (res.data || []).filter((s) =>
        viewTab === "DELETED" ? Boolean(s.deletedAt) : !s.deletedAt
      );
      setStaffList(filtered);
    } catch {
      toastError("Failed to fetch staff members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [viewTab, toastError]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Filtered staff in view
  const displayStaff = useMemo(() => {
    return staffList.filter((s) => {
      if (filterRole !== "ALL" && s.role !== filterRole) return false;
      if (filterShift !== "ALL" && s.shift !== filterShift) return false;
      if (filterDept !== "ALL" && s.departmentId !== filterDept) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (s.resolvedName || s.name || "").toLowerCase();
        const desig = (s.designation || "").toLowerCase();
        const dept = (s.department?.name || "").toLowerCase();
        const email = (s.resolvedEmail || s.email || "").toLowerCase();
        const phone = (s.resolvedPhone || s.phone || "").toLowerCase();

        return (
          name.includes(q) ||
          desig.includes(q) ||
          dept.includes(q) ||
          email.includes(q) ||
          phone.includes(q)
        );
      }

      return true;
    });
  }, [staffList, filterRole, filterShift, filterDept, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    const total = staffList.length;
    const faculty = staffList.filter(
      (s) =>
        s.role === "PRINCIPAL" ||
        s.role === "CHIEF_INSTRUCTOR" ||
        s.role === "INSTRUCTOR" ||
        s.role === "JUNIOR_INSTRUCTOR"
    ).length;
    const admin = staffList.filter(
      (s) =>
        s.role === "ADMINISTRATIVE_SECTION" ||
        s.role === "ACCOUNTS_SECTION" ||
        s.role === "STORE_SECTION" ||
        s.role === "JOB_PLACEMENT_CELL" ||
        s.role === "ROVER_SCOUT_UNIT" ||
        s.role === "LIBRARY"
    ).length;
    const support = staffList.filter(
      (s) =>
        s.role === "SECURITY_SECTION" ||
        s.role === "FOURTH_CLASS_EMPLOYEE_REVENUE" ||
        s.role === "OUTSOURCED_STAFF"
    ).length;

    return { total, faculty, admin, support };
  }, [staffList]);

  // Handle open create modal
  const handleOpenCreate = () => {
    setEditingStaff(null);
    setFormData({
      instituteId: targetInstituteId || "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "",
      email: "",
      phone: "",
      avatarUrl: "",
      designation: "",
      role: "INSTRUCTOR",
      shift: "",
      departmentId: "",
      displayOrder: 10,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (staff: InstitutionStaff) => {
    setEditingStaff(staff);
    setFormData({
      instituteId: staff.instituteId,
      name: staff.name || staff.resolvedName || "",
      email: staff.email || staff.resolvedEmail || "",
      phone: staff.phone || staff.resolvedPhone || "",
      avatarUrl: staff.avatarUrl || staff.resolvedAvatarUrl || "",
      designation: staff.designation,
      role: staff.role,
      shift: staff.shift || "",
      departmentId: staff.departmentId || "",
      displayOrder: staff.displayOrder ?? 10,
      isPublished: staff.isPublished,
    });
    setIsModalOpen(true);
  };

  // Handle save (Create or Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.designation.trim()) {
      toastError("Designation is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateStaffPayload = {
        instituteId: formData.instituteId || targetInstituteId,
        name: formData.name.trim() || undefined,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        avatarUrl: formData.avatarUrl.trim() || undefined,
        designation: formData.designation.trim(),
        role: formData.role,
        shift: formData.shift ? (formData.shift as Shift) : undefined,
        departmentId: formData.departmentId || undefined,
        displayOrder: Number(formData.displayOrder) || 0,
        isPublished: formData.isPublished,
      };

      if (editingStaff) {
        await staffService.updateStaff(editingStaff.id, payload);
        toastSuccess("Staff member updated successfully!");
      } else {
        await staffService.createStaff(payload);
        toastSuccess("Staff member created successfully!");
      }

      setIsModalOpen(false);
      fetchStaff();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save staff record";
      toastError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Soft Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await staffService.deleteStaff(deleteTarget.id);
      toastSuccess(`"${deleteTarget.resolvedName}" moved to trash (soft-deleted).`);
      setDeleteTarget(null);
      fetchStaff();
    } catch {
      toastError("Failed to soft-delete staff member");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Restore
  const handleRestore = async (staff: InstitutionStaff) => {
    try {
      await staffService.restoreStaff(staff.id);
      toastSuccess(`"${staff.resolvedName}" restored successfully!`);
      fetchStaff();
    } catch {
      toastError("Failed to restore staff member");
    }
  };

  // Handle Sync Registered Teachers
  const handleSyncTeachers = async () => {
    setIsSyncing(true);
    try {
      const res = await staffService.syncTeachers(targetInstituteId);
      toastSuccess(
        res.message || `Synchronized ${res.syncedCount} teachers into staff directory!`,
        "Teacher Sync Complete"
      );
      fetchStaff();
    } catch {
      toastError("Failed to sync registered teachers");
    } finally {
      setIsSyncing(false);
    }
  };

  return <div>Admin Staff Manager</div>;
}
