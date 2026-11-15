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

      {/* Filter and Search Controls Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e8e4] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, designation, department, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-9 bg-[#fbfdfb] border-[#d7e2da] focus:border-[#0a4b32] focus:ring-[#0a4b32]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Shift Toggles & Department Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Shift Filter */}
            <div className="inline-flex rounded-lg border border-[#e2e8e4] p-0.5 bg-[#f5f8f6]">
              <button
                onClick={() => setSelectedShift("ALL")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  selectedShift === "ALL"
                    ? "bg-white text-[#0a4b32] shadow-xs font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Shifts
              </button>
              <button
                onClick={() => setSelectedShift("FIRST_SHIFT")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  selectedShift === "FIRST_SHIFT"
                    ? "bg-white text-[#0a4b32] shadow-xs font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                1st Shift
              </button>
              <button
                onClick={() => setSelectedShift("SECOND_SHIFT")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  selectedShift === "SECOND_SHIFT"
                    ? "bg-white text-[#0a4b32] shadow-xs font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                2nd Shift
              </button>
            </div>

            {/* Department Dropdown */}
            {departments.length > 0 && (
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-xs font-medium bg-[#f5f8f6] border border-[#e2e8e4] rounded-lg px-3 py-2 text-gray-700 focus:outline-hidden focus:ring-1 focus:ring-[#0a4b32]"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 px-2.5"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div>
            Showing <strong className="text-gray-900">{filteredStaff.length}</strong> of{" "}
            <strong>{initialStaff.length}</strong> staff members
          </div>
          {searchQuery && (
            <div className="truncate max-w-[200px]">
              Filtered by: &ldquo;<span className="text-[#0a4b32]">{searchQuery}</span>&rdquo;
            </div>
          )}
        </div>
      </div>

      {/* Directory Grid */}
      {filteredStaff.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 p-8">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No staff members found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            No institutional staff members match the selected filters or search keyword.
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4">
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured Principal Card if present */}
          {principal && !searchQuery && (
            <div className="space-y-3">
              <StaffCard staff={principal} featured={true} />
            </div>
          )}

          {/* Regular Grid */}
          {regularStaff.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularStaff.map((staff) => (
                <StaffCard key={staff.id} staff={staff} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
