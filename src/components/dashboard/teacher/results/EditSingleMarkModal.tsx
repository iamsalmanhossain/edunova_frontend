"use client";

import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { teacherService } from "@/services/teacher.service";
import { TeacherResultDetailStudent } from "@/types/teacher";

interface EditSingleMarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultId: string;
  totalMarks: number;
  student: TeacherResultDetailStudent | null;
  onMarkUpdated: (studentId: string, obtainedMarks: number, remarks?: string) => void;
}

function EditSingleMarkForm({
  onClose,
  resultId,
  totalMarks,
  student,
  onMarkUpdated,
}: {
  onClose: () => void;
  resultId: string;
  totalMarks: number;
  student: TeacherResultDetailStudent;
  onMarkUpdated: (studentId: string, obtainedMarks: number, remarks?: string) => void;
}) {
  const [obtainedMarks, setObtainedMarks] = useState<number | string>(() => {
    return student.marksEntry?.obtainedMarks ?? 0;
  });
  const [remarks, setRemarks] = useState<string>(() => {
    return student.marksEntry?.remarks || "";
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericMarks = typeof obtainedMarks === "number" ? obtainedMarks : parseFloat(String(obtainedMarks)) || 0;
    if (numericMarks < 0) {
      setError("Obtained marks cannot be negative.");
      return;
    }
    if (numericMarks > totalMarks) {
      setError(`Obtained marks cannot exceed total marks (${totalMarks}).`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await teacherService.updateSingleMark(resultId, student.studentId, {
        obtainedMarks: numericMarks,
        remarks: remarks.trim() || undefined,
      });

      setSuccess(true);
      onMarkUpdated(student.studentId, numericMarks, remarks.trim() || undefined);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Failed to update student marks.");
    } finally {
      setSubmitting(false);
    }
  };

  const numObtained = typeof obtainedMarks === "number" ? obtainedMarks : parseFloat(String(obtainedMarks)) || 0;
  const percentage = totalMarks > 0 ? ((numObtained / totalMarks) * 100).toFixed(1) : "0";

  return (
    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[#dce3df] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="p-5 border-b border-[#f0f4f1] flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-[#0f1f17]">Edit Student Mark</h2>
          <p className="text-xs text-[#5a6b62]">
            {student.name} (Roll: {student.rollNo})
          </p>
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
            <span>Mark updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="edit-marks" className="text-xs font-bold text-[#0f1f17]">
              Obtained Marks (Out of {totalMarks}) *
            </Label>
            <span className="text-xs font-extrabold text-[#0a4b32]">{percentage}%</span>
          </div>
          <Input
            id="edit-marks"
            type="number"
            step="any"
            min="0"
            max={totalMarks}
            placeholder="0"
            value={obtainedMarks}
            onFocus={(e) => {
              if (e.target.value === "0") setObtainedMarks("");
            }}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") {
                setObtainedMarks("");
              } else {
                const clean = raw.length > 1 && raw.startsWith("0") && !raw.startsWith("0.")
                  ? raw.replace(/^0+/, "")
                  : raw;
                setObtainedMarks(clean);
              }
            }}
            onBlur={() => {
              if (obtainedMarks === "" || isNaN(Number(obtainedMarks))) {
                setObtainedMarks(0);
              }
            }}
            required
            className="mt-1 text-sm font-semibold text-[#0f1f17]"
          />
        </div>

        <div>
          <Label htmlFor="edit-remarks" className="text-xs font-bold text-[#0f1f17]">
            Remarks (Optional)
          </Label>
          <Input
            id="edit-remarks"
            placeholder="e.g. Excellent conceptual clarity, Good performance"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="mt-1 text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#f0f4f1]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="h-9 px-4 text-xs font-medium cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="h-9 px-5 text-xs font-bold bg-[#0a4b32] hover:bg-[#073825] text-white cursor-pointer"
          >
            {submitting ? "Saving..." : "Save Mark"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function EditSingleMarkModal(props: EditSingleMarkModalProps) {
  if (!props.isOpen || !props.student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <EditSingleMarkForm
        key={props.student.studentId}
        onClose={props.onClose}
        resultId={props.resultId}
        totalMarks={props.totalMarks}
        student={props.student}
        onMarkUpdated={props.onMarkUpdated}
      />
    </div>
  );
}
