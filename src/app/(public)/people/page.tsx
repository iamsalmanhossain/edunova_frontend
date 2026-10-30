import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import ProfileCard from "@/components/shared/ProfileCard";
import { teacherService, VERIFIED_TEACHERS } from "@/services/teacher.service";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "People & Faculty Directory",
  description:
    "Institutional faculty directory, principal leadership, and instructors at Kishoreganj Polytechnic Institute.",
};

export default async function PeoplePage() {
  const teachers = await teacherService.getPublicTeachers();
  const displayTeachers = teachers.length > 0 ? teachers : VERIFIED_TEACHERS;

  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <SectionHeading
          badge="Faculty & Leadership"
          title="Institutional Directory"
          subtitle="Meet the principal, chief instructors, and dedicated technical educators leading Kishoreganj Polytechnic Institute."
        />

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <Button asChild size="sm" variant="default">
            <Link href="/people">All Faculty ({displayTeachers.length})</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/people/leadership">Leadership &amp; Admin</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/people/department-heads">Department Heads</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/people/faculty-staff">Instructors &amp; Staff</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayTeachers.map((t) => (
            <ProfileCard key={t.id} teacher={t} />
          ))}
        </div>
      </Container>
    </div>
  );
}

