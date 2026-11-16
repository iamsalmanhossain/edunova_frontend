"use client";

import React from "react";
import { Building2, Clock, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DepartmentOption {
  id: string;
  name: string;
  code: string;
}

interface DepartmentShiftFilterProps {
  departments: DepartmentOption[];
  selectedDepartment: string; // department code (e.g. "CST") or id
  onDepartmentChange: (dept: string) => void;
  selectedShift: string; // "SECOND_SHIFT" (default), "FIRST_SHIFT", or "ALL"
  onShiftChange: (shift: string) => void;
  onReset?: () => void;
  isFiltered?: boolean;
}

export default function DepartmentShiftFilter({
  departments,
  selectedDepartment,
  onDepartmentChange,
  selectedShift,
  onShiftChange,
  onReset,
  isFiltered = false,
}: DepartmentShiftFilterProps) {
  return (
    <div className="bg-white border border-[#e2e8e4] rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Filter label */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#eef5f1] text-[#0a4b32] flex items-center justify-center shrink-0">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-tight">
              Department &amp; Shift Filter
            </h4>
            <p className="text-xs text-gray-500">
              Browse faculty and technical instructors by academic cadre
            </p>
          </div>
        </div>

        {/* Right: Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Dropdown */}
          <div className="flex items-center gap-2 bg-[#f8faf9] border border-[#dce6e0] rounded-xl px-3 py-2 text-xs font-medium min-w-[200px]">
            <Building2 className="w-4 h-4 text-[#c48b28] shrink-0" />
            <div className="flex flex-col flex-1">
              <label htmlFor="dept-select" className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                Department
              </label>
              <select
                id="dept-select"
                value={selectedDepartment}
                onChange={(e) => onDepartmentChange(e.target.value)}
                className="bg-transparent text-gray-900 font-semibold focus:outline-hidden cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept.code || dept.id} value={dept.code || dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Shift Dropdown */}
          <div className="flex items-center gap-2 bg-[#f8faf9] border border-[#dce6e0] rounded-xl px-3 py-2 text-xs font-medium min-w-[170px]">
            <Clock className="w-4 h-4 text-[#0a4b32] shrink-0" />
            <div className="flex flex-col flex-1">
              <label htmlFor="shift-select" className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                Academic Shift
              </label>
              <select
                id="shift-select"
                value={selectedShift}
                onChange={(e) => onShiftChange(e.target.value)}
                className="bg-transparent text-gray-900 font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="SECOND_SHIFT">2nd Shift (Default)</option>
                <option value="FIRST_SHIFT">1st Shift</option>
                <option value="ALL">All Shifts</option>
              </select>
            </div>
          </div>

          {/* Reset Filters button if customized */}
          {onReset && isFiltered && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 h-10 px-3 cursor-pointer"
              title="Reset to default CST & Second Shift"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

