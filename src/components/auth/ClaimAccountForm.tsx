"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  User,
  Phone,
  Hash,
  Eye,
  EyeOff,
  Building2,
  Sparkles,
  Check,
  ClipboardList,
  HelpCircle,
} from "lucide-react";
import PageGuideDrawer from "@/components/dashboard/guides/PageGuideDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { instituteService, VERIFIED_INSTITUTES } from "@/services/institute.service";
import { departmentService, VERIFIED_DEPARTMENTS } from "@/services/department.service";
import { Institute } from "@/types/institute";
import { Department } from "@/types/department";

interface ClaimFormValues {
  instituteId: string;
  departmentId: string;
  shift: "FIRST" | "SECOND";
  rollNo: string;
  registrationNo?: string;
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export default function ClaimAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Wizard Step: 1 = Academic, 2 = Credentials, 3 = Confirm
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isGuideDrawerOpen, setIsGuideDrawerOpen] = useState(false);

  // Institutes & Departments
  const [institutes, setInstitutes] = useState<Institute[]>(VERIFIED_INSTITUTES);
  const [departments, setDepartments] = useState<Department[]>(VERIFIED_DEPARTMENTS);
  const [loadingInstitutes, setLoadingInstitutes] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Form State with URL query pre-population
  const [formData, setFormData] = useState<ClaimFormValues>(() => ({
    instituteId: searchParams.get("instituteId") || VERIFIED_INSTITUTES[0]?.id || "",
    departmentId: searchParams.get("departmentId") || VERIFIED_DEPARTMENTS[0]?.id || "",
    shift: (searchParams.get("shift") === "SECOND" || searchParams.get("shift") === "SECOND_SHIFT" ? "SECOND" : "FIRST"),
    rollNo: searchParams.get("rollNo") || "",
    registrationNo: searchParams.get("registrationNo") || "",
    name: searchParams.get("name") || "",
    email: searchParams.get("email") || "",
    password: "",
    confirmPassword: "",
    phone: searchParams.get("phone") || "",
  }));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingRoll, setIsCheckingRoll] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<"NOT_FOUND" | "ALREADY_CLAIMED" | "EMAIL_TAKEN" | "GENERAL" | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [preEnrolledVerified, setPreEnrolledVerified] = useState<boolean>(false);

  // Load Institutes on mount
  useEffect(() => {
    let mounted = true;
    async function loadInstitutes() {
      try {
        setLoadingInstitutes(true);
        const list = await instituteService.getInstitutes();
        if (mounted && list.length > 0) {
          setInstitutes(list);
          if (!formData.instituteId) {
            setFormData((prev) => ({ ...prev, instituteId: list[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to load institutes:", err);
      } finally {
        if (mounted) setLoadingInstitutes(false);
      }
    }
    loadInstitutes();
    return () => {
      mounted = false;
    };
  }, []);

  // Load Departments when instituteId changes
  useEffect(() => {
    let mounted = true;
    if (!formData.instituteId) return;

    async function loadDepartments() {
      try {
        setLoadingDepartments(true);
        const list = await departmentService.getDepartments(formData.instituteId);
        if (mounted) {
          if (list.length > 0) {
            setDepartments(list);
            setFormData((prev) => ({
              ...prev,
              departmentId: list.some((d) => d.id === prev.departmentId) ? prev.departmentId : list[0].id,
            }));
          } else {
            setDepartments(VERIFIED_DEPARTMENTS);
          }
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
        if (mounted) setDepartments(VERIFIED_DEPARTMENTS);
      } finally {
        if (mounted) setLoadingDepartments(false);
      }
    }
    loadDepartments();
    return () => {
      mounted = false;
    };
  }, [formData.instituteId]);

  const handleChange = (field: keyof ClaimFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setServerError(null);
    setErrorType(null);
    if (field === "rollNo" || field === "departmentId" || field === "shift") {
      setPreEnrolledVerified(false);
    }
  };

  // Step 1 Validation
  const handleNextToStep2 = async () => {
    setServerError(null);
    setErrorType(null);

    if (!formData.departmentId) {
      setServerError("Please select your academic department.");
      return;
    }
    if (!formData.rollNo.trim()) {
      setServerError("Please enter your Class/Board Roll number.");
      return;
    }

    try {
      setIsCheckingRoll(true);
      const check = await authService.checkStudentRoll({
        departmentId: formData.departmentId,
        shift: formData.shift,
        rollNo: formData.rollNo.trim(),
      });

      if (check.exists) {
        if (check.isClaimed) {
          setErrorType("ALREADY_CLAIMED");
          setServerError(`The student account for roll '${formData.rollNo}' has already been claimed and activated. Please log in directly.`);
          return;
        }
        setPreEnrolledVerified(true);
      }
    } catch {
      // Continue anyway if network issue
    } finally {
      setIsCheckingRoll(false);
    }

    setCurrentStep(2);
  };

  // Step 2 Validation
  const handleNextToStep3 = () => {
    setServerError(null);
    setErrorType(null);

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setServerError("Please enter a valid personal email address.");
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      setServerError("Password must be at least 8 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setServerError("Password and confirm password do not match.");
      return;
    }

    setCurrentStep(3);
  };

  // Final Submission (Step 3)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrorType(null);
    setSuccessMessage(null);

    try {
      setIsSubmitting(true);
      const res = await authService.claimStudentAccount({
        departmentId: formData.departmentId,
        shift: formData.shift,
        rollNo: formData.rollNo.trim(),
        name: formData.name?.trim() || undefined,
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
        phone: formData.phone?.trim() || undefined,
        registrationNo: formData.registrationNo?.trim() || undefined,
      });

      if (res.success || res.data) {
        setSuccessMessage("Account activated! All your attendance records and exam marks are preserved.");
        setTimeout(() => {
          router.push("/dashboard/student");
        }, 1100);
      }
    } catch (err: any) {
      console.error("Account claim error:", err);
      const status = err?.status || err?.response?.status;
      const message = err?.message || err?.response?.data?.message || "Failed to claim student account.";

      if (status === 404 || message.toLowerCase().includes("no pre-enrolled student found")) {
        setErrorType("NOT_FOUND");
        setServerError("Roll number not found. Please verify your department, shift, and roll number with your class teacher.");
      } else if (
        status === 409 &&
        (message.toLowerCase().includes("already been claimed") || message.toLowerCase().includes("already claimed"))
      ) {
        setErrorType("ALREADY_CLAIMED");
        setServerError(`The student account for roll '${formData.rollNo}' has already been claimed and activated. Please log in directly.`);
      } else if (
        status === 409 &&
        (message.toLowerCase().includes("email") || message.toLowerCase().includes("in use"))
      ) {
        setErrorType("EMAIL_TAKEN");
        setServerError("This email address is already in use by another account. Please use a different email or log in.");
      } else {
        setErrorType("GENERAL");
        setServerError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDepartment = departments.find((d) => d.id === formData.departmentId);
  const selectedInstitute = institutes.find((i) => i.id === formData.instituteId);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col justify-between select-none">
      {/* 1. Header with Compact Step Indicator */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0a4b32]/10 text-[#0a4b32]">
              <Sparkles className="w-4 h-4 text-[#c48b28]" />
            </span>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-[#0f1f17] tracking-tight leading-tight">
                Claim Student Account
              </h1>
              <p className="text-[11px] text-[#5a6b62]">
                Activate pre-enrolled roll &amp; connect your records
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGuideDrawerOpen(true)}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4f7f5] hover:bg-[#eef7f2] text-[#0a4b32] border border-[#dce3df] inline-flex items-center gap-1 cursor-pointer transition-colors"
              title="View Account Claiming Guide"
            >
              <HelpCircle className="w-3 h-3 text-[#c48b28]" />
              <span>Guide</span>
            </button>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Step {currentStep} of 3
            </span>
          </div>
        </div>

        {/* 3-Step Wizard Navigation Indicator */}
        <div className="bg-white rounded-xl border border-[#e2e8e4] p-2 shadow-2xs">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  currentStep > 1
                    ? "bg-[#0a4b32] text-white"
                    : currentStep === 1
                    ? "bg-[#0a4b32] text-white ring-2 ring-[#0a4b32]/20"
                    : "bg-[#f4f6f5] text-[#5a6b62]"
                }`}
              >
                {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
              </div>
              <span className={`text-[11px] font-bold ${currentStep === 1 ? "text-[#0a4b32]" : "text-[#5a6b62]"}`}>
                Academic
              </span>
            </div>

            <div className={`flex-1 h-0.5 mx-2 transition-colors ${currentStep >= 2 ? "bg-[#0a4b32]" : "bg-[#e2e8e4]"}`} />

            {/* Step 2 */}
            <div
              onClick={() => {
                if (formData.rollNo && formData.departmentId) setCurrentStep(2);
              }}
              className={`flex items-center gap-1.5 ${formData.rollNo ? "cursor-pointer" : "opacity-60"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  currentStep > 2
                    ? "bg-[#0a4b32] text-white"
                    : currentStep === 2
                    ? "bg-[#0a4b32] text-white ring-2 ring-[#0a4b32]/20"
                    : "bg-[#f4f6f5] text-[#5a6b62]"
                }`}
              >
                {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : "2"}
              </div>
              <span className={`text-[11px] font-bold ${currentStep === 2 ? "text-[#0a4b32]" : "text-[#5a6b62]"}`}>
                Security
              </span>
            </div>

            <div className={`flex-1 h-0.5 mx-2 transition-colors ${currentStep >= 3 ? "bg-[#0a4b32]" : "bg-[#e2e8e4]"}`} />

            {/* Step 3 */}
            <div
              onClick={() => {
                if (formData.email && formData.password) setCurrentStep(3);
              }}
              className={`flex items-center gap-1.5 ${formData.password ? "cursor-pointer" : "opacity-60"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  currentStep === 3
                    ? "bg-[#0a4b32] text-white ring-2 ring-[#0a4b32]/20"
                    : "bg-[#f4f6f5] text-[#5a6b62]"
                }`}
              >
                3
              </div>
              <span className={`text-[11px] font-bold ${currentStep === 3 ? "text-[#0a4b32]" : "text-[#5a6b62]"}`}>
                Activate
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="p-3 mb-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2.5 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <p className="font-bold">{successMessage}</p>
            <p className="text-[10px] text-emerald-700">Redirecting to Student Portal...</p>
          </div>
        </div>
      )}

      {/* Error Feedback Banner */}
      {serverError && (
        <div
          className={`p-3 mb-2.5 rounded-xl border text-xs flex flex-col gap-1.5 animate-in fade-in ${
            errorType === "ALREADY_CLAIMED"
              ? "bg-amber-50 border-amber-300 text-amber-950"
              : "bg-red-50 border-red-300 text-red-950"
          }`}
        >
          <div className="flex items-start gap-2">
            <AlertCircle
              className={`w-4 h-4 shrink-0 mt-0.5 ${
                errorType === "ALREADY_CLAIMED" ? "text-amber-600" : "text-red-600"
              }`}
            />
            <div className="leading-snug font-semibold text-[11px] sm:text-xs">{serverError}</div>
          </div>

          {errorType === "ALREADY_CLAIMED" && (
            <div className="pt-1.5 border-t border-amber-200 flex items-center justify-between">
              <span className="text-[10px] text-amber-800">Ready to sign into your account?</span>
              <Link
                href="/login"
                className="text-[11px] font-bold text-white bg-[#0a4b32] hover:bg-[#073825] px-2.5 py-0.5 rounded-md inline-flex items-center gap-1 shadow-2xs"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3 h-3 text-[#c48b28]" />
              </Link>
            </div>
          )}

          {errorType === "EMAIL_TAKEN" && (
            <div className="pt-1.5 border-t border-red-200 flex items-center justify-between">
              <span className="text-[10px] text-red-800">Email already in use?</span>
              <Link
                href="/login"
                className="text-[11px] font-bold text-red-900 underline hover:text-red-700 inline-flex items-center gap-1"
              >
                <span>Sign In Instead</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 2. Step Form Contents: Compact & Zero-Scroll */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* STEP 1: ACADEMIC VERIFICATION */}
        {currentStep === 1 && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#e2e8e4] shadow-xs space-y-2.5 animate-in fade-in duration-200">
            {/* Institute Selection */}
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-[#0f1f17] flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#5a6b62]" />
                <span>Polytechnic Institute *</span>
              </Label>
              <select
                value={formData.instituteId}
                onChange={(e) => handleChange("instituteId", e.target.value)}
                disabled={isSubmitting || loadingInstitutes}
                className="w-full h-8.5 px-2.5 text-xs bg-[#fbfdfc] border border-[#dce3df] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
              >
                {institutes.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Department Selection */}
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-[#0f1f17] flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-[#5a6b62]" />
                <span>Department / Technology *</span>
              </Label>
              <select
                value={formData.departmentId}
                onChange={(e) => handleChange("departmentId", e.target.value)}
                disabled={isSubmitting || loadingDepartments}
                className="w-full h-8.5 px-2.5 text-xs bg-[#fbfdfc] border border-[#dce3df] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Shift & Roll Grid */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {/* Shift Selector */}
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-[#0f1f17]">Academic Shift *</Label>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => handleChange("shift", "FIRST")}
                    className={`h-8 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                      formData.shift === "FIRST"
                        ? "bg-[#0a4b32] text-white border-[#0a4b32]"
                        : "bg-[#fbfdfc] text-[#5a6b62] border-[#dce3df] hover:bg-gray-50"
                    }`}
                  >
                    1st Shift
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("shift", "SECOND")}
                    className={`h-8 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                      formData.shift === "SECOND"
                        ? "bg-[#0a4b32] text-white border-[#0a4b32]"
                        : "bg-[#fbfdfc] text-[#5a6b62] border-[#dce3df] hover:bg-gray-50"
                    }`}
                  >
                    2nd Shift
                  </button>
                </div>
              </div>

              {/* Class Roll Input */}
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-[#0f1f17] flex items-center gap-1">
                  <Hash className="w-3 h-3 text-[#5a6b62]" />
                  <span>Class / Board Roll *</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. 610234"
                  value={formData.rollNo}
                  onChange={(e) => handleChange("rollNo", e.target.value)}
                  className="h-8 text-xs font-bold bg-[#fbfdfc] border-[#dce3df] rounded-lg tracking-wide"
                  required
                />
              </div>
            </div>

            {/* Registration Number (Optional) */}
            <div className="space-y-1">
              <Label className="text-[10px] font-medium text-[#5a6b62] flex items-center justify-between">
                <span>BTEB Registration Number (Optional)</span>
                <span className="text-[9px] text-[#5a6b62]/80">If issued</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g. 1502123456"
                value={formData.registrationNo}
                onChange={(e) => handleChange("registrationNo", e.target.value)}
                className="h-8 text-xs bg-[#fbfdfc] border-[#dce3df] rounded-lg"
              />
            </div>

            {/* Step 1 Actions */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleNextToStep2}
                disabled={isCheckingRoll || !formData.rollNo.trim()}
                className="w-full h-9 bg-[#0a4b32] hover:bg-[#073825] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isCheckingRoll ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c48b28]" />
                    <span>Verifying Roll with Institutional Database...</span>
                  </>
                ) : (
                  <>
                    <span>Next: Set Personal Password</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#c48b28]" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: CREDENTIALS & SECURITY */}
        {currentStep === 2 && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#e2e8e4] shadow-xs space-y-2.5 animate-in fade-in duration-200">
            {/* Full Name & Phone */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-[#0f1f17] flex items-center gap-1">
                  <User className="w-3 h-3 text-[#5a6b62]" />
                  <span>Full Name</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Tanvir Ahmed"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="h-8 text-xs bg-[#fbfdfc] border-[#dce3df] rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-[#0f1f17] flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#5a6b62]" />
                  <span>Phone (Optional)</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="e.g. +88017..."
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="h-8 text-xs bg-[#fbfdfc] border-[#dce3df] rounded-lg"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-[#0f1f17] flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#5a6b62]" />
                <span>Personal Email Address *</span>
              </Label>
              <Input
                type="email"
                placeholder="e.g. tanvir.student@gmail.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="h-8.5 text-xs bg-[#fbfdfc] border-[#dce3df] rounded-lg"
                required
              />
              <p className="text-[10px] text-[#5a6b62]">
                Your permanent login email to access the EduNova portal
              </p>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-[#0f1f17] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#5a6b62]" />
                  <span>Password *</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 chars"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="h-8 text-xs pr-7 bg-[#fbfdfc] border-[#dce3df] rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-[#0f1f17] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#5a6b62]" />
                  <span>Confirm Password *</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className="h-8 text-xs pr-7 bg-[#fbfdfc] border-[#dce3df] rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="pt-2 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="h-9 px-3 rounded-xl border-[#dce3df] text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>Back</span>
              </Button>
              <Button
                type="button"
                onClick={handleNextToStep3}
                disabled={!formData.email.trim() || formData.password.length < 8}
                className="flex-1 h-9 bg-[#0a4b32] hover:bg-[#073825] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Review &amp; Confirm</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#c48b28]" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & ACTIVATE */}
        {currentStep === 3 && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#e2e8e4] shadow-xs space-y-3 animate-in fade-in duration-200">
            {/* Review Summary Card */}
            <div className="rounded-xl bg-[#f8faf9] border border-[#e2e8e4] p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2e8e4]/80">
                <span className="font-bold text-[#0f1f17] flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-[#0a4b32]" />
                  <span>Profile Overview</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {formData.shift === "SECOND" ? "2nd Shift (Day)" : "1st Shift (Morning)"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#5a6b62] block">Class Roll:</span>
                  <span className="font-extrabold text-[#0a4b32] text-sm">{formData.rollNo}</span>
                </div>
                <div>
                  <span className="text-[#5a6b62] block">Technology:</span>
                  <span className="font-semibold text-[#0f1f17] truncate block">
                    {selectedDepartment?.name || "Selected Department"}
                  </span>
                </div>
                <div>
                  <span className="text-[#5a6b62] block">Login Email:</span>
                  <span className="font-semibold text-[#0f1f17] truncate block">{formData.email}</span>
                </div>
                <div>
                  <span className="text-[#5a6b62] block">Institute:</span>
                  <span className="font-semibold text-[#0f1f17] truncate block">
                    {selectedInstitute?.code || "KIPI"}
                  </span>
                </div>
              </div>

              {/* Data Preservation Assurance */}
              <div className="pt-2 border-t border-[#e2e8e4]/80 flex items-center gap-2 text-[10.5px] text-[#0a4b32] bg-emerald-50/70 p-2 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-[#0a4b32] shrink-0" />
                <span>All teacher-entered attendance records and exam marks will be connected.</span>
              </div>
            </div>

            {/* Step 3 Actions */}
            <div className="pt-1 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setCurrentStep(2)}
                className="h-10 px-3.5 rounded-xl border-[#dce3df] text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>Back</span>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-10 bg-[#0a4b32] hover:bg-[#073825] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#c48b28]" />
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#c48b28]" />
                    <span>Claim &amp; Activate Account</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* 3. Footer Switcher Link */}
        <div className="pt-1 text-center text-xs text-[#5a6b62] flex items-center justify-center gap-3">
          <span>Already activated?</span>
          <Link href="/login" className="font-bold text-[#0a4b32] hover:underline">
            Sign In Here
          </Link>
          <span className="text-gray-300">&bull;</span>
          <Link href="/register" className="font-medium text-[#5a6b62] hover:underline text-[11px]">
            Regular Sign Up
          </Link>
        </div>
      </form>

      {/* Public Student Claim Page Guide Drawer */}
      <PageGuideDrawer
        isOpen={isGuideDrawerOpen}
        onClose={() => setIsGuideDrawerOpen(false)}
        pageKey="student-claim"
      />
    </div>
  );
}
