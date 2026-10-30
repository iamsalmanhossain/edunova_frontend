import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import ProfileCard from "@/components/shared/ProfileCard";
import { teacherService, VERIFIED_TEACHERS } from "@/services/teacher.service";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Leadership & Administration",
  description:
    "Principal and executive administration at Kishoreganj Polytechnic Institute.",
};

export default async function LeadershipPage() {
  const teachers = await teacherService.getPublicTeachers();
  const leadership = teachers.filter(
    (t) =>
      t.designation?.toLowerCase().includes("principal") ||
      t.designation?.toLowerCase().includes("head")
  );
  const display = leadership.length > 0 ? leadership : [VERIFIED_TEACHERS[0]];

  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <SectionHeading
          badge="Administration"
          title="Leadership &amp; Institutional Governance"
          subtitle="The governing leadership driving academic rigor, administrative efficiency, and student growth."
        />

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <Button asChild size="sm" variant="outline">
            <Link href="/people">All Faculty</Link>
          </Button>
          <Button asChild size="sm" variant="default">
            <Link href="/people/leadership">Leadership &amp; Admin</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/people/department-heads">Department Heads</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/people/faculty-staff">Instructors &amp; Staff</Link>
          </Button>
        </div>

        <div className="space-y-8">
          <ProfileCard teacher={display[0]} featured={true} />
          {display.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              {display.slice(1).map((t) => (
                <ProfileCard key={t.id} teacher={t} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

