import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import ProfileCard from "@/components/shared/ProfileCard";
import { teacherService, VERIFIED_TEACHERS } from "@/services/teacher.service";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Department Heads",
  description:
    "Chief instructors and department heads overseeing academic programs at Kishoreganj Polytechnic Institute.",
};

export default async function DepartmentHeadsPage() {
  const teachers = await teacherService.getPublicTeachers();
  const deptHeads = teachers.filter((t) =>
    t.designation?.toLowerCase().includes("head") ||
    t.designation?.toLowerCase().includes("chief")
  );
  const display = deptHeads.length > 0 ? deptHeads : [VERIFIED_TEACHERS[1]];

  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <SectionHeading
          badge="Academic Steering"
          title="Department Heads &amp; Chief Instructors"
          subtitle="Experienced senior engineers leading educational planning, technical labs, and departmental examinations."
        />

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <Button asChild size="sm" variant="outline">
            <Link href="/people">All Faculty</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/people/leadership">Leadership &amp; Admin</Link>
          </Button>
          <Button asChild size="sm" variant="default">
            <Link href="/people/department-heads">Department Heads</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/people/faculty-staff">Instructors &amp; Staff</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {display.map((t) => (
            <ProfileCard key={t.id} teacher={t} />
          ))}
        </div>
      </Container>
    </div>
  );
}

