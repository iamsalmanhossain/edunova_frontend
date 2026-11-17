import React from "react";
import type { Metadata } from "next";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import PeopleDirectoryClient from "@/components/people/PeopleDirectoryClient";
import { staffService } from "@/services/staff.service";

export const metadata: Metadata = {
  title: "Instructors & Technical Staff",
  description:
    "Instructors, lab demonstrators, and technical mentors at Kishoreganj Government Polytechnic Institute (KIGPI).",
};

export const revalidate = 60;

export default async function FacultyStaffPage() {
  const staffResponse = await staffService.getPublicStaff({ limit: 100 });
  const staffList = staffResponse.data || [];

  return (
    <div className="pt-6 sm:pt-8 pb-16 sm:pb-24">
      <Container size="wide">
        <SectionHeading
          badge="Faculty Directory"
          title="Instructors &amp; Laboratory Staff"
          subtitle="Dedicated instructors conducting theory lectures, laboratory experiments, and technical mentorship."
          className="mb-5 sm:mb-6"
        />

        <PeopleDirectoryClient initialStaff={staffList} activeCategory="FACULTY" />
      </Container>
    </div>
  );
}
