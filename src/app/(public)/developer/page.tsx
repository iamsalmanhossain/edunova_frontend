import React from "react";
import type { Metadata } from "next";
import { developerService } from "@/services/developer.service";
import PublicDeveloperClient from "@/components/developer/PublicDeveloperClient";

export const metadata: Metadata = {
  title: "Platform Architect & Lead Developer — Md Salman Hossain | EduNova",
  description:
    "Learn about Md Salman Hossain, the Full Stack Developer and Systems Architect who engineered the EduNova Digital Campus Platform for polytechnic institutes.",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function DeveloperPage() {
  const initialProfile = await developerService.getDeveloper();

  return <PublicDeveloperClient initialProfile={initialProfile} />;
}
