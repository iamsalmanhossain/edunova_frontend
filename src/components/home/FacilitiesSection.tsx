import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { campusService } from "@/services/campus.service";

export default async function FacilitiesSection() {
  const facilities = await campusService.getCampusFacilities();

  return (
    <section className="py-16 sm:py-24 bg-[#fcfdfc] border-b border-[#e2e8e4]/70">
      <Container size="wide">
        <SectionHeading
          badge="Infrastructure"
          title="Campus Facilities & Learning Spaces"
          subtitle="Engineered for practical mastery: modern laboratories, specialized equipment workshops, and extensive technical archives."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {facilities.map((facility) => (
            <Card
              key={facility.id}
              className="group overflow-hidden border border-[#e2e8e4] hover:border-[#0a4b32]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-white rounded-xl"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-[#e6ede8]">
                  <Image
                    src={facility.imageUrl}
                    alt={facility.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-xs text-[#0a4b32] font-semibold text-xs border border-[#e2e8e4]">
                      {facility.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors leading-snug">
                    {facility.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5a6b62] leading-relaxed line-clamp-3">
                    {facility.description}
                  </p>

                  <ul className="pt-2 space-y-1.5 border-t border-[#e2e8e4]">
                    {facility.features.map((feature, i) => (
                      <li key={i} className="text-xs text-[#47554f] flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#0a4b32] shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <div className="p-5 pt-0 border-t border-[#e2e8e4]/60">
                <Link
                  href="/campus/facilities"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0a4b32] hover:text-[#073825] group-hover:translate-x-1 transition-all"
                >
                  <span>Facility Details</span>
                  <ArrowRight className="w-4 h-4 text-[#c48b28]" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

