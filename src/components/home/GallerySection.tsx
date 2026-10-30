import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { campusService, VERIFIED_CAMPUS_IMAGES } from "@/services/campus.service";

export default async function GallerySection() {
  let images = VERIFIED_CAMPUS_IMAGES;

  try {
    const fetched = await campusService.getPublicCampusImages();
    if (fetched && fetched.length > 0) {
      images = fetched;
    }
  } catch {
    // Independent failure isolation: campus API failure never crashes homepage
    images = VERIFIED_CAMPUS_IMAGES;
  }

  // Display top 6 images for homepage showcase
  const displayImages = images.slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#e2e8e4]/70">
      <Container size="wide">
        <SectionHeading
          badge="Campus Life & Visuals"
          title="Campus Life & Photographic Gallery"
          subtitle="Explore the lively atmosphere, academic activities, hands-on workshops, and institutional milestones of EduNova at Kishoreganj Polytechnic Institute."
        />

        {/* Asymmetric / Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayImages.map((img, idx) => {
            const isFeatured = idx === 0 || idx === 3;
            return (
              <div
                key={img.id}
                className={`group relative overflow-hidden rounded-2xl border border-[#e2e8e4] bg-[#e6ede8] shadow-sm hover:shadow-xl transition-all duration-300 ${
                  isFeatured ? "sm:col-span-2 lg:col-span-2 h-72 sm:h-96" : "h-72 sm:h-96"
                }`}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.altText || img.title}
                  fill
                  sizes={
                    isFeatured
                      ? "(max-width: 768px) 100vw, 66vw"
                      : "(max-width: 768px) 100vw, 33vw"
                  }
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Top Category Badge */}
                {img.category && (
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-black/50 text-white backdrop-blur-xs border-white/20 text-xs font-semibold uppercase tracking-wider"
                    >
                      {img.category}
                    </Badge>
                  </div>
                )}

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white transform transition-transform duration-300">
                  <h3 className="text-base sm:text-xl font-bold leading-snug drop-shadow-md">
                    {img.title}
                  </h3>
                  {img.caption && (
                    <p className="mt-1.5 text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed">
                      {img.caption}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Gallery CTA */}
        <div className="text-center pt-10 sm:pt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-[#0a4b32]/30 text-[#0a4b32] hover:bg-[#f0f7f3] font-semibold"
          >
            <Link href="/campus/gallery" className="inline-flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#c48b28]" />
              <span>Explore Complete Campus Gallery</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
