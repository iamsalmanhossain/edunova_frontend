"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  BookOpen,
  Copy,
  Check,
  CheckCircle2,
  FileSpreadsheet,
  Code2,
  Award,
  ListOrdered,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { teacherService } from "@/services/teacher.service";
import { ResultGuideData } from "@/types/teacher";

interface ResultGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPasteJson?: () => void;
}

export default function ResultGuideModal({
  isOpen,
  onClose,
  onOpenPasteJson,
}: ResultGuideModalProps) {
  const [guideData, setGuideData] = useState<ResultGuideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    async function fetchGuide() {
      try {
        setLoading(true);
        const data = await teacherService.getResultGuide();
        if (mounted) {
          setGuideData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load result guide:", err);
        if (mounted) setLoading(false);
      }
    }

    fetchGuide();
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleJson = guideData?.examples?.recommendedCopyPasteUsingRollNo
    ? JSON.stringify(guideData.examples.recommendedCopyPasteUsingRollNo, null, 2)
    : JSON.stringify(
        {
          subjectId: "3a3a6c21-81b6-4883-a3ef-1022eaea1aeb",
          examName: "Class Test 1",
          semester: 4,
          session: "2024-25",
          totalMarks: 20,
          passMarks: 8,
          publish: true,
          marks: [
            { rollNo: "610234", obtainedMarks: 18, remarks: "Excellent" },
            { rollNo: "610235", obtainedMarks: 14, remarks: "Good" },
          ],
        },
        null,
        2
      );

  const gradingScales = guideData?.gradingScale || [
    { marksPercentage: "80% - 100%", grade: "A+", gradePoint: 4.0, remarks: "Outstanding" },
    { marksPercentage: "75% - 79%", grade: "A", gradePoint: 3.75, remarks: "Excellent" },
    { marksPercentage: "70% - 74%", grade: "A-", gradePoint: 3.5, remarks: "Very Good" },
    { marksPercentage: "65% - 69%", grade: "B+", gradePoint: 3.25, remarks: "Good" },
    { marksPercentage: "60% - 64%", grade: "B", gradePoint: 3.0, remarks: "Satisfactory" },
    { marksPercentage: "55% - 59%", grade: "B-", gradePoint: 2.75, remarks: "Above Average" },
    { marksPercentage: "50% - 54%", grade: "C+", gradePoint: 2.5, remarks: "Average" },
    { marksPercentage: "45% - 49%", grade: "C", gradePoint: 2.25, remarks: "Pass" },
    { marksPercentage: "40% - 44%", grade: "D", gradePoint: 2.0, remarks: "Conditional Pass" },
    { marksPercentage: "Below 40%", grade: "F", gradePoint: 0.0, remarks: "Fail" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#dce3df] overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e2e8e4] bg-[#f8faf9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0a4b32]/10 flex items-center justify-center text-[#0a4b32]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#0f1f17]">
                  {guideData?.title || "Result Submission Guidelines (শিক্ষক রেজাল্ট গাইড)"}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  v{guideData?.version || "2.1"}
                </span>
              </div>
              <p className="text-xs text-[#5a6b62]">
                Official submission methods, BTEB grading scale, and copy-paste specifications
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Admin Custom Note if available */}
          {guideData?.customNotes && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">ইনস্টিটিউট অ্যাডমিন নোটিশ:</p>
                <p className="mt-0.5">{guideData.customNotes}</p>
              </div>
            </div>
          )}

          {/* 4-Step Submission Workflow */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-[#0a4b32]" />
              <h4 className="text-xs sm:text-sm font-bold text-[#0f1f17]">
                রেজাল্ট সাবমিশন ধাপসমূহ (Step-by-Step Workflow)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-[#e2e8e4] bg-[#fafbfc] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0a4b32] text-white text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <span className="text-xs font-bold text-[#0f1f17]">সেমিস্টার ও বিষয় নির্বাচন</span>
                </div>
                <p className="text-[11px] text-[#5a6b62] pl-7">
                  সেমিস্টার সিলেক্ট করলেই আপনার ডিপার্টমেন্টের নির্ধারিত বিষয়গুলো তালিকাভুক্ত হবে।
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#e2e8e4] bg-[#fafbfc] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0a4b32] text-white text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <span className="text-xs font-bold text-[#0f1f17]">পদ্ধতি বেছে নিন (Method)</span>
                </div>
                <p className="text-[11px] text-[#5a6b62] pl-7">
                  সরাসরি ফর্ম, JSON পেস্ট, অথবা Excel/CSV ফাইল আপলোডের মাধ্যমে রেজাল্ট দিতে পারেন।
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#e2e8e4] bg-[#fafbfc] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0a4b32] text-white text-[11px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <span className="text-xs font-bold text-[#0f1f17]">রোল ও প্রাপ্ত নম্বর ইনপুট</span>
                </div>
                <p className="text-[11px] text-[#5a6b62] pl-7">
                  ছাত্রদের বোর্ড রোল বা ক্লাস রোল ও নম্বর দিন। গ্রেড ও জিপিএ সিস্টেম স্বয়ংক্রিয়ভাবে হিসাব করবে।
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#e2e8e4] bg-[#fafbfc] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0a4b32] text-white text-[11px] font-bold flex items-center justify-center">
                    4
                  </span>
                  <span className="text-xs font-bold text-[#0f1f17]">পাবলিশ ও রিপোর্ট ডাউনলোড</span>
                </div>
                <p className="text-[11px] text-[#5a6b62] pl-7">
                  পাবলিশ করলে ছাত্ররা দেখতে পাবে। যে কোনো সময় ক্লাসের PDF মার্কশিট ও Excel রিপোর্ট ডাউনলোড করুন।
                </p>
              </div>
            </div>
          </div>

          {/* Ready-to-copy JSON format */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#0a4b32]" />
                <h4 className="text-xs sm:text-sm font-bold text-[#0f1f17]">
                  প্রস্তুত JSON ফরম্যাট (কপি করে সরাসরি পেস্ট করুন)
                </h4>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopyText("sampleJson", sampleJson)}
                className="h-7 px-2.5 text-xs font-semibold border-[#0a4b32]/30 text-[#0a4b32] hover:bg-emerald-50 rounded-lg flex items-center gap-1.5"
              >
                {copiedKey === "sampleJson" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </Button>
            </div>

            <pre className="p-3.5 rounded-xl bg-[#0f1f17] text-emerald-400 font-mono text-[11px] overflow-x-auto shadow-inner max-h-48 leading-relaxed">
              {sampleJson}
            </pre>
          </div>

          {/* Official BTEB Grading Scale Table */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#c48b28]" />
              <h4 className="text-xs sm:text-sm font-bold text-[#0f1f17]">
                অফিসিয়াল গ্রেডিং স্কেল ও জিপিএ পদ্ধতি (BTEB Grading Scale)
              </h4>
            </div>

            <div className="rounded-xl border border-[#dce3df] overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f0f7f3] text-[#0a4b32] font-bold border-b border-[#dce3df]">
                  <tr>
                    <th className="py-2.5 px-3.5">নম্বরের শতকরা হার (Marks %)</th>
                    <th className="py-2.5 px-3">লেটার গ্রেড (Grade)</th>
                    <th className="py-2.5 px-3">গ্রেড পয়েন্ট (GPA)</th>
                    <th className="py-2.5 px-3.5">মন্তব্য (Remarks)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8e4]">
                  {gradingScales.map((scale, i) => (
                    <tr key={i} className="hover:bg-black/[0.01]">
                      <td className="py-2 px-3.5 font-medium text-[#0f1f17]">{scale.marksPercentage}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            scale.grade === "A+"
                              ? "bg-emerald-100 text-emerald-900"
                              : scale.grade === "F"
                              ? "bg-red-100 text-red-900"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {scale.grade}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-semibold text-[#0a4b32]">{scale.gradePoint.toFixed(2)}</td>
                      <td className="py-2 px-3.5 text-[#5a6b62]">{scale.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Excel / CSV Rules */}
          <div className="p-4 rounded-xl border border-[#dce3df] bg-[#fafbfc] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#0f1f17]">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>এক্সেল ও সিএসভি ফাইলের প্রয়োজনীয় কলাম:</span>
            </div>
            <p className="text-[#5a6b62]">
              স্প্রেডশীটে অবশ্যই প্রথম রো-তে <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#dce3df] text-[#0f1f17]">Roll No</code> এবং{" "}
              <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#dce3df] text-[#0f1f17]">Obtained Marks</code> (বা <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#dce3df] text-[#0f1f17]">Marks</code>) থাকতে হবে।
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#e2e8e4] bg-[#f8faf9] flex items-center justify-between gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 px-4 text-xs font-semibold border-[#dce3df] hover:bg-black/5 rounded-xl"
          >
            Close
          </Button>

          {onOpenPasteJson && (
            <Button
              type="button"
              onClick={() => {
                onClose();
                onOpenPasteJson();
              }}
              className="h-10 px-4 text-xs font-bold bg-[#0a4b32] hover:bg-[#073825] text-white shadow-xs rounded-xl flex items-center gap-1.5"
            >
              <Code2 className="w-4 h-4 text-[#c48b28]" />
              <span>Open JSON Paste Tool</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

