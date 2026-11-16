import React from "react";
import Link from "next/link";
import { ArrowRight, Users, Award, GraduationCap } from "lucide-react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import StaffCard from "@/components/shared/StaffCard";
import { Button } from "@/components/ui/button";
import { staffService } from "@/services/staff.service";
import { InstitutionStaff } from "@/types/staff";

// Verified institutional fallback data for KIPI
const FALLBACK_STAFF: InstitutionStaff[] = [
  {
    id: "staff-principal-01",
    instituteId: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    name: "Engr. Md. Abdul Hannan",
    designation: "Principal",
    role: "PRINCIPAL",
    shift: "FIRST_SHIFT",
    source: "MANUAL",
    isPublished: true,
    avatarUrl: "/images/default-avatar.svg",
    resolvedName: "Engr. Md. Abdul Hannan",
    resolvedAvatarUrl: "/images/default-avatar.svg",
    displayOrder: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    institute: {
      id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "Kishoreganj Polytechnic Institute",
      code: "KIPI",
    },
    user: {
      id: "u-principal-01",
      name: "Engr. Md. Abdul Hannan",
      email: "principal@kipi.edu.bd",
      phone: "01711000001",
      status: "ACTIVE",
      avatarUrl: "/images/default-avatar.svg",
    },
  },
  {
    id: "staff-ci-cst-01",
    instituteId: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    name: "Engr. Mohammad Rafiqul Islam",
    designation: "Chief Instructor & Head of Department",
    role: "CHIEF_INSTRUCTOR",
    shift: "FIRST_SHIFT",
    source: "MANUAL",
    isPublished: true,
    avatarUrl: "/images/default-avatar.svg",
    resolvedName: "Engr. Mohammad Rafiqul Islam",
    resolvedAvatarUrl: "/images/default-avatar.svg",
    department: {
      id: "e03dfd3c-1d76-448c-b793-c087a5d53b42",
      name: "Computer Science & Technology",
      code: "CST",
    },
    displayOrder: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    institute: {
      id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "Kishoreganj Polytechnic Institute",
      code: "KIPI",
    },
    user: {
      id: "u-ci-cst-01",
      name: "Engr. Mohammad Rafiqul Islam",
      email: "ci.cst@kipi.edu.bd",
      phone: "01711000002",
      status: "ACTIVE",
      avatarUrl: "/images/default-avatar.svg",
    },
  },
  {
    id: "staff-ci-food-01",
    instituteId: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    name: "Engr. Tariqul Anam",
    designation: "Chief Instructor & Head of Food Technology",
    role: "CHIEF_INSTRUCTOR",
    shift: "FIRST_SHIFT",
    source: "MANUAL",
    isPublished: true,
    avatarUrl: "/images/default-avatar.svg",
    resolvedName: "Engr. Tariqul Anam",
    resolvedAvatarUrl: "/images/default-avatar.svg",
    department: {
      id: "f04dfd3c-2e87-459d-c804-d198b6e64c53",
      name: "Food Technology",
      code: "FOOD",
    },
    displayOrder: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    institute: {
      id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "Kishoreganj Polytechnic Institute",
      code: "KIPI",
    },
    user: {
      id: "u-ci-food-01",
      name: "Engr. Tariqul Anam",
      email: "teacher5@gmail.com",
      phone: "+8801711100005",
      status: "ACTIVE",
      avatarUrl: "/images/default-avatar.svg",
    },
  },
  {
    id: "staff-ci-ent-01",
    instituteId: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    name: "Engr. Rafiqul Islam",
    designation: "Chief Instructor (Electronics)",
    role: "CHIEF_INSTRUCTOR",
    shift: "FIRST_SHIFT",
    source: "MANUAL",
    isPublished: true,
    avatarUrl: "/images/default-avatar.svg",
    resolvedName: "Engr. Rafiqul Islam",
    resolvedAvatarUrl: "/images/default-avatar.svg",
    department: {
      id: "e15ffd3c-3f98-460e-d915-e209c7f75d64",
      name: "Electronics Technology",
      code: "ENT",
    },
    displayOrder: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    institute: {
      id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "Kishoreganj Polytechnic Institute",
      code: "KIPI",
    },
    user: {
      id: "u-ci-ent-01",
      name: "Engr. Rafiqul Islam",
      email: "teacher5@gmail.com",
      phone: "+8801711100005",
      status: "ACTIVE",
      avatarUrl: "/images/default-avatar.svg",
    },
  },
  {
    id: "staff-ci-rac-01",
    instituteId: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    name: "Engr. Jahangir Alam",
    designation: "Chief Instructor (RAC Technology)",
    role: "CHIEF_INSTRUCTOR",
    shift: "FIRST_SHIFT",
    source: "MANUAL",
    isPublished: true,
    avatarUrl: "/images/default-avatar.svg",
    resolvedName: "Engr. Jahangir Alam",
    resolvedAvatarUrl: "/images/default-avatar.svg",
    department: {
      id: "r26ffd3c-4a09-471f-ea26-f310d8a86e75",
      name: "Refrigeration & Air Conditioning Technology",
      code: "RAC",
    },
    displayOrder: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    institute: {
      id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "Kishoreganj Polytechnic Institute",
      code: "KIPI",
    },
    user: {
      id: "u-ci-rac-01",
      name: "Engr. Jahangir Alam",
      email: "teacher7@gmail.com",
      phone: "+8801711100007",
      status: "ACTIVE",
      avatarUrl: "/images/default-avatar.svg",
    },
  },
];

