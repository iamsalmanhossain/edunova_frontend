"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Phone,
  ShieldCheck,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { teacherService } from "@/services/teacher.service";
import { TeacherStudentItem } from "@/types/teacher";
import PreEnrollStudentModal from "../attendance/PreEnrollStudentModal";

export default function TeacherStudentDirectory() {
  const [students, setStudents] = useState<TeacherStudentItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [semesterFilter, setSemesterFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPreEnrollOpen, setIsPreEnrollOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadStudents() {
      try {
        setLoading(true);
        setError(null);
        const res = await teacherService.getStudents({
          semester: semesterFilter === "ALL" ? undefined : Number(semesterFilter),
          search: searchQuery.trim() || undefined,
          limit: 100,
        });
        if (mounted) {
          const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
          setStudents(list);
          setTotalCount(res?.meta?.total ?? list.length);
        }
      } catch (err: unknown) {
        console.error("Failed to load scoped students", err);
        if (mounted) {
          setError("Failed to load student directory records.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadStudents();
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [semesterFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white rounded-3xl border border-[#dce3df] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-[#0a4b32]">
              <Users className="w-5 h-5 text-emerald-800" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#0f1f17] tracking-tight">
              Department Student Roll Directory
            </h1>
          </div>
          <p className="text-xs text-[#5a6b62] mt-1">
            Registered students enrolled in your department and academic shift
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setIsPreEnrollOpen(true)}
            className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs font-bold gap-1.5 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Pre-Enroll Student
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#dce3df] p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by roll or student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#e2e8e4] bg-[#fafbf9] focus:outline-none focus:ring-2 focus:ring-[#0a4b32]"
          />
        </div>

        {/* Semester Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-[#5a6b62] shrink-0">Semester:</span>
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#dce3df] bg-white focus:outline-none focus:ring-2 focus:ring-[#0a4b32] w-full sm:w-auto"
          >
            <option value="ALL">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>

          <span className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
            Total Students: {totalCount}
          </span>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-[#dce3df] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-4 sm:p-5 space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="py-3 px-2 flex items-center justify-between gap-4 border-b border-[#f0f4f1] last:border-0"
              >
                <Skeleton className="h-4 w-14 font-mono rounded" />
                <div className="flex items-center gap-3 flex-1 max-w-xs">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-2.5 w-44" />
                  </div>
                </div>
                <Skeleton className="h-4 w-28 hidden md:block" />
                <Skeleton className="h-4 w-24 hidden sm:block" />
                <Skeleton className="h-4 w-24 hidden lg:block" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="flex items-center gap-2 p-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-2xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center p-8 space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-[#0f1f17]">No students found</p>
            <p className="text-xs text-[#5a6b62]">
              No student records match the selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f4f7f5] text-[#5a6b62] uppercase font-bold text-[10px] tracking-wider border-b border-[#eef2ef]">
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student Info</th>
                  <th className="py-3 px-4">Registration</th>
                  <th className="py-3 px-4">Semester &amp; Session</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f1]">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-emerald-50/30 transition-colors"
                  >
                    {/* Roll */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-extrabold text-xs text-[#0a4b32]">
                        {student.rollNo}
                      </span>
                    </td>

                    {/* Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {student.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#0f1f17]">{student.user.name}</p>
                          <p className="text-[10px] text-[#5a6b62]">{student.user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Registration No */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-[#0f1f17]">
                        {student.registrationNo || "—"}
                      </span>
                    </td>

                    {/* Semester & Session */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#0f1f17]">
                        {student.semester}th Semester
                      </p>
                      <p className="text-[10px] text-[#5a6b62]">
                        {student.session || "2024-2025"}
                      </p>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      {student.user.phone || student.guardianPhone ? (
                        <div className="space-y-0.5">
                          {student.user.phone && (
                            <p className="flex items-center gap-1 text-[11px] text-[#0f1f17]">
                              <Phone className="w-3 h-3 text-[#0a4b32]" />
                              {student.user.phone}
                            </p>
                          )}
                          {student.guardianPhone && (
                            <p className="text-[10px] text-[#5a6b62]">
                              Guardian: {student.guardianPhone}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Not provided</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {student.user.status || "ACTIVE"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pre-enroll Modal */}
      <PreEnrollStudentModal
        isOpen={isPreEnrollOpen}
        onClose={() => setIsPreEnrollOpen(false)}
        onSuccess={() => {
          setSemesterFilter(semesterFilter);
        }}
      />
    </div>
  );
}
