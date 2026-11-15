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
  return (
    <div className="space-y-6">
      <div className="text-sm">People Directory ({initialStaff.length})</div>
    </div>
  );
}