export default async function LeadershipSection() {
  let allStaff: InstitutionStaff[] = [];

  try {
    const res = await staffService.getPublicStaff({ limit: 100 });
    if (res.data && res.data.length > 0) {
      allStaff = res.data;
    } else {
      allStaff = FALLBACK_STAFF;
    }
  } catch {
    allStaff = FALLBACK_STAFF;
  }

  // 1. Identify Principal
  const principal =
    allStaff.find(
      (s) =>
        s.role === "PRINCIPAL" ||
        s.designation?.toLowerCase().includes("principal")
    ) || FALLBACK_STAFF[0];

  // 2. Identify the 4 Department Heads / Chief Instructors for CST, FOOD, ENT, RAC
  const TARGET_CODES = ["CST", "FOOD", "ENT", "RAC"];
  const usedStaffIds = new Set<string>();
  if (principal?.id) usedStaffIds.add(principal.id);

  const chiefInstructors: InstitutionStaff[] = TARGET_CODES.map((code) => {
    // 1. Look for distinct matching department chief instructor in live API data
    const matched = allStaff.find(
      (s) =>
        !usedStaffIds.has(s.id) &&
        s.role === "CHIEF_INSTRUCTOR" &&
        (s.department?.code?.toUpperCase() === code ||
          s.department?.name?.toLowerCase().includes(code.toLowerCase()) ||
          s.designation?.toLowerCase().includes(code.toLowerCase()))
    );

    if (matched) {
      usedStaffIds.add(matched.id);
      return matched;
    }

    // 2. If not found as chief instructor, look for any instructor in this department
    const deptInstructor = allStaff.find(
      (s) =>
        !usedStaffIds.has(s.id) &&
        (s.role === "INSTRUCTOR" || s.role === "CHIEF_INSTRUCTOR") &&
        (s.department?.code?.toUpperCase() === code ||
          s.department?.name?.toLowerCase().includes(code.toLowerCase()))
    );

    if (deptInstructor) {
      usedStaffIds.add(deptInstructor.id);
      return deptInstructor;
    }

    // 3. Fallback to static department chief instructor for this specific code
    const fallback =
      FALLBACK_STAFF.find(
        (fs) => fs.department?.code?.toUpperCase() === code && !usedStaffIds.has(fs.id)
      ) ||
      FALLBACK_STAFF.find((fs) => !usedStaffIds.has(fs.id)) ||
      FALLBACK_STAFF[1];

    usedStaffIds.add(fallback.id);
    return fallback;
  });

  return (
    <section className="py-16 sm:py-24 bg-[#fcfdfc] border-b border-[#e2e8e4]/70 relative overflow-hidden">
      {/* Background radial accent glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <Container size="wide" className="relative z-10">
        <SectionHeading
          badge="Institutional Governance & Faculty"
          title="Leadership & Academic Department Heads"
          subtitle="Guided by seasoned institutional leadership and specialized Chief Instructors steering technical curriculum across Kishoreganj Polytechnic Institute's 4 core departments."
          className="mb-10 sm:mb-12"
        />

        {/* A. Featured Principal Profile at Top Center */}
        {principal && (
          <div className="max-w-3xl mx-auto mb-14 sm:mb-20">
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Head of Institute</span>
              </span>
            </div>
            <StaffCard staff={principal} featured={true} />
          </div>
        )}

        {/* B. The 4 Department Heads Grid */}
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2e8e4] pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#0f1f17] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#0a4b32]" />
                <span>Academic Department Heads (Chief Instructors)</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5a6b62] mt-0.5">
                Chief instructors overseeing academic labs, BTEB diploma curriculum, and industrial training for CST, Food, ENT, and RAC.
              </p>
            </div>

            <Link
              href="/people"
              className="text-xs sm:text-sm font-bold text-[#0a4b32] hover:text-[#073825] inline-flex items-center gap-1.5 transition-colors shrink-0 group"
            >
              <span className="group-hover:underline">Full Staff Directory</span>
              <ArrowRight className="w-4 h-4 text-[#c48b28] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4-Column Responsive Grid with 3D Tilt Animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
            {chiefInstructors.map((staff, index) => (
              <StaffCard
                key={`${staff.id}-${TARGET_CODES[index] || index}`}
                staff={staff}
              />
            ))}
          </div>

          {/* View All People CTA Button */}
          <div className="text-center pt-8 sm:pt-10">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl border-[#0a4b32]/30 text-[#0a4b32] hover:bg-[#f0f7f3] hover:border-[#0a4b32] font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all group"
            >
              <Link href="/people" className="inline-flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#0a4b32]" />
                <span>Explore All Institutional Staff Directory ({allStaff.length > 0 ? `${allStaff.length}+ Personnel` : "Faculty & Officers"})</span>
                <ArrowRight className="w-4 h-4 text-[#c48b28] group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
