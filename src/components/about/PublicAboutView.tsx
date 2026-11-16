"use client";

import React, { useState, useEffect } from "react";
import { History } from "lucide-react";
import { InstituteAbout } from "@/types/about";
import Container from "@/components/shared/Container";
import { Badge } from "@/components/ui/badge";
import MarkdownViewer from "@/components/shared/MarkdownViewer";

import AboutHero from "./AboutHero";
import AboutMetricsStrip from "./AboutMetricsStrip";
import AboutMissionVision from "./AboutMissionVision";
import AboutFeaturedBanner from "./AboutFeaturedBanner";
import AboutTabNav, { AboutTabKey } from "./AboutTabNav";
import AboutDepartmentsGrid from "./AboutDepartmentsGrid";
import AboutGallery from "./AboutGallery";
import AboutLightboxModal from "./AboutLightboxModal";
import AboutCtaSection from "./AboutCtaSection";

interface PublicAboutViewProps {
  about: InstituteAbout;
}

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop";

export default function PublicAboutView({ about }: PublicAboutViewProps) {
  const [activeTab, setActiveTab] = useState<AboutTabKey>("charter");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [bannerSrc, setBannerSrc] = useState<string>(about.bannerUrl || DEFAULT_BANNER);

  // Sync banner image if updated dynamically
  useEffect(() => {
    if (about.bannerUrl) {
      setBannerSrc(about.bannerUrl);
    }
  }, [about.bannerUrl]);

  return (
    <div className="pb-24 bg-[#fbfdfb]">
      {/* 1. Hero Section */}
      <AboutHero
        about={about}
        bannerSrc={bannerSrc}
        onBannerError={() => setBannerSrc(DEFAULT_BANNER)}
      />

      {/* 2. Overlapping Metrics Bar */}
      <AboutMetricsStrip />

      <Container size="wide" className="mt-8 sm:mt-14 space-y-10 sm:space-y-14">
        {/* 3. Strategic Mission & Vision */}
        <AboutMissionVision mission={about.mission} vision={about.vision} />

        {/* 4. Featured Campus Photograph Showcase */}
        <AboutFeaturedBanner
          title={about.title}
          instituteName={about.institute?.name}
          bannerSrc={bannerSrc}
          onBannerError={() => setBannerSrc(DEFAULT_BANNER)}
        />

        {/* 5. Tabbed Content Area */}
        <div className="space-y-6">
          <AboutTabNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hasHistory={Boolean(about.history)}
            galleryCount={about.images?.length || 0}
          />

          {/* Tab 1: Formatted Markdown Academic Charter */}
          {activeTab === "charter" && (
            <div className="bg-white p-4 sm:p-8 lg:p-10 rounded-2xl border border-[#e2e8e4] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[#e2e8e4]">
                <div>
                  <h3 className="text-sm sm:text-lg font-bold text-[#0f1f17]">
                    Curriculum Charter &amp; Technical Syllabus
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                    Affiliated with Bangladesh Technical Education Board (BTEB)
                  </p>
                </div>
                <Badge className="bg-[#eef5f1] text-[#0a4b32] border-[#d6e6db] text-[10px] sm:text-xs self-start sm:self-auto">
                  Official Publication
                </Badge>
              </div>

              <MarkdownViewer content={about.content} />
            </div>
          )}

          {/* Tab 2: 4 Core Engineering Departments */}
          {activeTab === "departments" && <AboutDepartmentsGrid />}

          {/* Tab 3: Institutional History & Evolution */}
          {activeTab === "history" && about.history && (
            <div className="bg-white p-4 sm:p-8 rounded-2xl border border-[#e2e8e4] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0a4b32] text-white flex items-center justify-center shrink-0">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-bold text-[#0f1f17]">
                    Historical Heritage &amp; Evolution
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500">
                    Decades of technical leadership across Dhaka Division
                  </p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-[#47554f] leading-relaxed whitespace-pre-line pt-2 pl-3 border-l-2 border-[#0a4b32]/40">
                {about.history}
              </div>
            </div>
          )}

          {/* Tab 4: Campus Photo Gallery */}
          {activeTab === "gallery" && (
            <AboutGallery
              images={about.images || []}
              onSelectImage={setLightboxImage}
            />
          )}
        </div>

        {/* 6. Bottom CTA Box */}
        <AboutCtaSection />
      </Container>

      {/* 7. Full-Screen Interactive Lightbox Modal */}
      <AboutLightboxModal
        imageUrl={lightboxImage}
        onClose={() => setLightboxImage(null)}
        instituteTitle={about.institute?.name || about.title}
      />
    </div>
  );
}
