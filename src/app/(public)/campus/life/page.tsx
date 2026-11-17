import React from "react";
import type { Metadata } from "next";
import CampusLifeClient from "@/components/campus/life/CampusLifeClient";
import { campusService } from "@/services/campus.service";

export const metadata: Metadata = {
  title: "Campus Life & Student Activities | Kishoreganj Government Polytechnic Institute",
  description:
    "Student clubs, robotics society, programming hackathons, athletic tournaments, and leadership development at Kishoreganj Government Polytechnic Institute (KIGPI).",
};

export const revalidate = 60;

export default async function CampusLifePage() {
  const initialCampusLife = await campusService.getCampusLife();

  return <CampusLifeClient initialCampusLife={initialCampusLife} />;
}
