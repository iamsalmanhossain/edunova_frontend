"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Users, X, RefreshCw } from "lucide-react";
import { InstitutionStaff, getRoleCategory, ROLE_CATEGORIES } from "@/types/staff";
import StaffCard from "@/components/shared/StaffCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PeopleDirectoryClientProps {
  initialStaff: InstitutionStaff[];
  activeCategory?: string;
}

export default function PeopleDirectoryClient({
  initialStaff,
  activeCategory = "ALL",
}: PeopleDirectoryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategory);
  const [selectedShift, setSelectedShift] = useState<string>("ALL");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique departments from staff list
  const departments = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    initialStaff.forEach((s) => {
      if (s.department) {
        map.set(s.department.id, { id: s.department.id, name: s.department.name });
      }
    });
    return Array.from(map.values());
  }, [initialStaff]);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return initialStaff.filter((s) => {
      // Category filter
      if (selectedCategory !== "ALL") {
        const cat = getRoleCategory(s.role);
        if (cat !== selectedCategory) return false;
      }

      // Shift filter
      if (selectedShift !== "ALL") {
        if (s.shift !== selectedShift) return false;
      }

      // Department filter
      if (selectedDept !== "ALL") {
        if (!s.department || s.department.id !== selectedDept) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const name = (s.resolvedName || s.name || "").toLowerCase();
        const desig = (s.designation || "").toLowerCase();
        const dept = (s.department?.name || "").toLowerCase();
        const email = (s.resolvedEmail || s.email || "").toLowerCase();
        const phone = (s.resolvedPhone || s.phone || "").toLowerCase();

        const match =
          name.includes(query) ||
          desig.includes(query) ||
          dept.includes(query) ||
          email.includes(query) ||
          phone.includes(query);

        if (!match) return false;
      }

      return true;
    });
  }, [initialStaff, selectedCategory, selectedShift, selectedDept, searchQuery]);

  // Separate principal for featured display if in "ALL" or "LEADERSHIP"
  const principal = useMemo(() => {
    if (selectedCategory === "ALL" || selectedCategory === "LEADERSHIP") {
      return filteredStaff.find((s) => s.role === "PRINCIPAL");
    }
    return null;
  }, [filteredStaff, selectedCategory]);

  const regularStaff = useMemo(() => {
    if (principal && !searchQuery) {
      return filteredStaff.filter((s) => s.id !== principal.id);
    }
    return filteredStaff;
  }, [filteredStaff, principal, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedShift("ALL");
    setSelectedDept("ALL");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCategory !== "ALL" ||
    selectedShift !== "ALL" ||
    selectedDept !== "ALL" ||
    searchQuery.trim() !== "";

  return (
    <div className="space-y-8">
      {/* Category Pills Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          size="sm"
          variant={selectedCategory === "ALL" ? "default" : "outline"}
          onClick={() => setSelectedCategory("ALL")}
          className={selectedCategory === "ALL" ? "bg-[#0a4b32] text-white" : ""}
        >
          All Personnel ({initialStaff.length})
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === "LEADERSHIP" ? "default" : "outline"}
          onClick={() => setSelectedCategory("LEADERSHIP")}
          className={selectedCategory === "LEADERSHIP" ? "bg-[#0a4b32] text-white" : ""}
        >
          Administration &amp; Leadership
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === "FACULTY" ? "default" : "outline"}
          onClick={() => setSelectedCategory("FACULTY")}
          className={selectedCategory === "FACULTY" ? "bg-[#0a4b32] text-white" : ""}
        >
          Academic Faculty
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === "CELLS" ? "default" : "outline"}
          onClick={() => setSelectedCategory("CELLS")}
          className={selectedCategory === "CELLS" ? "bg-[#0a4b32] text-white" : ""}
        >
          Special Units &amp; Cells
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === "SUPPORT" ? "default" : "outline"}
          onClick={() => setSelectedCategory("SUPPORT")}
          className={selectedCategory === "SUPPORT" ? "bg-[#0a4b32] text-white" : ""}
        >
          Support &amp; Security Staff
        </Button>
      </div>

    </div>
  );
}
