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

interface TeacherEditProfileModalProps {
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
  designation: string;
  qualification: string;
  shift: "FIRST_SHIFT" | "SECOND_SHIFT";
  gender: "MALE" | "FEMALE" | "OTHER";
  bloodGroup: string;
  dateOfBirth: string;
  dateOfJoining: string;
  bio: string;
}

export default function TeacherEditProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdated,
}: TeacherEditProfileModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loadingInstitutes, setLoadingInstitutes] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const teacher = profile.teacherProfile;
  const initialInstId =
    teacher?.institute?.id ||
    (teacher as { instituteId?: string })?.instituteId ||
    "";
  const initialDeptId =
    teacher?.department?.id ||
    (teacher as { departmentId?: string })?.departmentId ||
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
      designation: teacher?.designation || "",
      qualification: teacher?.qualification || "",
      shift: (teacher?.shift as "FIRST_SHIFT" | "SECOND_SHIFT") || "FIRST_SHIFT",
      gender: (teacher?.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
      bloodGroup: teacher?.bloodGroup || "",
      dateOfBirth: teacher?.dateOfBirth ? teacher.dateOfBirth.split("T")[0] : "",
      dateOfJoining: teacher?.dateOfJoining ? teacher.dateOfJoining.split("T")[0] : "",
      bio: teacher?.bio || "",
    },
  });

  const selectedInstituteId = watch("instituteId");
  const selectedDepartmentId = watch("departmentId");

  // Load institutes and current institute's departments from backend & sync form on open
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    const currentTeacher = profile.teacherProfile;
    const instId =
      currentTeacher?.institute?.id ||
      (currentTeacher as { instituteId?: string })?.instituteId ||
      "";
    const deptId =
      currentTeacher?.department?.id ||
      (currentTeacher as { departmentId?: string })?.departmentId ||
      "";

    reset({
      name: profile.name || "",
      phone: profile.phone || "",
      instituteId: instId,
      departmentId: deptId,
      designation: currentTeacher?.designation || "",
      qualification: currentTeacher?.qualification || "",
      shift: (currentTeacher?.shift as "FIRST_SHIFT" | "SECOND_SHIFT") || "FIRST_SHIFT",
      gender: (currentTeacher?.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
      bloodGroup: currentTeacher?.bloodGroup || "",
      dateOfBirth: currentTeacher?.dateOfBirth ? currentTeacher.dateOfBirth.split("T")[0] : "",
      dateOfJoining: currentTeacher?.dateOfJoining ? currentTeacher.dateOfJoining.split("T")[0] : "",
      bio: currentTeacher?.bio || "",
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
        teacherProfile: {
          instituteId: data.instituteId || undefined,
          departmentId: data.departmentId || undefined,
          designation: data.designation.trim() || undefined,
          qualification: data.qualification.trim() || undefined,
          shift: data.shift,
          gender: data.gender,
          bloodGroup: data.bloodGroup.trim() || undefined,
          dateOfBirth: data.dateOfBirth && data.dateOfBirth.trim() ? new Date(data.dateOfBirth).toISOString() : undefined,
          dateOfJoining: data.dateOfJoining && data.dateOfJoining.trim() ? new Date(data.dateOfJoining).toISOString() : undefined,
          bio: data.bio.trim() || undefined,
        },
      };

      const updated = await userService.updateProfile(payload);
      setSuccessMessage("Faculty profile updated successfully!");
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
              Edit Faculty Profile
            </h2>
            <p className="text-xs text-[#5a6b62]">
              Update institutional appointment, department, academic rank, and biography
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2.5 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Identity & Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#0a4b32] uppercase tracking-wider">
              Identity & Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <Label htmlFor="t_name" className="text-xs font-bold text-[#0f1f17]">
                  Full Name *
                </Label>
                <Input
                  id="t_name"
                  {...register("name", { required: "Full name is required" })}
                  className="mt-1 text-xs"
                />
                {errors.name && (
                  <p className="text-[10px] text-red-600 mt-0.5">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="t_phone" className="text-xs font-bold text-[#0f1f17]">
                  Contact Phone
                </Label>
                <Input
                  id="t_phone"
                  placeholder="018xxxxxxxx"
                  {...register("phone")}
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Institute & Department */}
          <div className="space-y-3 pt-2 border-t border-[#f0f4f1]">
            <h3 className="text-xs font-bold text-[#0a4b32] uppercase tracking-wider flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-[#c48b28]" />
              Institutional Affiliation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <Label htmlFor="t_instituteId" className="text-xs font-bold text-[#0f1f17] flex items-center justify-between">
                  <span>Academic Institute *</span>
                  {loadingInstitutes && (
                    <span className="text-[10px] text-[#0a4b32] flex items-center gap-1 font-medium">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                    </span>
                  )}
                </Label>
                <select
                  id="t_instituteId"
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
                <Label htmlFor="t_departmentId" className="text-xs font-bold text-[#0f1f17] flex items-center justify-between">
                  <span>Discipline / Department *</span>
                  {loadingDepts && (
                    <span className="text-[10px] text-[#0a4b32] flex items-center gap-1 font-medium">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                    </span>
                  )}
                </Label>
                <select
                  id="t_departmentId"
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

          {/* Academic Rank & Credentials */}
          <div className="space-y-3 pt-2 border-t border-[#f0f4f1]">
            <h3 className="text-xs font-bold text-[#0a4b32] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#c48b28]" />
              Faculty Rank & Shift
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <Label htmlFor="designation" className="text-xs font-bold text-[#0f1f17]">
                  Designation
                </Label>
                <Input
                  id="designation"
                  placeholder="e.g. Senior Instructor"
                  {...register("designation")}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="qualification" className="text-xs font-bold text-[#0f1f17]">
                  Qualification
                </Label>
                <Input
                  id="qualification"
                  placeholder="e.g. B.Sc. in CSE, DUET"
                  {...register("qualification")}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="t_shift" className="text-xs font-bold text-[#0f1f17]">
                  Teaching Shift *
                </Label>
                <select
                  id="t_shift"
                  {...register("shift")}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a4b32]"
                >
                  <option value="FIRST_SHIFT">First Shift (Morning Schedule)</option>
                  <option value="SECOND_SHIFT">Second Shift (Afternoon Schedule)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="t_gender" className="text-xs font-bold text-[#0f1f17]">
                  Gender
                </Label>
                <select
                  id="t_gender"
                  {...register("gender")}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="t_blood" className="text-xs font-bold text-[#0f1f17]">
                  Blood Group
                </Label>
                <Input
                  id="t_blood"
                  placeholder="e.g. B+, A+, O+"
                  {...register("bloodGroup")}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="t_dob" className="text-xs font-bold text-[#0f1f17]">
                  Date of Birth
                </Label>
                <Input
                  id="t_dob"
                  type="date"
                  {...register("dateOfBirth")}
                  className="mt-1 text-xs"
                />
              </div>

              <div className="sm:col-span-3">
                <Label htmlFor="t_doj" className="text-xs font-bold text-[#0f1f17]">
                  Date of Joining Campus
                </Label>
                <Input
                  id="t_doj"
                  type="date"
                  {...register("dateOfJoining")}
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-3 pt-2 border-t border-[#f0f4f1]">
            <h3 className="text-xs font-bold text-[#0a4b32] uppercase tracking-wider">
              Faculty Biography
            </h3>
            <div>
              <Label htmlFor="bio" className="text-xs font-bold text-[#0f1f17]">
                Brief Professional Bio & Teaching Areas
              </Label>
              <textarea
                id="bio"
                rows={3}
                placeholder="Share your research interests, teaching portfolio, and academic focus..."
                {...register("bio", {
                  maxLength: {
                    value: 2000,
                    message: "Bio cannot exceed 2000 characters",
                  },
                })}
                className="mt-1 w-full rounded-md border border-input bg-transparent p-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
              {errors.bio && (
                <p className="text-[10px] text-red-600 mt-0.5">{errors.bio.message}</p>
              )}
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
