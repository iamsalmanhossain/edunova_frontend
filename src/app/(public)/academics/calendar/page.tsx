import React from "react";
import type { Metadata } from "next";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Academic Calendar",
  description:
    "Official academic year calendar, semester terms, and examination dates at Kishoreganj Polytechnic Institute.",
};

const TERMS = [
  {
    semester: "Odd Semesters (1st, 3rd, 5th, 7th)",
    duration: "July — December",
    events: [
      { date: "July 01", title: "Semester Orientation & Commencement of Classes" },
      { date: "September 15 - 22", title: "Mid-Term Examinations" },
      { date: "November 20 - 30", title: "Final Practical & Laboratory Assessments" },
      { date: "December 10 - 24", title: "BTEB Board Final Theory Examinations" },
    ],
  },
  {
    semester: "Even Semesters (2nd, 4th, 6th)",
    duration: "January — June",
    events: [
      { date: "January 05", title: "Semester Registration & Theory Start" },
      { date: "March 18 - 25", title: "Mid-Term Written Evaluations" },
      { date: "May 15 - 25", title: "Final Lab Submissions & Project Defense" },
      { date: "June 05 - 20", title: "BTEB Board Final Examinations" },
    ],
  },
];

export default function CalendarPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <SectionHeading
          badge="BTEB Academic Timeline"
          title="Official Academic Calendar"
          subtitle="Annual term schedules, examination windows, and key milestones for Diploma in Engineering programs."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {TERMS.map((term, i) => (
            <Card key={i} className="border border-[#e2e8e4] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#e2e8e4] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0f1f17]">{term.semester}</h3>
                  <p className="text-xs text-[#5a6b62] mt-0.5">{term.duration}</p>
                </div>
                <Badge variant="secondary" className="bg-[#f0f7f3] text-[#0a4b32]">
                  Accredited
                </Badge>
              </div>

              <div className="space-y-3 pt-2">
                {term.events.map((evt, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0a4b32] shrink-0 mt-1.5" />
                    <div>
                      <p className="font-semibold text-[#0f1f17]">{evt.title}</p>
                      <p className="text-xs text-[#5a6b62]">{evt.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
