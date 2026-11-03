"use client";

import React, { useState, useRef } from "react";
import { X, UploadCloud, FileSpreadsheet, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TeacherSubject, ExamType } from "@/types/teacher";
import { teacherService } from "@/services/teacher.service";

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: TeacherSubject[];
  currentShift: "FIRST_SHIFT" | "SECOND_SHIFT";
  onImportSuccess: () => void;
}

export default function ImportExcelModal({
  isOpen,
  onClose,
  subjects,
  currentShift,
  onImportSuccess,
}: ImportExcelModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [subjectId, setSubjectId] = useState<string>(() => subjects[0]?.id || "");
  const [examName, setExamName] = useState<string>("");
  const [examType, setExamType] = useState<ExamType>("MID_TERM");
  const [semester, setSemester] = useState<number>(() => subjects[0]?.semester || 1);
  const [session, setSession] = useState<string>("2024-25");
  const [totalMarks, setTotalMarks] = useState<number>(100);
  const [passMarks, setPassMarks] = useState<number>(40);
  const [publish, setPublish] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>("");

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubjectChange = (id: string) => {
    setSubjectId(id);
    const sub = subjects.find((s) => s.id === id);
    if (sub) {
      setSemester(sub.semester);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDownloadSampleCsv = () => {
    // Generate authoritative CSV template client-side if no existing exam id is given
    const sampleHeaders = "Roll No,Obtained Marks,Remarks\n619820,85,Good Performance\n619821,78,Satisfactory\n619822,92,Outstanding\n";
    const blob = new Blob([sampleHeaders], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Edunova_Marks_Import_Template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedFile) {
      setError("Please select an Excel (.xlsx) or CSV (.csv) file to import.");
      return;
    }
    if (!subjectId) {
      setError("Please select a subject.");
      return;
    }
    if (!examName.trim()) {
      setError("Please provide an Exam Name (e.g. Midterm Exam, Class Test 1).");
      return;
    }
    if (totalMarks <= 0) {
      setError("Total marks must be greater than 0.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("subjectId", subjectId);
      formData.append("examName", examName.trim());
      formData.append("examType", examType);
      formData.append("semester", semester.toString());
      formData.append("session", session.trim());
      formData.append("shift", currentShift);
      formData.append("totalMarks", totalMarks.toString());
      if (passMarks) formData.append("passMarks", passMarks.toString());
      formData.append("publish", publish ? "true" : "false");
      if (remarks.trim()) formData.append("remarks", remarks.trim());

      await teacherService.importResultsFromExcel(formData);
      setSuccess("Exam results imported successfully from spreadsheet!");
      onImportSuccess();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Failed to import results from spreadsheet. Please verify file format.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-[#dce3df] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-[#f0f4f1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0f1f17]">Import Marks via Excel / CSV</h2>
              <p className="text-xs text-[#5a6b62]">
                Upload student marks spreadsheet for batch result calculation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#f0f4f1] hover:bg-[#e4ece7] text-[#0f1f17] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Subject & Exam Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-bold text-[#0f1f17]">Course / Subject *</Label>
              <select
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                required
                className="mt-1 w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a4b32]"
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name} (Sem {s.semester})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs font-bold text-[#0f1f17]">Exam Title *</Label>
              <Input
                placeholder="e.g. Midterm Examination 2024"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                required
                className="mt-1 text-xs"
              />
            </div>
          </div>

          {/* Exam Type & Academic Session */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-bold text-[#0f1f17]">Exam Type *</Label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as ExamType)}
                className="mt-1 w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a4b32]"
              >
                <option value="MID_TERM">Midterm</option>
                <option value="CLASS_TEST">Class Test</option>
                <option value="FINAL">Final</option>
                <option value="QUIZ">Quiz</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="LAB">Practical / Lab</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-bold text-[#0f1f17]">Semester</Label>
              <Input
                type="number"
                min="1"
                max="8"
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="mt-1 text-xs font-semibold"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-[#0f1f17]">Academic Session *</Label>
              <Input
                placeholder="2024-25"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                required
                className="mt-1 text-xs"
              />
            </div>
          </div>

          {/* Total & Pass Marks */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-bold text-[#0f1f17]">Total Marks *</Label>
              <Input
                type="number"
                min="1"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                required
                className="mt-1 text-xs font-semibold"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-[#0f1f17]">Pass Marks</Label>
              <Input
                type="number"
                min="0"
                value={passMarks}
                onChange={(e) => setPassMarks(Number(e.target.value))}
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-bold text-[#0f1f17]">Batch Remarks (Optional)</Label>
            <Input
              placeholder="e.g. Midterm Excel Marks upload"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="mt-1 text-xs"
            />
          </div>

          {/* File Upload Drop Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-[#0f1f17]">
                Spreadsheet File (.xlsx, .csv) *
              </Label>
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="text-[11px] font-semibold text-[#0a4b32] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                Download Sample CSV
              </button>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                selectedFile
                  ? "border-[#0a4b32] bg-[#f0f7f3]"
                  : "border-[#dce3df] hover:border-[#0a4b32]/60 bg-[#f9fbfa]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud className="w-8 h-8 text-[#0a4b32] mx-auto mb-1.5" />
              {selectedFile ? (
                <div>
                  <p className="text-xs font-bold text-[#0f1f17]">{selectedFile.name}</p>
                  <p className="text-[10px] text-[#5a6b62]">
                    {(selectedFile.size / 1024).toFixed(1)} KB — Click to change file
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold text-[#0f1f17]">
                    Click to select Excel or CSV file
                  </p>
                  <p className="text-[10px] text-[#5a6b62]">
                    Columns required: &quot;Roll No&quot; and &quot;Obtained Marks&quot;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f4f7f5] border border-[#e2e8e4]">
            <div>
              <p className="text-xs font-bold text-[#0f1f17]">Publish Immediately</p>
              <p className="text-[11px] text-[#5a6b62]">
                Make marks visible to enrolled students right away
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0a4b32]" />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#f0f4f1]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={uploading}
              className="h-9 px-4 text-xs font-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploading || !selectedFile}
              className="h-9 px-5 text-xs font-bold bg-[#0a4b32] hover:bg-[#073825] text-white cursor-pointer"
            >
              {uploading ? "Importing Results..." : "Import Spreadsheet"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
