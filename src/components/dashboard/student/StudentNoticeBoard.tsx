"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface StudentNoticeItem {
  id: string;
  title: string;
  description: string;
  date?: string;
}

interface StudentNoticeBoardProps {
  notices: StudentNoticeItem[];
}

export default function StudentNoticeBoard({ notices }: StudentNoticeBoardProps) {
  return (
    <Card className="border-[#e2e8e4] shadow-xs bg-[#fbfcfb]">
      <CardHeader className="pb-2 border-b border-[#e2e8e4]/60">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#c48b28]">
          <AlertCircle className="w-4 h-4" />
          <span>Academic Examination Notices</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {notices.map((notice) => (
          <div key={notice.id} className="p-3 rounded-lg bg-white border border-[#e2e8e4] text-xs">
            <p className="font-bold text-[#0f1f17]">{notice.title}</p>
            <p className="text-[#5a6b62] text-[11px] mt-1">{notice.description}</p>
            {notice.date && (
              <span className="text-[10px] text-[#c48b28] font-semibold mt-1.5 block">
                {notice.date}
              </span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

