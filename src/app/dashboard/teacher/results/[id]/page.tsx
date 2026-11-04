"use client";

import React from "react";
import { useParams } from "next/navigation";
import ResultMarksheetView from "@/components/dashboard/teacher/results/ResultMarksheetView";

export default function TeacherResultDetailsPage() {
  const params = useParams();
  const resultId = (params?.id as string) || "";

  return <ResultMarksheetView resultId={resultId} />;
}
