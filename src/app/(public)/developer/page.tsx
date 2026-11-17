import React from "react";
import type { Metadata } from "next";
import { developerService } from "@/services/developer.service";
import PublicDeveloperClient from "@/components/developer/PublicDeveloperClient";

export const metadata: Metadata = {
  title: "Platform Architect & Lead Developer — Md Salman Hossain | bdEduNova",
  description:
    "Learn about Md Salman Hossain, the Full Stack Developer and Systems Architect who engineered the bdEduNova Digital Campus Platform for Kishoreganj Government Polytechnic Institute (KIGPI).",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function DeveloperPage() {
  const initialProfile = await developerService.getDeveloper();

  return <PublicDeveloperClient initialProfile={initialProfile} />;
}
