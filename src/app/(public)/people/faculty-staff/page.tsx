import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import ProfileCard from "@/components/shared/ProfileCard";
import { teacherService, VERIFIED_TEACHERS } from "@/services/teacher.service";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Faculty & Technical Staff",
  description:
    "Instructors, lab demonstrators, and academic mentors at Kishoreganj Polytechnic Institute.",
};

export default async function FacultyStaffPage() {
  const teachers = await teacherService.getPublicTeachers();
  const staff = teachers.filter(
    (t) => !t.designation?.toLowerCase().includes("principal")
  );
  const display = staff.length > 0 ? staff : VERIFIED_TEACHERS.slice(1);

  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <SectionHeading
          badge="Faculty Directory"
          title="Instructors &amp; Laboratory Staff"
          subtitle="Dedicated instructors conducting theory lectures, laboratory experiments, and technical mentorship."
        />

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <Button asChild size="sm" variant="outline">
            <Link href="/people">All Faculty</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/people/leadership">Leadership &amp; Admin</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/people/department-heads">Department Heads</Link>
          </Button>
          <Button asChild size="sm" variant="default">
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

