import React from "react";
import type { Metadata } from "next";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import PeopleDirectoryClient from "@/components/people/PeopleDirectoryClient";
import { staffService } from "@/services/staff.service";

export const metadata: Metadata = {
  title: "Leadership & Administration",
  description:
    "Principal, executive administration, and institutional governance at Kishoreganj Polytechnic Institute.",
};

export const revalidate = 60;

export default async function LeadershipPage() {
  const staffResponse = await staffService.getPublicStaff({ limit: 100 });
  const staffList = staffResponse.data || [];

  return (
    <div className="pt-6 sm:pt-8 pb-16 sm:pb-24">
      <Container size="wide">
        <SectionHeading
          badge="Administration"
          title="Leadership &amp; Institutional Governance"
          subtitle="The governing leadership and administrative officers driving institutional management, finance, and student affairs."
          className="mb-5 sm:mb-6"
        />

        <PeopleDirectoryClient initialStaff={staffList} activeCategory="LEADERSHIP" />
      </Container>
    </div>
  );
}
