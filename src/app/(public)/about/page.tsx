import React from "react";
import type { Metadata } from "next";
import { aboutService, DEFAULT_ABOUT_DATA } from "@/services/about.service";
import PublicAboutView from "@/components/about/PublicAboutView";

export const metadata: Metadata = {
  title: "About Kishoreganj Government Polytechnic Institute (KIGPI) | bdEduNova",
  description:
    "Explore Kishoreganj Government Polytechnic Institute (KIGPI) — our 4 core engineering departments, BTEB accreditation, foundational mission, vision, and campus facilities.",
};

export const revalidate = 60;

export default async function AboutPage() {
  let about = DEFAULT_ABOUT_DATA;

  try {
    const fetched = await aboutService.getPublicAbout();
    if (fetched && fetched.title) {
      about = fetched;
    }
  } catch {
    about = DEFAULT_ABOUT_DATA;
  }

  return <PublicAboutView about={about} />;
}
