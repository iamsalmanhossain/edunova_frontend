import React from "react";
import type { Metadata } from "next";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import PeopleDirectoryClient from "@/components/people/PeopleDirectoryClient";
import { staffService } from "@/services/staff.service";

export const metadata: Metadata = {
  title: "People & Staff Directory | Kishoreganj Government Polytechnic Institute",
  description:
    "Complete directory of leadership, academic faculty, administrative officers, and technical personnel at Kishoreganj Government Polytechnic Institute (KIGPI).",
};

export const revalidate = 60; // Revalidate public directory every 60 seconds

export default async function PeoplePage() {
  const staffResponse = await staffService.getPublicStaff({ limit: 100 });
  const staffList = staffResponse.data || [];

  return (
    <div className="pt-6 sm:pt-8 pb-16 sm:pb-24">
      <Container size="wide">
        <SectionHeading
          badge="Institutional Personnel"
          title="Campus Directory &amp; Staff"
          subtitle="Explore the leadership, academic faculty, administrative departments, and technical staff supporting education at Kishoreganj Government Polytechnic Institute (KIGPI)."
          className="mb-5 sm:mb-6"
        />

        <PeopleDirectoryClient initialStaff={staffList} activeCategory="ALL" />
      </Container>
    </div>
  );
}
