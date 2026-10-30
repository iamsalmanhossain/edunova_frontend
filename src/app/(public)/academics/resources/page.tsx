import React from "react";
import type { Metadata } from "next";
import { Download } from "lucide-react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Academic Resources & Downloads",
  description:
    "Curriculum documents, official course syllabi, and lab manuals at Kishoreganj Polytechnic Institute.",
};

const RESOURCES = [
  {
    title: "BTEB 2022 Probidhan Curriculum",
    category: "Syllabus Framework",
    format: "PDF",
    size: "4.2 MB",
    description: "Complete course structures for 1st through 8th semester diploma engineering.",
  },
  {
    title: "Computer Science (CST) Lab Manuals",
    category: "Laboratory Guides",
    format: "PDF",
    size: "8.5 MB",
    description: "Programming in Python, Data Structures, and DBMS practical assignment manuals.",
  },
  {
    title: "Electrical Technology Lab Standards",
    category: "Laboratory Guides",
    format: "PDF",
    size: "6.1 MB",
    description: "Circuit wiring, machine connections, and safety protocols for power workshops.",
  },
  {
    title: "Academic Routine & Class Format",
    category: "Administrative Forms",
    format: "PDF",
    size: "1.8 MB",
    description: "Standard daily period timetable format for 1st and 2nd shift sessions.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <SectionHeading
          badge="Downloads & Curricula"
          title="Academic Resources &amp; Syllabi"
          subtitle="Access verified syllabus guidelines, practical laboratory workbooks, and official academic documentation."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {RESOURCES.map((res, i) => (
            <Card key={i} className="border border-[#e2e8e4] p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0a4b32]">
                    {res.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#f0f7f3] text-[#0a4b32] font-semibold">
                    {res.format} • {res.size}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0f1f17]">{res.title}</h3>
                <p className="text-xs sm:text-sm text-[#5a6b62] leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#e2e8e4] flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#0a4b32]/30 text-[#0a4b32] hover:bg-[#f0f7f3] text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Download Document</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
