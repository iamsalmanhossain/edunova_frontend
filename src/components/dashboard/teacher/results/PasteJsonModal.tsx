"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Code2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TeacherSubject } from "@/types/teacher";
import { teacherService } from "@/services/teacher.service";

interface PasteJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: TeacherSubject[];
  onImportSuccess: () => void;
}

export default function PasteJsonModal({
  isOpen,
  onClose,
  subjects,
  onImportSuccess,
}: PasteJsonModalProps) {
  const [jsonText, setJsonText] = useState<string>("");
  const [publishImmediately, setPublishImmediately] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<{
    examName?: string;
    semester?: number;
    totalMarks?: number;
    passMarks?: number;
    studentCount?: number;
    isValid: boolean;
  } | null>(null);
  const [copiedSample, setCopiedSample] = useState(false);

  // Generate dynamic sample JSON based on teacher's actual subject if available
  const defaultSubject = subjects[0] || {
    id: "3a3a6c21-81b6-4883-a3ef-1022eaea1aeb",
    name: "Data Structures & Algorithms",
    code: "66641",
    semester: 4,
  };

  const sampleJsonString = JSON.stringify(
    {
      subjectId: defaultSubject.id,
      examName: "Class Test 1",
      semester: defaultSubject.semester || 4,
      session: "2024-25",
      shift: "FIRST",
      totalMarks: 20,
      passMarks: 8,
      publish: true,
      marks: [
        { rollNo: "610234", obtainedMarks: 18, remarks: "Excellent" },
        { rollNo: "610235", obtainedMarks: 15, remarks: "Good" },
        { rollNo: "610236", obtainedMarks: 12, remarks: "Satisfactory" },
        { rollNo: "610237", obtainedMarks: 7, remarks: "Needs improvement" },
      ],
    },
    null,
    2
  );

  // Live validator effect
  useEffect(() => {
    if (!jsonText.trim()) {
      setParsedPreview(null);
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonText.trim());
      if (typeof parsed === "object" && parsed !== null) {
        const marksList = Array.isArray(parsed.marks)
          ? parsed.marks
          : Array.isArray(parsed.results)
          ? parsed.results
          : null;

        setParsedPreview({
          examName: parsed.examName || "Unnamed Exam",
          semester: parsed.semester,
          totalMarks: parsed.totalMarks,
          passMarks: parsed.passMarks,
          studentCount: marksList ? marksList.length : 0,
          isValid: true,
        });
        setError(null);
      } else {
        setParsedPreview(null);
        setError("Root element must be a valid JSON object");
      }
    } catch (err: unknown) {
      setParsedPreview(null);
      const msg = err instanceof Error ? err.message : "Invalid JSON syntax";
      setError(`JSON Syntax Error: ${msg}`);
    }
  }, [jsonText]);

  if (!isOpen) return null;

  const handleLoadSample = () => {
    setJsonText(sampleJsonString);
    setError(null);
  };

  const handleCopySample = () => {
    navigator.clipboard.writeText(sampleJsonString);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!jsonText.trim()) {
      setError("Please paste your JSON result payload into the box.");
      return;
    }

    try {
      setSubmitting(true);
      let payloadToSubmit: any;

      try {
        const parsed = JSON.parse(jsonText.trim());
        // Auto-override publish flag if user checked/unchecked toggle
        if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
          payloadToSubmit = {
            ...parsed,
            publish: publishImmediately,
          };
        } else {
          payloadToSubmit = { rawJson: jsonText.trim(), publish: publishImmediately };
        }
      } catch {
        payloadToSubmit = { rawJson: jsonText.trim(), publish: publishImmediately };
      }

      await teacherService.pasteJsonResult(payloadToSubmit);
      onImportSuccess();
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { message?: string; response?: { data?: { message?: string } } };
      const msg =
        errorObj.response?.data?.message ||
        errorObj.message ||
        "Failed to import results via JSON. Please verify subject ID and format.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#dce3df] overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e2e8e4] bg-[#f8faf9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0a4b32]/10 flex items-center justify-center text-[#0a4b32]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#0f1f17]">
                  Paste JSON Result Entry
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Fast Import
                </span>
              </div>
              <p className="text-xs text-[#5a6b62]">
                Paste pre-formatted JSON or copy sample format to enter student marks quickly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5a6b62] hover:text-[#0f1f17] hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Action Row: Load Sample & Copy Format */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#f0f7f3] border border-[#dce3df]">
            <div className="flex items-center gap-2 text-xs text-[#0a4b32] font-semibold">
              <Sparkles className="w-4 h-4 text-[#c48b28]" />
              <span>Need the standard JSON structure?</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleCopySample}
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs font-semibold border-[#0a4b32]/30 text-[#0a4b32] hover:bg-emerald-50 rounded-lg flex items-center gap-1.5"
              >
                {copiedSample ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSample ? "Copied!" : "Copy Format"}
              </Button>
              <Button
                type="button"
                onClick={handleLoadSample}
                size="sm"
                className="h-8 px-3 text-xs font-bold bg-[#0a4b32] hover:bg-[#073825] text-white rounded-lg flex items-center gap-1.5"
              >
                Load Sample JSON
              </Button>
            </div>
          </div>

          {/* JSON Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-[#0f1f17]">
                Paste Raw JSON Content <span className="text-red-500">*</span>
              </Label>
              <span className="text-[11px] text-[#5a6b62]">
                Supports <code className="text-[#0a4b32] font-mono">rollNo</code> or <code className="text-[#0a4b32] font-mono">studentId</code>
              </span>
            </div>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder={`{\n  "subjectId": "${defaultSubject.id}",\n  "examName": "Class Test 1",\n  "semester": 4,\n  "session": "2024-25",\n  "totalMarks": 20,\n  "marks": [\n    { "rollNo": "610234", "obtainedMarks": 18 },\n    { "rollNo": "610235", "obtainedMarks": 15 }\n  ]\n}`}
              rows={9}
              className="w-full font-mono text-xs p-3.5 rounded-xl border border-[#dce3df] bg-[#fafbfc] text-[#0f1f17] focus:outline-none focus:ring-2 focus:ring-[#0a4b32] focus:bg-white transition-all shadow-inner"
              spellCheck={false}
            />
          </div>

          {/* Live Validation Preview Pill */}
          {parsedPreview && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Exam: <strong>{parsedPreview.examName}</strong> (Sem {parsedPreview.semester || "—"}, {parsedPreview.totalMarks || 100} Marks)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-200/60 font-bold text-[11px] text-emerald-950">
                {parsedPreview.studentCount} Students Detected
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-2.5 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {/* Publish Checkbox */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-[#e2e8e4] bg-[#fbfdfc]">
            <input
              type="checkbox"
              id="publishNow"
              checked={publishImmediately}
              onChange={(e) => setPublishImmediately(e.target.checked)}
              className="w-4 h-4 text-[#0a4b32] rounded-md border-[#dce3df] focus:ring-[#0a4b32] cursor-pointer"
            />
            <label htmlFor="publishNow" className="text-xs text-[#0f1f17] font-medium cursor-pointer select-none">
              <span className="font-bold">Publish immediately to students</span> — students will see results on their portal right away
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#e2e8e4] bg-[#f8faf9] flex items-center justify-between gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 px-4 text-xs font-semibold border-[#dce3df] hover:bg-black/5 rounded-xl"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={submitting || !jsonText.trim() || !!error}
            className="h-10 px-5 text-xs font-bold bg-[#0a4b32] hover:bg-[#073825] text-white shadow-xs rounded-xl flex items-center gap-1.5 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Submitting Results...</span>
              </>
            ) : (
              <>
                <span>Submit & Import Results</span>
                <ArrowRight className="w-4 h-4 text-[#c48b28]" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

