import React from "react";
import type { Metadata } from "next";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import PeopleDirectoryClient from "@/components/people/PeopleDirectoryClient";
import { staffService } from "@/services/staff.service";

export const metadata: Metadata = {
  title: "People & Staff Directory | Kishoreganj Polytechnic Institute",
  description:
    "Complete directory of leadership, academic faculty, administrative officers, and technical personnel at Kishoreganj Polytechnic Institute.",
};

export const revalidate = 60; // Revalidate public directory every 60 seconds

export default async function PeoplePage() {
  const staffResponse = await staffService.getPublicStaff({ limit: 100 });
  const staffList = staffResponse.data || [];

  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <SectionHeading
          badge="Institutional Personnel"
          title="Campus Directory &amp; Staff"
          subtitle="Explore the leadership, academic faculty, administrative departments, and technical staff supporting education at Kishoreganj Polytechnic Institute."
        />

        <PeopleDirectoryClient initialStaff={staffList} activeCategory="ALL" />
      </Container>
    </div>
  );
}
