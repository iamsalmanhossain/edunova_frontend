"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, CheckCircle2, AlertCircle, Save, School, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile, UpdateUserProfilePayload } from "@/types/user";
import { Institute } from "@/types/institute";
import { Department } from "@/types/department";
import { userService } from "@/services/user.service";
import { instituteService } from "@/services/institute.service";
import { departmentService } from "@/services/department.service";

interface StudentEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdated: (updated: UserProfile) => void;
}

interface FormValues {
  name: string;
  phone: string;
  instituteId: string;
  departmentId: string;
  rollNo: string;
  registrationNo: string;
  session: string;
  semester: number;
  shift: "FIRST_SHIFT" | "SECOND_SHIFT";
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  bloodGroup: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
}

export default function StudentEditProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdated,
}: StudentEditProfileModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loadingInstitutes, setLoadingInstitutes] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const student = profile.studentProfile;
  const initialInstId =
    student?.institute?.id ||
    (student as { instituteId?: string })?.instituteId ||
    "";
  const initialDeptId =
    student?.department?.id ||
    (student as { departmentId?: string })?.departmentId ||
    "";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: profile.name || "",
      phone: profile.phone || "",
      instituteId: initialInstId,
      departmentId: initialDeptId,
      rollNo: student?.rollNo || "",
      registrationNo: student?.registrationNo || "",
      session: student?.session || "",
      semester: student?.semester ?? 1,
      shift: (student?.shift as "FIRST_SHIFT" | "SECOND_SHIFT") || "FIRST_SHIFT",
      gender: (student?.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
      dateOfBirth: student?.dateOfBirth ? student.dateOfBirth.split("T")[0] : "",
      bloodGroup: student?.bloodGroup || "",
      guardianName: student?.guardianName || "",
      guardianPhone: student?.guardianPhone || "",
      address: student?.address || "",
    },
  });

  const selectedInstituteId = watch("instituteId");
  const selectedDepartmentId = watch("departmentId");

  // Load institutes and current institute's departments from backend & sync form on open
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    const currentStudent = profile.studentProfile;
    const instId =
      currentStudent?.institute?.id ||
      (currentStudent as { instituteId?: string })?.instituteId ||
      "";
    const deptId =
      currentStudent?.department?.id ||
      (currentStudent as { departmentId?: string })?.departmentId ||
      "";

    reset({
      name: profile.name || "",
      phone: profile.phone || "",
      instituteId: instId,
      departmentId: deptId,
      rollNo: currentStudent?.rollNo || "",
      registrationNo: currentStudent?.registrationNo || "",
      session: currentStudent?.session || "",
      semester: currentStudent?.semester ?? 1,
      shift: (currentStudent?.shift as "FIRST_SHIFT" | "SECOND_SHIFT") || "FIRST_SHIFT",
      gender: (currentStudent?.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
      dateOfBirth: currentStudent?.dateOfBirth ? currentStudent.dateOfBirth.split("T")[0] : "",
      bloodGroup: currentStudent?.bloodGroup || "",
      guardianName: currentStudent?.guardianName || "",
      guardianPhone: currentStudent?.guardianPhone || "",
      address: currentStudent?.address || "",
    });

    async function loadAcademicData() {
      try {
        setLoadingInstitutes(true);
        const instList = await instituteService.getInstitutes();
        if (mounted) {
          setInstitutes(instList || []);
        }

        if (instId) {
          setLoadingDepts(true);
          const deptList = await departmentService.getDepartments(instId);
          if (mounted) {
            setDepartments(deptList || []);
            if (deptId && deptList?.some((d) => d.id === deptId)) {
              setValue("departmentId", deptId);
            } else if (deptList && deptList.length > 0) {
              setValue("departmentId", deptList[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load academic data:", err);
      } finally {
        if (mounted) {
          setLoadingInstitutes(false);
          setLoadingDepts(false);
        }
      }
    }

    loadAcademicData();

    return () => {
      mounted = false;
    };
  }, [isOpen, profile, reset, setValue]);

  // When user selects a different institute, fetch ONLY that institute's departments
  const handleInstituteChange = async (newInstId: string) => {
    setValue("instituteId", newInstId, { shouldValidate: true });
    setValue("departmentId", "", { shouldValidate: true });
    setDepartments([]);

    if (!newInstId) return;

    try {
      setLoadingDepts(true);
      const list = await departmentService.getDepartments(newInstId);
      setDepartments(list || []);
      if (list && list.length > 0) {
        setValue("departmentId", list[0].id, { shouldValidate: true });
      }
    } catch {
      setDepartments([]);
    } finally {
      setLoadingDepts(false);
    }
  };

  if (!isOpen) return null;

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload: UpdateUserProfilePayload = {
        name: data.name.trim(),
        phone: data.phone.trim() || null,
        studentProfile: {
          instituteId: data.instituteId || undefined,
          departmentId: data.departmentId || undefined,
          rollNo: data.rollNo.trim() || undefined,
          registrationNo: data.registrationNo.trim() || undefined,
          session: data.session.trim() || undefined,
          semester: Number(data.semester),
          shift: data.shift,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth && data.dateOfBirth.trim() ? new Date(data.dateOfBirth).toISOString() : undefined,
          bloodGroup: data.bloodGroup.trim() || undefined,
          guardianName: data.guardianName.trim() || undefined,
          guardianPhone: data.guardianPhone.trim() || undefined,
          address: data.address.trim() || undefined,
        },
      };

      const updated = await userService.updateProfile(payload);
      setSuccessMessage("Student profile updated successfully!");
      onUpdated(updated);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMessage(
        errorObj?.message || "Failed to update profile. Please verify your fields."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-[#dce3df] my-auto">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#f0f4f1] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0f1f17]">
              Edit Student Profile
            </h2>
            <p className="text-xs text-[#5a6b62]">
              Update institutional credentials, academic discipline, and personal records
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#f0f4f1] hover:bg-[#e4ece7] text-[#0f1f17] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Success Banner */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2.5 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Basic Identity */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#0a4b32] uppercase tracking-wider">
              Identity & Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <Label htmlFor="name" className="text-xs font-bold text-[#0f1f17]">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  {...register("name", { required: "Full name is required" })}
                  className="mt-1 text-xs"
                />
                {errors.name && (
                  <p className="text-[10px] text-red-600 mt-0.5">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs font-bold text-[#0f1f17]">
                  Contact Phone
                </Label>
                <Input
                  id="phone"
                  placeholder="017xxxxxxxx"
                  {...register("phone")}
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Institution & Department Assignment */}
          <div className="space-y-3 pt-2 border-t border-[#f0f4f1]">
            <h3 className="text-xs font-bold text-[#0a4b32] uppercase tracking-wider flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-[#c48b28]" />
              Institute & Department
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <Label htmlFor="instituteId" className="text-xs font-bold text-[#0f1f17] flex items-center justify-between">
                  <span>Academic Institute *</span>
                  {loadingInstitutes && (
                    <span className="text-[10px] text-[#0a4b32] flex items-center gap-1 font-medium">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                    </span>
                  )}
                </Label>
                <select
                  id="instituteId"
                  {...register("instituteId", { required: "Institute is required" })}
                  value={selectedInstituteId || ""}
                  onChange={(e) => {
                    handleInstituteChange(e.target.value);
                  }}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a4b32]"
                >
                  <option value="">-- Select an Academic Institute * --</option>
                  {institutes.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} {inst.code ? `(${inst.code})` : ""}
                    </option>
                  ))}
                </select>
                {errors.instituteId && (
                  <p className="text-[10px] text-red-600 mt-0.5">{errors.instituteId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="departmentId" className="text-xs font-bold text-[#0f1f17] flex items-center justify-between">
                  <span>Discipline / Department *</span>
                  {loadingDepts && (
                    <span className="text-[10px] text-[#0a4b32] flex items-center gap-1 font-medium">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                    </span>
                  )}
                </Label>
                <select
                  id="departmentId"
                  disabled={loadingDepts || !selectedInstituteId || departments.length === 0}
                  {...register("departmentId", { required: "Department is required" })}
                  value={selectedDepartmentId || ""}
                  onChange={(e) => {
                    setValue("departmentId", e.target.value, { shouldValidate: true });
                  }}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a4b32] disabled:bg-[#f4f6f5] disabled:text-[#8a9b92] disabled:cursor-not-allowed"
                >
                  {!selectedInstituteId ? (
                    <option value="">-- Please select an institute first --</option>
                  ) : loadingDepts ? (
                    <option value="">Loading departments for selected institute...</option>
                  ) : departments.length === 0 ? (
                    <option value="">No departments available for this institute</option>
                  ) : (
                    <>
                      <option value="">-- Select Department / Program * --</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} {dept.code ? `(${dept.code})` : ""}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {!selectedInstituteId && (
                  <p className="text-[10px] text-[#5a6b62] mt-1">
                    Select an academic institute above to load its offered departments.
                  </p>
                )}
                {errors.departmentId && (
                  <p className="text-[10px] text-red-600 mt-0.5">{errors.departmentId.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Records */}
          <div className="space-y-3 pt-2 border-t border-[#f0f4f1]">
            <h3 className="text-xs font-bold text-[#0a4b32] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#c48b28]" />
              Academic Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <Label htmlFor="rollNo" className="text-xs font-bold text-[#0f1f17]">
                  Class Roll No
                </Label>
                <Input
                  id="rollNo"
                  placeholder="e.g. 619820"
                  {...register("rollNo")}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="registrationNo" className="text-xs font-bold text-[#0f1f17]">
                  Registration No
                </Label>
                <Input
                  id="registrationNo"
                  placeholder="e.g. 1502123456"
                  {...register("registrationNo")}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="session" className="text-xs font-bold text-[#0f1f17]">
                  Academic Session
                </Label>
                <Input
                  id="session"
                  placeholder="e.g. 2022-2023"
                  {...register("session", {
                    pattern: {
                      value: /^\d{4}-\d{4}$/,
                      message: "Format must be YYYY-YYYY",
                    },
                  })}
                  className="mt-1 text-xs"
                />
                {errors.session && (
                  <p className="text-[10px] text-red-600 mt-0.5">{errors.session.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="semester" className="text-xs font-bold text-[#0f1f17]">
                  Current Semester *
                </Label>
                <select
                  id="semester"
                  {...register("semester", { valueAsNumber: true })}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a4b32]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s} ({s === 1 ? "1st" : s === 2 ? "2nd" : s === 3 ? "3rd" : `${s}th`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="shift" className="text-xs font-bold text-[#0f1f17]">
                  Academic Shift *
                </Label>
                <select
                  id="shift"
                  {...register("shift")}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a4b32]"
                >
                  <option value="FIRST_SHIFT">First Shift (Morning Schedule)</option>
                  <option value="SECOND_SHIFT">Second Shift (Afternoon Schedule)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="bloodGroup" className="text-xs font-bold text-[#0f1f17]">
                  Blood Group
                </Label>
                <Input
                  id="bloodGroup"
                  placeholder="e.g. A+, O+, B+"
                  {...register("bloodGroup")}
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Personal & Guardian Info */}
          <div className="space-y-3 pt-2 border-t border-[#f0f4f1]">
            <h3 className="text-xs font-bold text-[#0a4b32] uppercase tracking-wider">
              Personal & Guardian Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <Label htmlFor="gender" className="text-xs font-bold text-[#0f1f17]">
                  Gender
                </Label>
                <select
                  id="gender"
                  {...register("gender")}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="dateOfBirth" className="text-xs font-bold text-[#0f1f17]">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="guardianName" className="text-xs font-bold text-[#0f1f17]">
                  Guardian Name
                </Label>
                <Input
                  id="guardianName"
                  placeholder="Father's or Guardian's name"
                  {...register("guardianName")}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="guardianPhone" className="text-xs font-bold text-[#0f1f17]">
                  Guardian Phone
                </Label>
                <Input
                  id="guardianPhone"
                  placeholder="Guardian contact phone"
                  {...register("guardianPhone")}
                  className="mt-1 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="address" className="text-xs font-bold text-[#0f1f17]">
                  Present Address
                </Label>
                <Input
                  id="address"
                  placeholder="Village/Road, Upazila, District"
                  {...register("address")}
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#f0f4f1] flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-bold px-4 py-2 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-[#c48b28]" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
