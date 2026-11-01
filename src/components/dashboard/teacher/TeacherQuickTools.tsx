"use client";

import React from "react";
import { FileSpreadsheet, ClipboardList, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TeacherQuickTools() {
  return (
    <Card className="border-[#e2e8e4] shadow-xs bg-[#fbfcfb]">
      <CardHeader className="pb-2 border-b border-[#e2e8e4]/60">
        <CardTitle className="text-sm font-bold text-[#0f1f17]">
          Faculty Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start text-xs h-9 border-[#dce3df] text-[#0f1f17] hover:border-[#0a4b32] hover:text-[#0a4b32] cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2 text-[#0a4b32]" />
          Export Attendance Sheet (Excel)
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-xs h-9 border-[#dce3df] text-[#0f1f17] hover:border-[#0a4b32] hover:text-[#0a4b32] cursor-pointer"
        >
          <ClipboardList className="w-4 h-4 mr-2 text-[#0a4b32]" />
          Input Continuous Assessment
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-xs h-9 border-[#dce3df] text-[#0f1f17] hover:border-[#0a4b32] hover:text-[#0a4b32] cursor-pointer"
        >
          <Upload className="w-4 h-4 mr-2 text-[#0a4b32]" />
          Distribute Lecture Slides
        </Button>
      </CardContent>
    </Card>
  );
}

