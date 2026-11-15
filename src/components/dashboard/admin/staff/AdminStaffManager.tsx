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
  return <div>Admin Staff Manager</div>;
}
