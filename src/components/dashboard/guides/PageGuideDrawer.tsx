"use client";

import React, { useEffect, useState } from "react";
import { academicFeaturesService } from "@/services/academic-features.service";
import { PageGuideData } from "@/types/academic-features";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Building,
} from "lucide-react";

interface PageGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pageKey: string;
  onPageKeyChange?: (newKey: string) => void;
}

const AVAILABLE_GUIDES: { key: string; label: string }[] = [
  { key: "teacher-attendance", label: "Teacher: Attendance Management" },
  { key: "teacher-marks", label: "Teacher: Marks & Results" },
  { key: "teacher-diary", label: "Teacher: Class Diary & Notes" },
  { key: "student-overview", label: "Student: Academic Dashboard" },
  { key: "student-claim", label: "Student: Claim Roll Account" },
  { key: "admin-overview", label: "Admin: System Operations" },
];

export default function PageGuideDrawer({
  isOpen,
  onClose,
  pageKey,
  onPageKeyChange,
}: PageGuideDrawerProps) {
  const [activeKey, setActiveKey] = useState<string>(pageKey);
  const [guide, setGuide] = useState<PageGuideData | null>(null);
  const [loading, setLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    if (pageKey) {
      setActiveKey(pageKey);
    }
  }, [pageKey]);

  useEffect(() => {
    if (!isOpen || !activeKey) return;

    let mounted = true;
    async function loadGuide() {
      try {
        setLoading(true);
        const data = await academicFeaturesService.getPageGuide(activeKey);
        if (mounted) {
          setGuide(data);
        }
      } catch (err) {
        console.warn("Could not load page guide:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadGuide();
    return () => {
      mounted = false;
    };
  }, [isOpen, activeKey]);

  if (!isOpen) return null;

  const handleSelectKey = (key: string) => {
    setActiveKey(key);
    onPageKeyChange?.(key);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden border-l border-[#dce3df] animate-in slide-in-from-right duration-250"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="p-5 bg-[#0a4b32] text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-[#c48b28]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#c48b28]">
                  Help & Documentation
                </span>
                <span className="text-[9px] bg-white/20 text-white font-bold px-1.5 py-0.2 rounded">
                  গাইডলাইন
                </span>
              </div>
              <h2 className="text-base font-bold mt-0.5">
                {guide?.title || "System Documentation"}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guide Switcher Bar */}
        <div className="p-3 bg-[#f7faf8] border-b border-[#dce3df] flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-[#5a6b62] shrink-0">Switch Topic:</span>
          <select
            value={activeKey}
            onChange={(e) => handleSelectKey(e.target.value)}
            className="w-full h-8 px-2.5 rounded-lg border border-[#dce3df] bg-white text-xs font-semibold text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
          >
            {AVAILABLE_GUIDES.map((g) => (
              <option key={g.key} value={g.key}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-24 bg-gray-100 rounded-xl" />
              <div className="h-24 bg-gray-100 rounded-xl" />
            </div>
          ) : !guide ? (
            <div className="text-center py-12 text-[#5a6b62] space-y-2">
              <HelpCircle className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-xs font-semibold">Documentation for this section is being updated.</p>
            </div>
          ) : (
            <>
              {/* Subtitle / Intro */}
              {guide.subtitle && (
                <div className="p-4 rounded-xl bg-[#f0f7f3] border border-[#dce3df] text-xs text-[#0f1f17] font-medium leading-relaxed">
                  {guide.subtitle}
                </div>
              )}

              {/* Guide Sections */}
              <div className="space-y-5">
                {guide.sections?.map((section, idx) => (
                  <div
                    key={section.id || idx}
                    className="p-4 rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0a4b32] text-white text-[11px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-[#0f1f17]">
                        {section.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#5a6b62] leading-relaxed">
                      {section.description}
                    </p>

                    {/* Step-by-step points */}
                    {section.steps && section.steps.length > 0 && (
                      <div className="mt-2 space-y-1.5 pl-2">
                        {section.steps.map((st, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start gap-2 text-xs text-[#0f1f17]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pro Tips */}
                    {section.tips && section.tips.length > 0 && (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Helpful Tips</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1">
                          {section.tips.map((t, tIdx) => (
                            <li key={tIdx}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Warning alert */}
                    {section.warning && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">Important:</strong>{" "}
                          <span>{section.warning}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* FAQs Accordion */}
              {guide.faqs && guide.faqs.length > 0 && (
                <div className="pt-4 border-t border-[#dce3df] space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#0a4b32]">
                    Frequently Asked Questions (FAQ)
                  </h3>

                  <div className="space-y-2">
                    {guide.faqs.map((faq, fIdx) => {
                      const isOpen = openFaqIndex === fIdx;
                      return (
                        <div
                          key={fIdx}
                          className="rounded-xl border border-[#dce3df] overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenFaqIndex(isOpen ? null : fIdx)
                            }
                            className="w-full p-3 bg-white text-left text-xs font-bold text-[#0f1f17] flex items-center justify-between gap-2 hover:bg-[#f7faf8] transition-colors"
                          >
                            <span>{faq.question}</span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-[#0a4b32] shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#5a6b62] shrink-0" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="p-3 bg-[#fcfdfc] border-t border-[#f0f4f1] text-xs text-[#5a6b62] leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Support Contact Footer */}
              {guide.supportContact && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                  <h4 className="font-bold text-[#0f1f17]">
                    Need Further Assistance?
                  </h4>
                  <div className="space-y-1 text-[#5a6b62]">
                    {guide.supportContact.email && (
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#0a4b32]" />
                        <span>Email: {guide.supportContact.email}</span>
                      </p>
                    )}
                    {guide.supportContact.phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#0a4b32]" />
                        <span>Support Line: {guide.supportContact.phone}</span>
                      </p>
                    )}
                    {guide.supportContact.office && (
                      <p className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#0a4b32]" />
                        <span>Desk: {guide.supportContact.office}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-white border-t border-[#dce3df] flex items-center justify-end">
          <Button
            onClick={onClose}
            className="bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-bold px-5 h-9 rounded-xl"
          >
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
}

