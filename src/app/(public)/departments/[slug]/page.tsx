import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, ArrowLeft, Layers } from "lucide-react";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { departmentService } from "@/services/department.service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dept = await departmentService.getDepartmentByCodeOrId(slug);
  if (!dept) {
    return { title: "Department" };
  }
  return {
    title: `${dept.name} (${dept.code})`,
    description: dept.description || "Department overview and curriculum",
  };
}

export default async function DepartmentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const dept = await departmentService.getDepartmentByCodeOrId(slug);

  if (!dept) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <div className="mb-6">
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#5a6b62] hover:text-[#0a4b32]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Departments</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="relative rounded-2xl overflow-hidden bg-[#073825] text-white p-6 sm:p-10 lg:p-14 mb-10 shadow-lg">
          {dept.imageUrl && (
            <div className="absolute inset-0 z-0 opacity-25">
              <Image
                src={dept.imageUrl}
                alt={dept.name}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2">
              <Badge variant="gold" className="text-xs uppercase font-bold">
                {dept.code} Department
              </Badge>
              <span className="text-white/60 text-xs">•</span>
              <span className="text-xs text-white/80">4-Year Diploma Engineering</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {dept.name}
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed">
              {dept.description}
            </p>
          </div>
        </div>

        {/* Highlights & Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl border border-[#e2e8e4] p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="text-xl font-bold text-[#0f1f17] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0a4b32]" />
                <span>Program Highlights &amp; Laboratory Focus</span>
              </h3>
              <p className="text-sm text-[#5a6b62] leading-relaxed">
                Students enrolled in the {dept.name} department undergo 8 semesters of structured coursework. Laboratory sessions accompany every major theory module, with full hands-on engagement in our dedicated department laboratories.
              </p>

              {dept.highlights && dept.highlights.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  {dept.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-[#f0f7f3] border border-[#0a4b32]/10"
                    >
                      <CheckCircle className="w-4 h-4 text-[#0a4b32] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-[#0f1f17]">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-[#e2e8e4]">
              <CardContent className="p-6 space-y-4">
                <h4 className="font-bold text-base text-[#0f1f17]">
                  Department Overview
                </h4>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-[#e2e8e4]">
                    <span className="text-[#5a6b62]">Department Code</span>
                    <span className="font-semibold text-[#0f1f17]">{dept.code}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e2e8e4]">
                    <span className="text-[#5a6b62]">Total Semesters</span>
                    <span className="font-semibold text-[#0f1f17]">8 Semesters</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e2e8e4]">
                    <span className="text-[#5a6b62]">Shift Availability</span>
                    <span className="font-semibold text-[#0f1f17]">1st &amp; 2nd Shift</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e2e8e4]">
                    <span className="text-[#5a6b62]">Accrediting Board</span>
                    <span className="font-semibold text-[#0f1f17]">BTEB Bangladesh</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button asChild className="w-full bg-[#0a4b32] hover:bg-[#073825] text-white">
                    <Link href="/login">Access Student Portal</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
