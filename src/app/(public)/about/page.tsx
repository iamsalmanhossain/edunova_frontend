import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About the Institute",
  description:
    "Learn about Kishoreganj Polytechnic Institute, our vision, mission, governance, and history of technical education.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <SectionHeading
          badge="About EduNova & KPI"
          title="Empowering Engineering Minds with Purpose & Precision"
          subtitle="Discover our institutional legacy, engineering disciplines, and progressive commitment to modern technical pedagogy."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-[#e2e8e4]">
            <Image
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop"
              alt="Kishoreganj Polytechnic Institute Academic Building"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-5 text-sm sm:text-base text-[#5a6b62] leading-relaxed">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0f1f17]">
              Kishoreganj Polytechnic Institute (KIPI)
            </h3>
            <p>
              Located in Karimganj, Kishoreganj, Bangladesh, our polytechnic institute stands as a beacon for vocational and technical education. Affiliated with the Bangladesh Technical Education Board (BTEB), we deliver accredited 4-year Diploma in Engineering qualifications.
            </p>
            <p>
              We operate across 4 core departments: Computer Science &amp; Technology, Electrical Technology, Civil Technology, and Mechanical Technology. Each discipline is structured into 8 comprehensive semesters combining core science, branch fundamentals, lab experimentation, and direct industrial attachments.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Button asChild className="bg-[#0a4b32] hover:bg-[#073825] text-white">
                <Link href="/departments">View Departments</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#0a4b32]/30 text-[#0a4b32]">
                <Link href="/people/leadership">Meet Leadership</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
