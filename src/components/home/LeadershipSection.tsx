import React from "react";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import ProfileCard from "@/components/shared/ProfileCard";
import { Button } from "@/components/ui/button";
import { teacherService, VERIFIED_TEACHERS } from "@/services/teacher.service";

export default async function LeadershipSection() {
  let teachers = VERIFIED_TEACHERS;

  try {
    const fetched = await teacherService.getPublicTeachers();
    if (fetched && fetched.length > 0) {
      teachers = fetched;
    }
  } catch {
    // Graceful fallback to verified records: teacher API failure never breaks homepage
    teachers = VERIFIED_TEACHERS;
  }

  // Identify Principal (First profile or marked designation)
  const principal =
    teachers.find((t) =>
      t.designation?.toLowerCase().includes("principal")
    ) || teachers[0];

  // Other faculty members
  const otherFaculty = teachers.filter((t) => t.id !== principal.id).slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-[#fcfdfc] border-b border-[#e2e8e4]/70">
      <Container size="wide">
        <SectionHeading
          badge="Institutional Governance"
          title="Leadership & Distinguished Faculty"
          subtitle="Guided by seasoned academic administrators and professional engineers committed to nurturing technical excellence."
        />

        {/* Featured Principal Profile */}
        <div className="mb-12">
          <ProfileCard teacher={principal} featured={true} />
        </div>

        {/* Department Heads & Faculty Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#0f1f17] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0a4b32]" />
              <span>Department Heads &amp; Faculty Members</span>
            </h3>
            <Link
              href="/people"
              className="text-xs sm:text-sm font-semibold text-[#0a4b32] hover:text-[#073825] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {otherFaculty.map((teacher) => (
              <ProfileCard key={teacher.id} teacher={teacher} />
            ))}
          </div>

          {/* View All People CTA */}
          <div className="text-center pt-8">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-[#0a4b32]/30 text-[#0a4b32] hover:bg-[#f0f7f3] font-semibold"
            >
              <Link href="/people" className="inline-flex items-center gap-2">
                <span>View All People &amp; Faculty Directory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
