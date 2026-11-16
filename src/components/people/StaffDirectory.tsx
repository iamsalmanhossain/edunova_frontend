"use client";

import React, { useState, useMemo } from "react";
import { InstitutionStaff, InstitutionStaffRole, ROLE_LABELS } from "@/types/staff";
import { VERIFIED_DEPARTMENTS } from "@/services/department.service";
import StaffViewSwitcher, { StaffDirectoryView } from "./StaffViewSwitcher";
import DepartmentShiftFilter, { DepartmentOption } from "./DepartmentShiftFilter";
import OtherStaffRoleFilter, { OTHER_STAFF_ROLES } from "./OtherStaffRoleFilter";
import PrincipalSection from "./PrincipalSection";
import StaffRoleSection from "./StaffRoleSection";
import OtherStaffSection from "./OtherStaffSection";
import StaffEmptyState from "./StaffEmptyState";
import StaffDirectoryHeader from "./StaffDirectoryHeader";

interface StaffDirectoryProps {
  initialStaff: InstitutionStaff[];
  defaultView?: StaffDirectoryView;
  activeCategory?: string; // for backwards compatibility
}

export default function StaffDirectory({
  initialStaff,
  defaultView = "ALL",
  activeCategory,
}: StaffDirectoryProps) {
  // Determine initial view mode
  const initialViewMode: StaffDirectoryView = useMemo(() => {
    if (defaultView) return defaultView;
    if (activeCategory === "LEADERSHIP" || activeCategory === "FACULTY") {
      return "ALL";
    }
    return "ALL";
  }, [defaultView, activeCategory]);

  const [currentView, setCurrentView] = useState<StaffDirectoryView>(initialViewMode);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Department-wise View State (Default: CST + Second Shift)
  const [selectedDept, setSelectedDept] = useState<string>("CST");
  const [selectedShift, setSelectedShift] = useState<string>("SECOND_SHIFT");

  // Other Staff View State (Default: "ALL")
  const [selectedOtherRole, setSelectedOtherRole] = useState<string>("ALL");

  // Compile full departments list
  const departments: DepartmentOption[] = useMemo(() => {
    const map = new Map<string, DepartmentOption>();

    // Start with verified departments
    VERIFIED_DEPARTMENTS.forEach((d) => {
      map.set(d.code.toUpperCase(), {
        id: d.id,
        name: d.name,
        code: d.code,
      });
    });

    // Also include any department referenced by staff members
    initialStaff.forEach((s) => {
      if (s.department && s.department.code) {
        const code = s.department.code.toUpperCase();
        if (!map.has(code)) {
          map.set(code, {
            id: s.department.id,
            name: s.department.name,
            code: s.department.code,
          });
        }
      }
    });

    return Array.from(map.values());
  }, [initialStaff]);

  // General search filter helper
  const matchesSearch = (staff: InstitutionStaff, query: string): boolean => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    const name = (staff.resolvedName || staff.name || "").toLowerCase();
    const desig = (staff.designation || "").toLowerCase();
    const deptName = (staff.department?.name || "").toLowerCase();
    const deptCode = (staff.department?.code || "").toLowerCase();
    const email = (staff.resolvedEmail || staff.email || "").toLowerCase();
    const phone = (staff.resolvedPhone || staff.phone || "").toLowerCase();
    const roleLabel = (ROLE_LABELS[staff.role] || staff.role).toLowerCase();

    return (
      name.includes(q) ||
      desig.includes(q) ||
      deptName.includes(q) ||
      deptCode.includes(q) ||
      email.includes(q) ||
      phone.includes(q) ||
      roleLabel.includes(q)
    );
  };

  // ----------------------------------------------------
  // VIEW 1: ALL STAFF VIEW DATA
  // Hierarchy:
  // A. Principal
  // B. Chief Instructor (4-col grid)
  // C. Instructor (4-col grid)
  // D. Junior Instructor (4-col grid)
  // E. Other Institutional Staff (role-wise sections in exact order)
  // ----------------------------------------------------
  const allStaffFiltered = useMemo(() => {
    return initialStaff.filter((s) => matchesSearch(s, searchQuery));
  }, [initialStaff, searchQuery]);

  const view1Principal = useMemo(() => {
    return allStaffFiltered.find((s) => s.role === "PRINCIPAL") || null;
  }, [allStaffFiltered]);

  const view1ChiefInstructors = useMemo(() => {
    return allStaffFiltered.filter((s) => s.role === "CHIEF_INSTRUCTOR");
  }, [allStaffFiltered]);

  const view1Instructors = useMemo(() => {
    return allStaffFiltered.filter((s) => s.role === "INSTRUCTOR");
  }, [allStaffFiltered]);

  const view1JuniorInstructors = useMemo(() => {
    return allStaffFiltered.filter((s) => s.role === "JUNIOR_INSTRUCTOR");
  }, [allStaffFiltered]);

  const view1OtherStaffByRole = useMemo(() => {
    const map = new Map<InstitutionStaffRole, InstitutionStaff[]>();
    OTHER_STAFF_ROLES.forEach((r) => map.set(r, []));

    allStaffFiltered.forEach((s) => {
      const list = map.get(s.role);
      if (list) {
        list.push(s);
      }
    });

    return map;
  }, [allStaffFiltered]);

  // ----------------------------------------------------
  // VIEW 2: DEPARTMENT-WISE VIEW DATA
  // Filters: selectedDept (Default: "CST"), selectedShift (Default: "SECOND_SHIFT")
  // Display Hierarchy:
  // 1. Chief Instructor (Top center; if single, centered, not full-width stretched)
  // 2. Instructor (Below Chief Instructor; if single, centered; if multiple, 4-col grid)
  // 3. Junior Instructor (Below Instructor, 4-col grid)
  // Only displays staff members matching selected department and shift!
  // ----------------------------------------------------
  const departmentFilteredStaff = useMemo(() => {
    return initialStaff.filter((s) => {
      // 1. Check Department match
      const deptCode = s.department?.code?.toUpperCase();
      const deptId = s.department?.id || s.departmentId;
      const targetDept = selectedDept.toUpperCase();

      const deptMatches =
        deptCode === targetDept ||
        deptId === selectedDept ||
        (targetDept === "CST" && s.department?.name?.toLowerCase().includes("computer"));

      if (!deptMatches) return false;

      // 2. Check Shift match
      if (selectedShift !== "ALL") {
        if (s.shift !== selectedShift) return false;
      }

      // 3. Check Search query
      if (!matchesSearch(s, searchQuery)) return false;

      return true;
    });
  }, [initialStaff, selectedDept, selectedShift, searchQuery]);

  const deptChiefInstructors = useMemo(() => {
    return departmentFilteredStaff.filter((s) => s.role === "CHIEF_INSTRUCTOR");
  }, [departmentFilteredStaff]);

  const deptInstructors = useMemo(() => {
    return departmentFilteredStaff.filter((s) => s.role === "INSTRUCTOR");
  }, [departmentFilteredStaff]);

  const deptJuniorInstructors = useMemo(() => {
    return departmentFilteredStaff.filter((s) => s.role === "JUNIOR_INSTRUCTOR");
  }, [departmentFilteredStaff]);

  // ----------------------------------------------------
  // VIEW 3: OTHER STAFF MEMBERS VIEW DATA
  // Displays non-instructional staff members
  // ----------------------------------------------------
  const otherStaffAll = useMemo(() => {
    return initialStaff.filter((s) => {
      const isOtherRole = OTHER_STAFF_ROLES.includes(s.role);
      if (!isOtherRole) return false;
      return matchesSearch(s, searchQuery);
    });
  }, [initialStaff, searchQuery]);

  const otherRoleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    OTHER_STAFF_ROLES.forEach((r) => {
      counts[r] = otherStaffAll.filter((s) => s.role === r).length;
    });
    return counts;
  }, [otherStaffAll]);

  // Overall counts for switcher tabs
  const tabCounts = useMemo(() => {
    const deptTotal = initialStaff.filter((s) => {
      const isAcademic =
        s.role === "CHIEF_INSTRUCTOR" ||
        s.role === "INSTRUCTOR" ||
        s.role === "JUNIOR_INSTRUCTOR";
      return isAcademic && Boolean(s.department);
    }).length;

    const otherTotal = initialStaff.filter((s) =>
      OTHER_STAFF_ROLES.includes(s.role)
    ).length;

    return {
      all: initialStaff.length,
      department: deptTotal,
      other: otherTotal,
    };
  }, [initialStaff]);

  // Visible count based on active view
  const currentVisibleCount = useMemo(() => {
    if (currentView === "ALL") return allStaffFiltered.length;
    if (currentView === "DEPARTMENT") return departmentFilteredStaff.length;
    if (currentView === "OTHER") {
      if (selectedOtherRole === "ALL") return otherStaffAll.length;
      return otherStaffAll.filter((s) => s.role === selectedOtherRole).length;
    }
    return 0;
  }, [
    currentView,
    allStaffFiltered.length,
    departmentFilteredStaff.length,
    otherStaffAll,
    selectedOtherRole,
  ]);

  // Reset department-wise filter back to defaults (CST + SECOND_SHIFT)
  const resetDeptFilters = () => {
    setSelectedDept("CST");
    setSelectedShift("SECOND_SHIFT");
    setSearchQuery("");
  };

  const isDeptFilteredCustom =
    selectedDept !== "CST" || selectedShift !== "SECOND_SHIFT" || searchQuery !== "";

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* 1. Main View Switcher Buttons */}
      <StaffViewSwitcher
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setSearchQuery("");
        }}
        counts={tabCounts}
      />

      {/* 2. Global Search and Status Toolbar */}
      <StaffDirectoryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        visibleCount={currentVisibleCount}
        totalCount={initialStaff.length}
      />

      {/* ---------------------------------------------------------------- */}
      {/* VIEW 1: ALL STAFF (DEFAULT VIEW)                                */}
      {/* ---------------------------------------------------------------- */}
      {currentView === "ALL" && (
        <div className="space-y-12">
          {allStaffFiltered.length === 0 ? (
            <StaffEmptyState
              title="No Staff Members Found"
              message="No institutional personnel match the search query. Try clearing your search keyword."
              onReset={() => setSearchQuery("")}
              resetLabel="Clear Search"
            />
          ) : (
            <>
              {/* A. Principal (Top Center, Featured Card) */}
              {view1Principal && (
                <PrincipalSection principal={view1Principal} />
              )}

              {/* B. Chief Instructor (4-column responsive grid below Principal) */}
              {view1ChiefInstructors.length > 0 && (
                <StaffRoleSection
                  role="CHIEF_INSTRUCTOR"
                  staffList={view1ChiefInstructors}
                  customSubtitle="Academic department heads steering diploma engineering curriculum and laboratories"
                />
              )}

              {/* C. Instructor (4-column responsive grid below Chief Instructor) */}
              {view1Instructors.length > 0 && (
                <StaffRoleSection
                  role="INSTRUCTOR"
                  staffList={view1Instructors}
                  customSubtitle="Faculty instructors delivering theory lectures, hands-on lab experiments, and mentorship"
                />
              )}

              {/* D. Junior Instructor (4-column responsive grid below Instructor) */}
              {view1JuniorInstructors.length > 0 && (
                <StaffRoleSection
                  role="JUNIOR_INSTRUCTOR"
                  staffList={view1JuniorInstructors}
                  customSubtitle="Laboratory demonstrators and technical instructional staff supporting workshop experiments"
                />
              )}

              {/* E. Other Institutional Staff (Each role in its own section in exact order) */}
              <div className="space-y-10 pt-4 border-t-2 border-[#e2e8e4]">
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0f1f17]">
                    Institutional Administration &amp; Operational Sections
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Administrative officers, student cells, library, and support services across campus
                  </p>
                </div>

                {OTHER_STAFF_ROLES.map((role) => {
                  const staffInRole = view1OtherStaffByRole.get(role) || [];
                  if (staffInRole.length === 0) return null;

                  return (
                    <StaffRoleSection
                      key={role}
                      role={role}
                      staffList={staffInRole}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* VIEW 2: DEPARTMENT-WISE VIEW                                    */}
      {/* ---------------------------------------------------------------- */}
      {currentView === "DEPARTMENT" && (
        <div className="space-y-8">
          {/* Department & Shift Dropdowns (Defaults: CST + Second Shift) */}
          <DepartmentShiftFilter
            departments={departments}
            selectedDepartment={selectedDept}
            onDepartmentChange={setSelectedDept}
            selectedShift={selectedShift}
            onShiftChange={setSelectedShift}
            onReset={resetDeptFilters}
            isFiltered={isDeptFilteredCustom}
          />

          {/* Department Staff Display Hierarchy */}
          {departmentFilteredStaff.length === 0 ? (
            <StaffEmptyState
              title="No Faculty Members in this Department & Shift"
              message={`No instructors were found for department "${selectedDept}" in ${
                selectedShift === "SECOND_SHIFT"
                  ? "2nd Shift"
                  : selectedShift === "FIRST_SHIFT"
                  ? "1st Shift"
                  : "all shifts"
              }. Try switching shifts or selecting another department.`}
              onReset={resetDeptFilters}
              resetLabel="Reset to CST & 2nd Shift"
            />
          ) : (
            <div className="space-y-12">
              {/* 1. Chief Instructor (Top center; centered if single) */}
              {deptChiefInstructors.length > 0 && (
                <StaffRoleSection
                  role="CHIEF_INSTRUCTOR"
                  staffList={deptChiefInstructors}
                  customTitle={`Chief Instructor – ${selectedDept}`}
                  customSubtitle="Departmental leadership and head of academic division"
                  centeredIfSingle={true}
                />
              )}

              {/* 2. Instructor (Below Chief Instructor; centered if single, max 4-col grid if multiple) */}
              {deptInstructors.length > 0 && (
                <StaffRoleSection
                  role="INSTRUCTOR"
                  staffList={deptInstructors}
                  customTitle={`Instructors – ${selectedDept}`}
                  customSubtitle="Core instructional faculty conducting theory classes and labs"
                  centeredIfSingle={true}
                />
              )}

              {/* 3. Junior Instructor (Below Instructors in responsive 4-col grid) */}
              {deptJuniorInstructors.length > 0 && (
                <StaffRoleSection
                  role="JUNIOR_INSTRUCTOR"
                  staffList={deptJuniorInstructors}
                  customTitle={`Junior Instructors – ${selectedDept}`}
                  customSubtitle="Demonstrators and laboratory technical instructors"
                  centeredIfSingle={false}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* VIEW 3: OTHER STAFF MEMBERS VIEW                                */}
      {/* ---------------------------------------------------------------- */}
      {currentView === "OTHER" && (
        <div className="space-y-8">
          {/* Role Dropdown Filter */}
          <OtherStaffRoleFilter
            selectedRole={selectedOtherRole}
            onRoleChange={setSelectedOtherRole}
            roleCounts={otherRoleCounts}
            onReset={() => {
              setSelectedOtherRole("ALL");
              setSearchQuery("");
            }}
          />

          {/* Non-instructional roles rendered section by section */}
          <OtherStaffSection
            staffList={otherStaffAll}
            selectedRole={selectedOtherRole}
            onResetFilter={() => {
              setSelectedOtherRole("ALL");
              setSearchQuery("");
            }}
          />
        </div>
      )}
    </div>
  );
}

