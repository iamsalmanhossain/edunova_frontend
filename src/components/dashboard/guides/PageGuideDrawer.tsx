"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { academicFeaturesService } from "@/services/academic-features.service";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import {
  PageGuideData,
  GuideTargetRole,
  PageGuideSection,
  PageGuideFaq,
  CreatePageGuidePayload,
  UpdatePageGuidePayload,
} from "@/types/academic-features";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Lock,
  ShieldAlert,
  Edit3,
  RotateCcw,
  Plus,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";

interface PageGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pageKey: string;
  onPageKeyChange?: (newKey: string) => void;
}

export default function PageGuideDrawer({
  isOpen,
  onClose,
  pageKey,
  onPageKeyChange,
}: PageGuideDrawerProps) {
  // Current user & role
  const storeUser = useAuthStore((s) => s.user);
  const currentUser = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);
  const userRole = currentUser?.role?.toUpperCase();
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  // State
  const [activeKey, setActiveKey] = useState<string>(pageKey);
  const [guide, setGuide] = useState<PageGuideData | null>(null);
  const [availableGuides, setAvailableGuides] = useState<PageGuideData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [accessForbidden, setAccessForbidden] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Admin Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [savingAdmin, setSavingAdmin] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Form State for Edit/Create
  const [formPageKey, setFormPageKey] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formTargetRole, setFormTargetRole] = useState<GuideTargetRole>("ALL");
  const [formBadge, setFormBadge] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formSections, setFormSections] = useState<PageGuideSection[]>([]);
  const [formFaqs, setFormFaqs] = useState<PageGuideFaq[]>([]);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast((c) => (c === msg ? null : c));
    }, 4000);
  };

  // Sync activeKey with prop
  useEffect(() => {
    if (pageKey) {
      setActiveKey(pageKey);
    }
  }, [pageKey]);

  // 1. Fetch available guide list for current role via GET /api/v1/dashboard/guides
  const loadAvailableGuides = useCallback(async () => {
    try {
      setLoadingList(true);
      const list = await academicFeaturesService.listAllGuides();
      setAvailableGuides(list || []);
    } catch (err) {
      console.warn("Could not load guide list:", err);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadAvailableGuides();
    }
  }, [isOpen, loadAvailableGuides]);

  // 2. Load the specific guide for activeKey
  const loadGuide = useCallback(async (key: string) => {
    if (!key) return;
    try {
      setLoading(true);
      setAccessForbidden(false);
      const data = await academicFeaturesService.getPageGuide(key);
      setGuide(data);
    } catch (err: unknown) {
      const status =
        (err as { status?: number; statusCode?: number; data?: { statusCode?: number } })?.status ??
        (err as { statusCode?: number })?.statusCode ??
        (err as { data?: { statusCode?: number } })?.data?.statusCode;

      if (status === 403) {
        setAccessForbidden(true);
        setGuide(null);
      } else {
        console.warn("Could not load page guide:", err);
        setGuide(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && activeKey) {
      loadGuide(activeKey);
    }
  }, [isOpen, activeKey, loadGuide]);

  // Handle Switcher change
  const handleSelectKey = (key: string) => {
    setActiveKey(key);
    onPageKeyChange?.(key);
  };

  // Populate Edit Form
  const openEditModal = () => {
    if (!guide) return;
    setFormPageKey(guide.pageKey);
    setFormTitle(guide.title || "");
    setFormTargetRole(guide.targetRole || "ALL");
    setFormBadge(guide.badge || "");
    setFormSummary(guide.summary || "");
    setFormSubtitle(guide.subtitle || "");
    setFormSections(guide.sections ? JSON.parse(JSON.stringify(guide.sections)) : []);
    setFormFaqs(guide.faqs || guide.quickFaq ? JSON.parse(JSON.stringify(guide.faqs || guide.quickFaq)) : []);
    setAdminError(null);
    setIsEditModalOpen(true);
  };

  // Populate Create Form
  const openCreateModal = () => {
    setFormPageKey("");
    setFormTitle("");
    setFormTargetRole("TEACHER");
    setFormBadge("");
    setFormSummary("");
    setFormSubtitle("");
    setFormSections([
      {
        title: "Section 1",
        description: "Overview and guidelines",
        steps: ["Step 1", "Step 2"],
        tips: ["Tip 1"],
      },
    ]);
    setFormFaqs([{ question: "", answer: "" }]);
    setAdminError(null);
    setIsCreateModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setAdminError("Please provide a title.");
      return;
    }

    try {
      setSavingAdmin(true);
      setAdminError(null);
      const payload: UpdatePageGuidePayload = {
        title: formTitle.trim(),
        targetRole: formTargetRole,
        badge: formBadge.trim(),
        summary: formSummary.trim(),
        subtitle: formSubtitle.trim() || undefined,
        sections: formSections.filter((s) => s.title.trim()),
        faqs: formFaqs.filter((f) => f.question.trim()),
      };

      await academicFeaturesService.updatePageGuide(activeKey, payload);
      showToast(`Documentation for "${activeKey}" updated successfully!`);
      setIsEditModalOpen(false);
      await loadGuide(activeKey);
      await loadAvailableGuides();
    } catch (err: unknown) {
      setAdminError(err instanceof Error ? err.message : "Failed to update documentation");
    } finally {
      setSavingAdmin(false);
    }
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPageKey.trim() || !formTitle.trim()) {
      setAdminError("Please provide both page key and title.");
      return;
    }

    try {
      setSavingAdmin(true);
      setAdminError(null);
      const payload: CreatePageGuidePayload = {
        pageKey: formPageKey.trim().toLowerCase().replace(/\s+/g, "-"),
        title: formTitle.trim(),
        targetRole: formTargetRole,
        badge: formBadge.trim() || "Module Guide",
        summary: formSummary.trim() || formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        sections: formSections.filter((s) => s.title.trim()),
        faqs: formFaqs.filter((f) => f.question.trim()),
      };

      await academicFeaturesService.createPageGuide(payload);
      showToast(`New guide "${payload.pageKey}" created successfully!`);
      setIsCreateModalOpen(false);
      setActiveKey(payload.pageKey);
      onPageKeyChange?.(payload.pageKey);
      await loadGuide(payload.pageKey);
      await loadAvailableGuides();
    } catch (err: unknown) {
      setAdminError(err instanceof Error ? err.message : "Failed to create documentation");
    } finally {
      setSavingAdmin(false);
    }
  };

  // Handle Reset to Default (Admin Only)
  const handleResetToDefault = async () => {
    if (!confirm(`Are you sure you want to reset "${activeKey}" to default system documentation? Custom edits will be deleted.`)) {
      return;
    }

    try {
      setIsResetting(true);
      await academicFeaturesService.resetPageGuide(activeKey);
      showToast(`Documentation for "${activeKey}" reset to default!`);
      await loadGuide(activeKey);
      await loadAvailableGuides();
    } catch (err: unknown) {
      showToast("Failed to reset guide: " + (err instanceof Error ? err.message : "Error"));
    } finally {
      setIsResetting(false);
    }
  };

  // Switcher Options
  const switcherOptions = useMemo(() => {
    if (availableGuides.length > 0) {
      return availableGuides.map((g) => ({
        key: g.pageKey,
        label: `${g.title} (${g.targetRole || "ALL"})`,
      }));
    }

    // Role-based sensible defaults while loading
    if (userRole === "TEACHER") {
      return [
        { key: "teacher-attendance", label: "Teacher: Attendance Management" },
        { key: "teacher-marks", label: "Teacher: Marks & Results" },
        { key: "teacher-diary", label: "Teacher: Class Diary & Notes" },
      ];
    }
    if (userRole === "STUDENT") {
      return [
        { key: "student-overview", label: "Student: Academic Dashboard" },
        { key: "student-claim", label: "Student: Claim Roll Account" },
      ];
    }
    if (isAdmin) {
      return [
        { key: "admin-overview", label: "Admin: System Operations" },
        { key: "teacher-attendance", label: "Teacher: Attendance Management" },
        { key: "teacher-marks", label: "Teacher: Marks & Results" },
        { key: "teacher-diary", label: "Teacher: Class Diary & Notes" },
        { key: "student-overview", label: "Student: Academic Dashboard" },
        { key: "student-claim", label: "Student: Claim Roll Account" },
      ];
    }
    return [{ key: "student-claim", label: "Student: Claim Roll Account" }];
  }, [availableGuides, userRole, isAdmin]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-60 bg-[#073825] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#0a4b32] text-xs font-bold animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

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
                <span className="text-[9px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded">
                  গাইডলাইন
                </span>
                {guide?.targetRole && (
                  <Badge
                    variant="outline"
                    className="text-[9px] font-mono border-white/30 text-white/90 bg-white/10"
                  >
                    Role: {guide.targetRole}
                  </Badge>
                )}
                {guide?.customizedByAdmin && (
                  <Badge
                    variant="outline"
                    className="text-[9px] border-amber-400/50 text-amber-300 bg-amber-400/15"
                  >
                    Customized
                  </Badge>
                )}
              </div>
              <h2 className="text-base font-bold mt-0.5 line-clamp-1">
                {guide?.title || (accessForbidden ? "Access Restricted" : "System Documentation")}
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

        {/* Switcher Bar & Admin Actions */}
        <div className="p-3 bg-[#f7faf8] border-b border-[#dce3df] space-y-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5a6b62] shrink-0">Topic:</span>
            <select
              value={activeKey}
              onChange={(e) => handleSelectKey(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg border border-[#dce3df] bg-white text-xs font-semibold text-[#0f1f17] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
            >
              {switcherOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Admin Management Toolbar */}
          {isAdmin && (
            <div className="pt-2 border-t border-[#e2e8e4] flex items-center justify-between gap-1.5">
              <span className="text-[10px] font-bold text-[#0a4b32] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#c48b28]" />
                Admin Controls:
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openCreateModal}
                  className="h-7 text-[10px] font-bold rounded-lg px-2 border-[#dce3df] text-[#0f1f17] hover:bg-[#eef7f2]"
                >
                  <Plus className="w-3 h-3 mr-1 text-[#0a4b32]" />
                  New Guide
                </Button>

                {guide && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={openEditModal}
                    className="h-7 text-[10px] font-bold rounded-lg px-2 border-[#dce3df] text-[#0a4b32] hover:bg-[#eef7f2]"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit Doc
                  </Button>
                )}

                {guide?.customizedByAdmin && (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isResetting}
                    onClick={handleResetToDefault}
                    className="h-7 text-[10px] font-semibold text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-lg px-2"
                    title="Reset back to system default"
                  >
                    {isResetting ? (
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    ) : (
                      <RotateCcw className="w-3 h-3 mr-1" />
                    )}
                    Reset Default
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-24 bg-gray-100 rounded-xl" />
              <div className="h-24 bg-gray-100 rounded-xl" />
            </div>
          ) : accessForbidden ? (
            /* 403 Forbidden Access Restricted State */
            <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-4 my-8 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-amber-950">
                  Access Restricted (403 Forbidden)
                </h3>
                <p className="text-xs text-amber-800 max-w-sm mx-auto leading-relaxed">
                  You do not have permission to view documentation for &quot;{activeKey}&quot;.
                  Under system RBAC rules, your current role ({userRole || "STUDENT"}) can only access guides tailored to your permissions.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const fallback = switcherOptions[0]?.key || "student-overview";
                    handleSelectKey(fallback);
                  }}
                  className="bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-bold rounded-xl h-9 px-4"
                >
                  Return to My Allowed Guides
                </Button>
              </div>
            </div>
          ) : !guide ? (
            <div className="text-center py-12 text-[#5a6b62] space-y-2">
              <HelpCircle className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-xs font-semibold">Documentation for this section is being updated.</p>
              {isAdmin && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openCreateModal}
                  className="text-xs rounded-xl mt-2"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Create It Now
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Subtitle / Intro */}
              {guide.subtitle && (
                <div className="p-4 rounded-xl bg-[#f0f7f3] border border-[#dce3df] text-xs text-[#0f1f17] font-medium leading-relaxed">
                  {guide.subtitle}
                </div>
              )}

              {/* Guide Summary */}
              {guide.summary && (
                <p className="text-xs text-[#5a6b62] leading-relaxed italic border-l-2 border-[#0a4b32] pl-3 py-0.5">
                  {guide.summary}
                </p>
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
              {(guide.faqs || guide.quickFaq) && (guide.faqs?.length || guide.quickFaq?.length) ? (
                <div className="pt-4 border-t border-[#dce3df] space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#0a4b32]">
                    Frequently Asked Questions (FAQ)
                  </h3>

                  <div className="space-y-2">
                    {(guide.faqs || guide.quickFaq || []).map((faq, fIdx) => {
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
              ) : null}

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
        <div className="p-4 bg-white border-t border-[#dce3df] flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            {guide?.updatedAt ? `Updated ${new Date(guide.updatedAt).toLocaleDateString()}` : "Official System Guide"}
          </span>
          <Button
            onClick={onClose}
            className="bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-bold px-5 h-9 rounded-xl"
          >
            Got It
          </Button>
        </div>
      </div>

      {/* ADMIN EDIT DOCUMENTATION MODAL */}
          </Sheet>
  );
}
