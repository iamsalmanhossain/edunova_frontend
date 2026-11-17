"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import Container from "@/components/shared/Container";
import FacilitiesHero from "./FacilitiesHero";
import FacilitiesFilterBar from "./FacilitiesFilterBar";
import FacilityCard from "./FacilityCard";
import FacilityDetailModal from "./FacilityDetailModal";
import { CampusFacility } from "@/types/campus";
import { campusService, VERIFIED_CAMPUS_FACILITIES } from "@/services/campus.service";
import { useAuthStore } from "@/store/useAuthStore";
import { Wrench, FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampusFacilitiesClientProps {
  initialFacilities?: CampusFacility[];
}

export default function CampusFacilitiesClient({
  initialFacilities = VERIFIED_CAMPUS_FACILITIES,
}: CampusFacilitiesClientProps) {
  const [facilities, setFacilities] = useState<CampusFacility[]>(initialFacilities);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [, startTransition] = useTransition();

  // Detail Modal state
  const [selectedDetailFacility, setSelectedDetailFacility] = useState<CampusFacility | null>(null);

  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const fetchFacilities = async () => {
    try {
      const data = await campusService.getFacilities();
      startTransition(() => {
        setFacilities(data);
      });
    } catch {
      // Keep verified fallbacks
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Filtered facilities
  const filteredFacilities = useMemo(() => {
    return facilities.filter((fac) => {
      const matchCategory =
        activeCategory === "ALL" ||
        fac.category?.toUpperCase() === activeCategory.toUpperCase();
      const matchSearch =
        !searchQuery.trim() ||
        fac.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.features?.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [facilities, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-16 sm:pb-24">
      {/* Hero Section */}
      <FacilitiesHero
        totalFacilities={facilities.length}
        isAdmin={isAdmin}
      />

      <Container size="wide" className="pt-8 sm:pt-10 space-y-8">
        {/* Filter Bar */}
        <FacilitiesFilterBar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredCount={filteredFacilities.length}
        />

        {/* Facilities Grid */}
        {filteredFacilities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredFacilities.map((fac) => (
              <FacilityCard
                key={fac.id}
                facility={fac}
                onViewDetails={(f) => setSelectedDetailFacility(f)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 px-4 text-center rounded-2xl border-2 border-dashed border-[#d2ddd6] bg-white max-w-lg mx-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-[#0a4b32] flex items-center justify-center mb-4">
              {searchQuery ? (
                <FolderSearch className="w-7 h-7 text-[#5a6b62]" />
              ) : (
                <Wrench className="w-7 h-7 text-[#0a4b32]" />
              )}
            </div>
            <h3 className="text-base font-bold text-[#0f1f17]">No Facilities Found</h3>
            <p className="text-xs sm:text-sm text-[#5a6b62] mt-1 max-w-xs mx-auto">
              {searchQuery
                ? `No facilities match "${searchQuery}". Try a different keyword or category.`
                : "No facilities registered under this category yet."}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("ALL");
                }}
                className="mt-4 text-xs h-8 rounded-lg"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </Container>

      {/* Details Modal */}
      <FacilityDetailModal
        facility={selectedDetailFacility}
        isOpen={!!selectedDetailFacility}
        onClose={() => setSelectedDetailFacility(null)}
      />
    </div>
  );
}
