"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Loader2,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Clock,
  FileCheck2,
  Check,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/auth.service";
import { instituteService, VERIFIED_INSTITUTES } from "@/services/institute.service";
import { departmentService, VERIFIED_DEPARTMENTS } from "@/services/department.service";
import { Institute } from "@/types/institute";
import { Department } from "@/types/department";

// Preset verified UUID matching user specifications
const TARGET_INSTITUTE_ID = "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b";

interface RegisterDraft {
  currentStep?: 1 | 2 | 3;
  role?: "student" | "teacher";
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  instituteId?: string;
  departmentId?: string;
  shift?: "FIRST_SHIFT" | "SECOND_SHIFT";
  rollNo?: string;
  registrationNo?: string;
  semester?: number;
  session?: string;
  designation?: string;
  qualification?: string;
}

const getStoredDraft = (): RegisterDraft | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("edunova_register_draft");
    return raw ? (JSON.parse(raw) as RegisterDraft) : null;
  } catch {
    return null;
  }
};

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps = {}) {
  const router = useRouter();

  // Wizard Step initialized from stored session draft
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(() => {
    const draft = getStoredDraft();
    return draft?.currentStep && [1, 2, 3].includes(draft.currentStep)
      ? (draft.currentStep as 1 | 2 | 3)
      : 1;
  });

  // Role Selection initialized from stored session draft
  const [role, setRole] = useState<"student" | "teacher">(() => {
    return getStoredDraft()?.role === "teacher" ? "teacher" : "student";
  });

  // Form State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dynamic Institutes & Departments
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingInstitutes, setLoadingInstitutes] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Step 1: Personal & Account (Hydrated from draft if user reloads)
  const [name, setName] = useState<string>(() => getStoredDraft()?.name || "");
  const [email, setEmail] = useState<string>(() => getStoredDraft()?.email || "");
  const [password, setPassword] = useState<string>(() => getStoredDraft()?.password || "");
  const [phone, setPhone] = useState<string>(() => getStoredDraft()?.phone || "");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">(
    () => getStoredDraft()?.gender || "MALE"
  );

  // Step 2: Campus & Shift (No hardcoded defaults; hydrated from draft if exists)
  const [instituteId, setInstituteId] = useState<string>(
    () => getStoredDraft()?.instituteId || ""
  );
  const [departmentId, setDepartmentId] = useState<string>(
    () => getStoredDraft()?.departmentId || ""
  );
  const [shift, setShift] = useState<"FIRST_SHIFT" | "SECOND_SHIFT">(
    () => getStoredDraft()?.shift || "FIRST_SHIFT"
  );

  // Step 3 (Student specific)
  const [rollNo, setRollNo] = useState<string>(() => getStoredDraft()?.rollNo || "");
  const [registrationNo, setRegistrationNo] = useState<string>(
    () => getStoredDraft()?.registrationNo || ""
  );
  const [semester, setSemester] = useState<number>(
    () => getStoredDraft()?.semester ?? 4
  );
  const [session, setSession] = useState<string>(
    () => getStoredDraft()?.session || ""
  );

  // Step 3 (Teacher specific)
  const [designation, setDesignation] = useState<string>(
    () => getStoredDraft()?.designation || "Senior Instructor"
  );
  const [qualification, setQualification] = useState<string>(
    () => getStoredDraft()?.qualification || "B.Sc. in Computer Science & Engineering"
  );

  // Load Institutes (and restored institute's departments) on component mount
  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      try {
        setLoadingInstitutes(true);
        const list = await instituteService.getInstitutes();
        if (isMounted) {
          setInstitutes(list || []);
        }

        const draft = getStoredDraft();
        if (draft?.instituteId) {
          setLoadingDepartments(true);
          const deptList = await departmentService.getDepartments(draft.instituteId);
          if (isMounted) {
            setDepartments(deptList || []);
          }
        }
      } catch (err) {
        console.error("Failed to load initial registration data:", err);
        if (isMounted) {
          setInstitutes(VERIFIED_INSTITUTES);
        }
      } finally {
        if (isMounted) {
          setLoadingInstitutes(false);
          setLoadingDepartments(false);
        }
      }
    }
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Persist draft to sessionStorage whenever any input or step changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const draft: RegisterDraft = {
        currentStep,
        role,
        name,
        email,
        password,
        phone,
        gender,
        instituteId,
        departmentId,
        shift,
        rollNo,
        registrationNo,
        semester,
        session,
        designation,
        qualification,
      };
      sessionStorage.setItem("edunova_register_draft", JSON.stringify(draft));
    } catch {
      // Ignore quota errors
    }
  }, [
    currentStep,
    role,
    name,
    email,
    password,
    phone,
    gender,
    instituteId,
    departmentId,
    shift,
    rollNo,
    registrationNo,
    semester,
    session,
    designation,
    qualification,
  ]);

  // Clear draft function
  // Clear form handler
  const handleClearDraft = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("edunova_register_draft");
    }
    setCurrentStep(1);
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setGender("MALE");
    setInstituteId("");
    setDepartmentId("");
    setDepartments([]);
    setShift("FIRST_SHIFT");
    setRollNo("");
    setRegistrationNo("");
    setSemester(4);
    setSession("");
    setDesignation("Senior Instructor");
    setQualification("B.Sc. in Computer Science & Engineering");
    setError(null);
    setSuccess(null);
  };

  // When institute selection changes, fetch that institute's departments from backend
  const handleInstituteChange = async (selectedId: string) => {
    setInstituteId(selectedId);
    setDepartmentId("");
    setDepartments([]);
    setError(null);

    if (!selectedId) return;

    try {
      setLoadingDepartments(true);
      const list = await departmentService.getDepartments(selectedId);
      setDepartments(list || []);
    } catch (err) {
      console.error("Failed to fetch departments for institute:", err);
      if (selectedId === TARGET_INSTITUTE_ID) {
        setDepartments(VERIFIED_DEPARTMENTS);
      } else {
        setDepartments([]);
      }
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!name.trim()) {
      setError("Please enter your full official name.");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return false;
    }
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setError(
        "Password must contain at least 8 characters with at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol (e.g. SecurePass123!@#)."
      );
      return false;
    }
    setError(null);
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!instituteId) {
      setError("Please select an academic institute.");
      return false;
    }
    if (!departmentId) {
      setError("Please select your academic department.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    setError(null);
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
  };

  // Final Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateStep1() || !validateStep2()) return;

    if (role === "student" && !rollNo.trim()) {
      setError("Student Roll Number is required.");
      return;
    }

    if (role === "student" && session.trim()) {
      const sessionPattern = /^\d{4}-\d{4}$/;
      if (!sessionPattern.test(session.trim())) {
        setError("Academic session must follow the YYYY-YYYY format (e.g. 2022-2023 or 2023-2024).");
        return;
      }
    }

    try {
      setLoading(true);

      if (role === "student") {
        const studentPayload = {
          name: name.trim(),
          email: email.trim(),
          password,
          instituteId,
          departmentId,
          shift,
          semester: Number(semester),
          rollNo: rollNo.trim(),
          registrationNo: registrationNo.trim() || undefined,
          session: session.trim() || undefined,
          phone: phone.trim() || undefined,
          gender,
        };

        const res = await authService.registerStudent(studentPayload);
        if (res.success || res.message) {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("edunova_register_draft");
          }
          setSuccess(
            res.message ||
              "Student registration submitted successfully! Redirecting to email verification..."
          );
          setTimeout(() => {
            router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
          }, 1800);
        }
      } else {
        const teacherPayload = {
          name: name.trim(),
          email: email.trim(),
          password,
          instituteId,
          departmentId,
          shift,
          designation: designation.trim() || undefined,
          qualification: qualification.trim() || undefined,
          phone: phone.trim() || undefined,
          gender,
        };

        const res = await authService.registerTeacher(teacherPayload);
        if (res.success || res.message) {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("edunova_register_draft");
          }
          setSuccess(
            res.message ||
              "Teacher registration submitted successfully! Pending administrator approval."
          );
          setTimeout(() => router.push("/login"), 2500);
        }
      }
    } catch (err: unknown) {
      let msg =
        "Registration request failed. Please verify email or roll number is not already registered.";
      if (err && typeof err === "object") {
        const errObj = err as {
          message?: string | string[];
          response?: { data?: { message?: string | string[] } };
        };
        const rawMsg = errObj.response?.data?.message || errObj.message;
        if (rawMsg) {
          msg = Array.isArray(rawMsg) ? rawMsg.join(", ") : rawMsg;
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 no-scrollbar">
      {/* Step Indicator Header */}
      <div className="bg-white rounded-lg border border-[#e2e8e4] p-2.5 sm:p-3 shadow-xs">
        <div className="flex items-center justify-between">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                currentStep > 1
                  ? "bg-[#0a4b32] text-white"
                  : currentStep === 1
                  ? "bg-[#0a4b32] text-white ring-2 ring-[#0a4b32]/20"
                  : "bg-[#f4f6f5] text-[#5a6b62]"
              }`}
            >
              {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-medium text-[#5a6b62] uppercase leading-tight">Step 1</p>
              <p className="text-xs font-bold text-[#0f1f17] leading-tight">Identity</p>
            </div>
          </div>

          <div
            className={`flex-1 h-0.5 mx-2 sm:mx-3 transition-colors ${
              currentStep >= 2 ? "bg-[#0a4b32]" : "bg-[#e2e8e4]"
            }`}
          />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                currentStep > 2
                  ? "bg-[#0a4b32] text-white"
                  : currentStep === 2
                  ? "bg-[#0a4b32] text-white ring-2 ring-[#0a4b32]/20"
                  : "bg-[#f4f6f5] text-[#5a6b62]"
              }`}
            >
              {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : "2"}
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-medium text-[#5a6b62] uppercase leading-tight">Step 2</p>
              <p className="text-xs font-bold text-[#0f1f17] leading-tight">Campus</p>
            </div>
          </div>

          <div
            className={`flex-1 h-0.5 mx-2 sm:mx-3 transition-colors ${
              currentStep >= 3 ? "bg-[#0a4b32]" : "bg-[#e2e8e4]"
            }`}
          />

          {/* Step 3 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                currentStep === 3
                  ? "bg-[#0a4b32] text-white ring-2 ring-[#0a4b32]/20"
                  : "bg-[#f4f6f5] text-[#5a6b62]"
              }`}
            >
              3
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-medium text-[#5a6b62] uppercase leading-tight">Step 3</p>
              <p className="text-xs font-bold text-[#0f1f17] leading-tight">Profile</p>
            </div>
          </div>

          {/* Reset / Clear Draft Button (visible if user has filled anything) */}
          {(name || email || instituteId || currentStep > 1) && (
            <button
              type="button"
              onClick={handleClearDraft}
              title="Reset form"
              className="ml-1 p-1 rounded-md hover:bg-red-50 text-[#5a6b62] hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Error / Success Notifications */}
      {error && (
        <Alert variant="destructive" className="py-2 text-xs">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <AlertDescription className="text-xs font-medium">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="py-2 text-xs">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <AlertDescription className="text-xs font-medium">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* ================= STEP 1: IDENTITY & ROLE ================= */}
        {currentStep === 1 && (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            {/* Role Selection Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`p-2 rounded-lg border-2 text-left transition-all flex items-center gap-2 ${
                  role === "student"
                    ? "border-[#0a4b32] bg-[#f0f7f3]"
                    : "border-[#e2e8e4] bg-white hover:border-[#0a4b32]/40"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center ${
                    role === "student"
                      ? "bg-[#0a4b32] text-white"
                      : "bg-[#f4f6f5] text-[#5a6b62]"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0f1f17]">Student</p>
                  <p className="text-[10px] text-[#5a6b62]">Enrollment</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`p-2 rounded-lg border-2 text-left transition-all flex items-center gap-2 ${
                  role === "teacher"
                    ? "border-[#0a4b32] bg-[#f0f7f3]"
                    : "border-[#e2e8e4] bg-white hover:border-[#0a4b32]/40"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center ${
                    role === "teacher"
                      ? "bg-[#0a4b32] text-white"
                      : "bg-[#f4f6f5] text-[#5a6b62]"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0f1f17]">Teacher</p>
                  <p className="text-[10px] text-[#5a6b62]">Faculty</p>
                </div>
              </button>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="reg-name" className="text-xs font-semibold text-[#0f1f17]">
                Full Name *
              </Label>
              <div className="relative">
                <Input
                  id="reg-name"
                  type="text"
                  placeholder={role === "student" ? "e.g. Tanvir Ahmed" : "e.g. Engr. Rafiqul Islam"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                  className="h-9 pl-8 text-xs sm:text-sm bg-white"
                />
                <User className="w-3.5 h-3.5 text-[#5a6b62] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <Label htmlFor="reg-email" className="text-xs font-semibold text-[#0f1f17]">
                Email Address *
              </Label>
              <div className="relative">
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="e.g. name@edunova.ac.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="h-9 pl-8 text-xs sm:text-sm bg-white"
                />
                <Mail className="w-3.5 h-3.5 text-[#5a6b62] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="reg-password" className="text-xs font-semibold text-[#0f1f17]">
                  Password *
                </Label>
                <span className="text-[10px] text-[#5a6b62]">Min 8 chars</span>
              </div>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="h-9 pl-8 pr-8 text-xs sm:text-sm bg-white"
                />
                <Lock className="w-3.5 h-3.5 text-[#5a6b62] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5a6b62] hover:text-[#0f1f17] p-0.5"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Phone & Gender */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="reg-phone" className="text-xs font-semibold text-[#0f1f17]">
                  Phone
                </Label>
                <div className="relative">
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="018..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    className="h-9 pl-8 text-xs sm:text-sm bg-white"
                  />
                  <Phone className="w-3.5 h-3.5 text-[#5a6b62] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-gender" className="text-xs font-semibold text-[#0f1f17]">
                  Gender
                </Label>
                <select
                  id="reg-gender"
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value as "MALE" | "FEMALE" | "OTHER")
                  }
                  disabled={loading}
                  className="w-full h-9 px-2.5 rounded-md border border-[#dce3df] bg-white text-xs text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32]"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            {/* Step 1 Actions */}
            <Button
              type="button"
              onClick={handleNext}
              className="w-full h-9.5 bg-[#0a4b32] hover:bg-[#073825] text-white font-semibold text-xs shadow-xs mt-2"
            >
              <span>Continue to Campus Details</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        )}

        {/* ================= STEP 2: CAMPUS & SHIFT ================= */}
        {currentStep === 2 && (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            {/* Institute Select */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="reg-inst" className="text-xs font-semibold text-[#0f1f17]">
                  Academic Institute *
                </Label>
                {loadingInstitutes && (
                  <span className="text-[10px] text-[#0a4b32] flex items-center gap-1 font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" /> Loading institutes...
                  </span>
                )}
              </div>
              <div className="relative">
                <select
                  id="reg-inst"
                  value={instituteId}
                  onChange={(e) => handleInstituteChange(e.target.value)}
                  disabled={loading || loadingInstitutes}
                  className="w-full h-9.5 pl-8 pr-2.5 rounded-md border border-[#dce3df] bg-white text-xs text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] disabled:bg-[#f4f6f5] disabled:text-[#8a9b92]"
                >
                  <option value="">-- Select an Academic Institute * --</option>
                  {institutes.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} {inst.code ? `(${inst.code})` : ""}
                    </option>
                  ))}
                </select>
                <Building2 className="w-3.5 h-3.5 text-[#5a6b62] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Department Select */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="reg-dept" className="text-xs font-semibold text-[#0f1f17]">
                  Department / Program *
                </Label>
                {loadingDepartments && (
                  <span className="text-[10px] text-[#0a4b32] flex items-center gap-1 font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" /> Loading departments...
                  </span>
                )}
              </div>
              <div className="relative">
                <select
                  id="reg-dept"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  disabled={loading || !instituteId || loadingDepartments}
                  className="w-full h-9.5 pl-8 pr-2.5 rounded-md border border-[#dce3df] bg-white text-xs text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] disabled:bg-[#f4f6f5] disabled:text-[#8a9b92] disabled:cursor-not-allowed"
                >
                  {!instituteId ? (
                    <option value="">-- Please select an institute first --</option>
                  ) : loadingDepartments ? (
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
                {loadingDepartments ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#0a4b32] animate-spin absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5 text-[#5a6b62] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>
              {!instituteId && (
                <p className="text-[10px] text-[#5a6b62]">
                  Select an academic institute above to load its offered departments.
                </p>
              )}
            </div>

            {/* Shift Selection */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#0f1f17]">
                Academic Shift *
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShift("FIRST_SHIFT")}
                  className={`p-2 rounded-md border-2 text-left transition-all flex items-center gap-2 ${
                    shift === "FIRST_SHIFT"
                      ? "border-[#0a4b32] bg-[#f0f7f3] text-[#0a4b32]"
                      : "border-[#e2e8e4] bg-white text-[#5a6b62] hover:border-[#0a4b32]/40"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#0f1f17]">First Shift</p>
                    <p className="text-[10px] text-[#5a6b62]">Morning Schedule</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setShift("SECOND_SHIFT")}
                  className={`p-2 rounded-md border-2 text-left transition-all flex items-center gap-2 ${
                    shift === "SECOND_SHIFT"
                      ? "border-[#0a4b32] bg-[#f0f7f3] text-[#0a4b32]"
                      : "border-[#e2e8e4] bg-white text-[#5a6b62] hover:border-[#0a4b32]/40"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#0f1f17]">Second Shift</p>
                    <p className="text-[10px] text-[#5a6b62]">Afternoon Schedule</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                className="w-1/3 h-9.5 border-[#dce3df] text-[#0f1f17] text-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="w-2/3 h-9.5 bg-[#0a4b32] hover:bg-[#073825] text-white font-semibold text-xs cursor-pointer shadow-xs"
              >
                <span>Continue to Profile</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: ACADEMIC / PROFILE DETAILS ================= */}
        {currentStep === 3 && (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            {role === "student" ? (
              <div className="p-2.5 rounded-lg border border-[#e2e8e4] bg-[#f9fbf9] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="reg-roll" className="text-[11px] font-semibold text-[#0f1f17]">
                      Roll Number *
                    </Label>
                    <Input
                      id="reg-roll"
                      type="text"
                      placeholder="e.g. 619820"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      disabled={loading}
                      required
                      className="h-8.5 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="reg-regno" className="text-[11px] font-semibold text-[#0f1f17]">
                      Registration No
                    </Label>
                    <Input
                      id="reg-regno"
                      type="text"
                      placeholder="e.g. 1502123456"
                      value={registrationNo}
                      onChange={(e) => setRegistrationNo(e.target.value)}
                      disabled={loading}
                      className="h-8.5 text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="reg-sem" className="text-[11px] font-semibold text-[#0f1f17]">
                      Semester *
                    </Label>
                    <select
                      id="reg-sem"
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      disabled={loading}
                      className="w-full h-8.5 px-2 rounded-md border border-[#dce3df] bg-white text-xs text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Semester {s} ({s === 1 ? "1st" : s === 2 ? "2nd" : s === 3 ? "3rd" : `${s}th`})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reg-session" className="text-[11px] font-semibold text-[#0f1f17]">
                        Academic Session
                      </Label>
                      <span className="text-[9px] text-[#0a4b32] font-semibold">Format: YYYY-YYYY</span>
                    </div>
                    <Input
                      id="reg-session"
                      type="text"
                      placeholder="e.g. 2022-2023"
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                      disabled={loading}
                      maxLength={15}
                      className="h-8.5 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg border border-[#e2e8e4] bg-[#f9fbf9] space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="reg-designation" className="text-[11px] font-semibold text-[#0f1f17]">
                    Designation *
                  </Label>
                  <Input
                    id="reg-designation"
                    type="text"
                    placeholder="e.g. Senior Instructor"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    disabled={loading}
                    className="h-8.5 text-xs bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="reg-qualification" className="text-[11px] font-semibold text-[#0f1f17]">
                    Academic Qualification
                  </Label>
                  <Input
                    id="reg-qualification"
                    type="text"
                    placeholder="e.g. B.Sc. in CSE"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    disabled={loading}
                    className="h-8.5 text-xs bg-white"
                  />
                </div>
              </div>
            )}

            {/* Quick Summary Pill */}
            <div className="bg-[#f0f7f3]/70 rounded-md border border-[#dce3df] p-2 text-[11px] flex items-center justify-between text-[#0f1f17]">
              <div className="flex items-center gap-1.5 font-medium">
                <FileCheck2 className="w-3.5 h-3.5 text-[#0a4b32]" />
                <span>{name || "User"}</span>
                <span className="text-[#5a6b62]">• {role}</span>
              </div>
              <span className="text-[#0a4b32] font-semibold">{shift}</span>
            </div>

            {/* Step 3 Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={loading}
                className="w-1/3 h-9.5 border-[#dce3df] text-[#0f1f17] text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="w-2/3 h-9.5 bg-[#0a4b32] hover:bg-[#073825] text-white font-semibold text-xs shadow-xs"
              >
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Registering...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Complete Registration</span>
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Login Link */}
        <div className="pt-1 text-center">
          <p className="text-[11px] text-[#5a6b62]">
            Already have an active account?{" "}
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-bold text-[#0a4b32] hover:underline cursor-pointer transition-colors"
              >
                Sign In to Portal
              </button>
            ) : (
              <Link
                href="/login"
                className="font-bold text-[#0a4b32] hover:underline"
              >
                Sign In to Portal
              </Link>
            )}
          </p>
        </div>
      </form>
    </div>
  );
}
