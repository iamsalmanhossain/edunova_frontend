import React from "react";
import type { Metadata } from "next";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import PeopleDirectoryClient from "@/components/people/PeopleDirectoryClient";
import { staffService } from "@/services/staff.service";

export const metadata: Metadata = {
  title: "Department Heads & Chief Instructors",
  description:
    "Chief instructors and departmental heads steering academic curriculum at Kishoreganj Government Polytechnic Institute (KIGPI).",
};

export const revalidate = 60;

export default async function DepartmentHeadsPage() {
  const staffResponse = await staffService.getPublicStaff({
    role: "CHIEF_INSTRUCTOR",
    limit: 100,
  });
  const staffList = staffResponse.data || [];

  return (
    <div className="pt-6 sm:pt-8 pb-16 sm:pb-24">
      <Container size="wide">
        <SectionHeading
          badge="Academic Steering"
          title="Department Heads &amp; Chief Instructors"
          subtitle="Experienced chief instructors leading educational planning, technical labs, and departmental examinations."
          className="mb-5 sm:mb-6"
        />

        <PeopleDirectoryClient initialStaff={staffList} activeCategory="FACULTY" />
      </Container>
    </div>
  );
}
