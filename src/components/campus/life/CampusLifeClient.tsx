"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import Container from "@/components/shared/Container";
import CampusLifeHero from "./CampusLifeHero";
import CampusLifeFilterBar from "./CampusLifeFilterBar";
import CampusLifeCard from "./CampusLifeCard";
import { CampusLife } from "@/types/campus";
import { campusService, VERIFIED_CAMPUS_LIVES } from "@/services/campus.service";
import { useAuthStore } from "@/store/useAuthStore";
import { Users, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampusLifeClientProps {
  initialCampusLife?: CampusLife[];
}

export default function CampusLifeClient({
  initialCampusLife = VERIFIED_CAMPUS_LIVES,
}: CampusLifeClientProps) {
  const [items, setItems] = useState<CampusLife[]>(initialCampusLife);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [, startTransition] = useTransition();

  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const fetchCampusLife = async () => {
    try {
      const data = await campusService.getCampusLife();
      startTransition(() => {
        setItems(data);
      });
    } catch {
      // Keep verified data
    }
  };

  useEffect(() => {
    fetchCampusLife();
  }, []);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory =
        activeCategory === "ALL" ||
        item.category?.toUpperCase() === activeCategory.toUpperCase();
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.activities?.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [items, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-16 sm:pb-24">
      {/* Hero Section */}
      <CampusLifeHero
        totalOrganizations={items.length}
        isAdmin={isAdmin}
      />

      <Container size="wide" className="pt-8 sm:pt-10 space-y-8">
        {/* Filter Bar */}
        <CampusLifeFilterBar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredCount={filteredItems.length}
        />

        {/* Organizations Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <CampusLifeCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 px-4 text-center rounded-2xl border-2 border-dashed border-[#d2ddd6] bg-white max-w-lg mx-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-[#0a4b32] flex items-center justify-center mb-4">
              {searchQuery ? (
                <SearchX className="w-7 h-7 text-[#5a6b62]" />
              ) : (
                <Users className="w-7 h-7 text-[#0a4b32]" />
              )}
            </div>
            <h3 className="text-base font-bold text-[#0f1f17]">No Clubs or Societies Found</h3>
            <p className="text-xs sm:text-sm text-[#5a6b62] mt-1 max-w-xs mx-auto">
              {searchQuery
                ? `No results match "${searchQuery}". Try a different keyword or category.`
                : "No activities registered under this category yet."}
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
    </div>
  );
}
