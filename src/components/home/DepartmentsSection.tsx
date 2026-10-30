import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { departmentService, VERIFIED_DEPARTMENTS } from "@/services/department.service";

export default async function DepartmentsSection() {
  const departments = await departmentService.getDepartments();
  const displayDepartments = departments.length > 0 ? departments : VERIFIED_DEPARTMENTS;

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#e2e8e4]/70">
      <Container size="wide">
        <SectionHeading
          badge="Academic Programs"
          title="Our Engineering Departments"
          subtitle="Explore our four specialized 4-year Diploma in Engineering departments, designed to equip graduates with practical expertise and career-ready mastery."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayDepartments.map((dept) => {
            const slug = dept.code.toLowerCase();
            return (
              <Card
                key={dept.code}
                className="group overflow-hidden border border-[#e2e8e4] hover:border-[#0a4b32]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-white"
              >
                <div>
                  {/* Department Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#e6ede8]">
                    {dept.imageUrl && (
                      <Image
                        src={dept.imageUrl}
                        alt={`Department of ${dept.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-108"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Dept Code Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="gold"
                        className="font-bold text-xs shadow-sm bg-white text-[#0a4b32] border-none"
                      >
                        {dept.code}
                      </Badge>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-lg font-bold leading-snug drop-shadow-sm">
                        {dept.name}
                      </h3>
                    </div>
                  </div>

                  {/* Department Content */}
                  <CardContent className="p-5 space-y-4">
                    <p className="text-xs sm:text-sm text-[#5a6b62] leading-relaxed line-clamp-3">
                      {dept.description}
                    </p>

                    {/* Stats pill */}
                    <div className="flex items-center gap-3 pt-2 text-xs text-[#5a6b62]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-[#0a4b32]" />
                        <span>{dept._count?.subjects || "8+"} Subjects</span>
                      </span>
                      <span className="text-[#e2e8e4]">•</span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Users className="w-3.5 h-3.5 text-[#0a4b32]" />
                        <span>Shift 1 &amp; 2</span>
                      </span>
                    </div>

                    {/* Key Highlights */}
                    {dept.highlights && dept.highlights.length > 0 && (
                      <div className="pt-2 border-t border-[#e2e8e4] space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0a4b32]">
                          Key Focus
                        </p>
                        <p className="text-xs text-[#5a6b62] line-clamp-2">
                          {dept.highlights[0]} &amp; {dept.highlights[1]}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </div>

                {/* Footer link */}
                <div className="p-5 pt-0 border-t border-[#e2e8e4]/60">
                  <Link
                    href={`/departments/${slug}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0a4b32] hover:text-[#073825] group-hover:translate-x-1 transition-all"
                  >
                    <span>Explore Department</span>
                    <ArrowRight className="w-4 h-4 text-[#c48b28]" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
