"use client";

import React from "react";
import { Filter, Users, RotateCcw } from "lucide-react";
import { InstitutionStaffRole, ROLE_LABELS } from "@/types/staff";
import { Button } from "@/components/ui/button";

export const OTHER_STAFF_ROLES: InstitutionStaffRole[] = [
  "ADMINISTRATIVE_SECTION",
  "ACCOUNTS_SECTION",
  "JOB_PLACEMENT_CELL",
  "ROVER_SCOUT_UNIT",
  "STORE_SECTION",
  "SECURITY_SECTION",
  "LIBRARY",
  "FOURTH_CLASS_EMPLOYEE_REVENUE",
  "OUTSOURCED_STAFF",
];

interface OtherStaffRoleFilterProps {
  selectedRole: string; // "ALL" or one of the 9 roles
  onRoleChange: (role: string) => void;
  roleCounts?: Record<string, number>;
  onReset?: () => void;
}

export default function OtherStaffRoleFilter({
  selectedRole,
  onRoleChange,
  roleCounts = {},
  onReset,
}: OtherStaffRoleFilterProps) {
  const isFiltered = selectedRole !== "ALL";

  return (
    <div className="bg-white border border-[#e2e8e4] rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Role Filter Label */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#eef5f1] text-[#0a4b32] flex items-center justify-center shrink-0">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-tight">
              Institutional Section &amp; Cadre Filter
            </h4>
            <p className="text-xs text-gray-500">
              Filter non-instructional officers, units, and campus services
            </p>
          </div>
        </div>

        {/* Right: Role Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#f8faf9] border border-[#dce6e0] rounded-xl px-3 py-2 text-xs font-medium min-w-[240px] sm:min-w-[280px]">
            <Users className="w-4 h-4 text-[#0a4b32] shrink-0" />
            <div className="flex flex-col flex-1">
              <label htmlFor="other-role-select" className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                Staff Section / Role
              </label>
              <select
                id="other-role-select"
                value={selectedRole}
                onChange={(e) => onRoleChange(e.target.value)}
                className="bg-transparent text-gray-900 font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Other Staff Members (Combined)</option>
                {OTHER_STAFF_ROLES.map((role) => {
                  const count = roleCounts[role] ?? 0;
                  return (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role] || role} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {isFiltered && onReset && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 h-10 px-3 cursor-pointer"
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

