"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentHelpDeskProps {
  hodName?: string;
  officeLocation?: string;
  contactEmail?: string;
}

export default function StudentHelpDesk({
  hodName = "Engr. Md. Anisur Rahman",
  officeLocation = "Academic Building A, Level 3",
  contactEmail = "cst@edunova.ac.bd",
}: StudentHelpDeskProps) {
  return (
    <Card className="border-[#e2e8e4] shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-[#0f1f17]">
          Department Help Desk
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-xs space-y-2 text-[#5a6b62]">
        <p>
          <strong className="text-[#0f1f17]">Head of Department:</strong> {hodName}
        </p>
        <p>
          <strong className="text-[#0f1f17]">Campus Office:</strong> {officeLocation}
        </p>
        <p>
          <strong className="text-[#0f1f17]">Inquiry Email:</strong> {contactEmail}
        </p>
      </CardContent>
    </Card>
  );
}

