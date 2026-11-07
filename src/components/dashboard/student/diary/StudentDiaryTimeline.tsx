"use client";

import React, { useState, useEffect } from "react";
import { academicFeaturesService } from "@/services/academic-features.service";
import { ClassDiaryEntry } from "@/types/academic-features";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  Bell,
  Clock,
  Sparkles,
  FileText,
  Search,
} from "lucide-react";

export default function StudentDiaryTimeline() {
  const [entries, setEntries] = useState<ClassDiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadDiary() {
      try {
        setLoading(true);
        const res = await academicFeaturesService.getStudentDiaryEntries();
        if (mounted) {
          setEntries(res.entries || []);
        }
      } catch (err) {
        console.warn("Could not load student class diary:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadDiary();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredEntries = entries.filter((e) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      e.subject?.name?.toLowerCase().includes(term) ||
      e.subject?.code?.toLowerCase().includes(term) ||
      e.chapter?.toLowerCase().includes(term) ||
      e.topicsCovered?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0a4b32] to-[#073825] text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#c48b28]" />
            <span>Digital Class Diary & Lecture Notes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">Daily Class Journal & Notes</h1>
          <p className="text-xs text-white/80 mt-1 max-w-xl">
            Keep up with daily classroom coverage, study lecture materials shared by teachers, and prepare for announced class tests.
          </p>
        </div>

        <div className="bg-white/10 p-3 rounded-xl border border-white/15 text-center shrink-0">
          <div className="text-2xl font-black text-[#c48b28]">{entries.length}</div>
          <div className="text-[11px] text-white/80 font-medium">Logged Classes</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-xl bg-white border border-[#dce3df] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by subject, chapter name, or lecture topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs font-medium text-[#0f1f17] outline-none placeholder:text-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-xs text-gray-400 hover:text-gray-600 font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Timeline List */}
      {loading ? (
        <div className="p-12 text-center text-sm text-[#5a6b62] bg-white rounded-2xl border border-[#dce3df]">
          Loading class diary...
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#dce3df] space-y-2">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-[#0f1f17]">No Class Diary Entries Found</h3>
          <p className="text-xs text-[#5a6b62]">
            {searchTerm
              ? "No entries match your search query."
              : "Your teachers haven't recorded any lecture notes for this semester yet."}
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#dce3df]">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="relative group">
              {/* Timeline Bullet */}
              <div className="absolute -left-6 top-4 w-4 h-4 rounded-full border-2 border-white bg-[#0a4b32] shadow-xs ring-2 ring-[#0a4b32]/20 group-hover:scale-125 transition-transform" />

              <div className="p-5 rounded-2xl bg-white border border-[#dce3df] shadow-xs hover:border-[#0a4b32]/40 transition-all space-y-3">
                {/* Meta top row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f0f4f1]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-[#0a4b32] bg-[#0a4b32]/10 px-2 py-0.5 rounded">
                      {entry.subject?.code}
                    </span>
                    <span className="text-sm font-bold text-[#0f1f17]">
                      {entry.subject?.name}
                    </span>
                    <span className="text-xs text-[#5a6b62]">
                      • Sem {entry.semester}
                    </span>
                  </div>

                  <span className="text-xs text-[#5a6b62] flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#0a4b32]" />
                    {new Date(entry.entryDate || entry.date || Date.now()).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Chapter & Topics */}
                <div>
                  <h3 className="text-base font-bold text-[#0a4b32]">
                    {entry.chapter}
                  </h3>
                  <div className="mt-2 text-xs text-[#2c3e35] whitespace-pre-wrap leading-relaxed bg-[#fcfdfc] p-3 rounded-xl border border-[#f0f4f1]">
                    {entry.topicsCovered}
                  </div>
                </div>

                {/* Next Class Plan */}
                {entry.nextClassPlan && (
                  <div className="text-xs bg-[#f7faf8] p-3 rounded-xl border border-[#e2e8e4] text-[#0f1f17]">
                    <span className="font-bold text-[#0a4b32]">Preparation for Next Class:</span>{" "}
                    {entry.nextClassPlan}
                  </div>
                )}

                {/* Bottom Badges / Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  {entry.hasExamAnnouncement && entry.examTitle ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold">
                      <Bell className="w-3.5 h-3.5 text-[#c48b28]" />
                      <span>
                        Announcement: {entry.examTitle} on{" "}
                        {entry.examDate
                          ? new Date(entry.examDate).toLocaleDateString()
                          : "TBD"}
                      </span>
                    </div>
                  ) : (
                    <div />
                  )}

                  {entry.notesUrl && (
                    <a
                      href={entry.notesUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0a4b32] hover:bg-[#073825] px-4 py-2 rounded-xl shadow-xs transition-colors"
                    >
                      <span>Download Class Notes</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#c48b28]" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
