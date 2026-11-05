"use client";

import React, { useState } from "react";
import { AdminTeacherItem, UpdateTeacherPayload } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  UserCheck,
  Building2,
  Phone,
  Mail,
  GraduationCap,
  Loader2,
  Edit2,
  Save,
} from "lucide-react";

interface TeacherDetailsModalProps {
  teacher: AdminTeacherItem | null;
  onClose: () => void;
  onSave: (id: string, payload: UpdateTeacherPayload) => Promise<void>;
}

export default function TeacherDetailsModal({
  teacher,
  onClose,
  onSave,
}: TeacherDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(teacher?.name || "");
  const [phone, setPhone] = useState(teacher?.phone || "");
  const [designation, setDesignation] = useState(teacher?.teacherProfile?.designation || "");
  const [shift, setShift] = useState(teacher?.teacherProfile?.shift || "FIRST");
  const [qualification, setQualification] = useState(teacher?.teacherProfile?.qualification || "");
  const [bio, setBio] = useState(teacher?.teacherProfile?.bio || "");

  if (!teacher) return null;

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await onSave(teacher.id, {
        name,
        phone,
        teacherProfile: {
          designation,
          shift,
          qualification,
          bio,
        },
      });
      setIsEditing(false);
    } catch (err: unknown) {
      alert("Failed to update teacher: " + (err instanceof Error ? err.message : "Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-[#dce3df] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#e2e8e4] flex items-center justify-between bg-[#fcfdfc]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0f1f17]">
                Teacher Profile Details
              </h3>
              <p className="text-xs text-[#5a6b62]">
                Polytechnic Faculty Credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Status Badges */}
          <div className="flex items-center gap-2 pb-2 border-b border-[#f0f4f1]">
            <Badge
              className={`text-xs font-bold ${
                teacher.status === "ACTIVE"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : teacher.status === "SUSPENDED"
                  ? "bg-rose-100 text-rose-800 border-rose-200"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              Account: {teacher.status}
            </Badge>

            <Badge
              className={`text-xs font-bold ${
                teacher.teacherProfile?.approvalStatus === "APPROVED"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : teacher.teacherProfile?.approvalStatus === "REJECTED"
                  ? "bg-rose-100 text-rose-800 border-rose-200"
                  : "bg-amber-100 text-amber-800 border-amber-200"
              }`}
            >
              Approval: {teacher.teacherProfile?.approvalStatus || "PENDING"}
            </Badge>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-[#0f1f17] block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0f1f17] block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0f1f17] block mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Lecturer, Chief Instructor"
                  className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0f1f17] block mb-1">Shift</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                >
                  <option value="FIRST_SHIFT">Shift 1 (Morning)</option>
                  <option value="SECOND_SHIFT">Shift 2 (Day)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#0f1f17] block mb-1">Academic Qualification</label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. B.Sc in CSE (BUET)"
                  className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0f1f17] block mb-1">Professional Bio</label>
                <Textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[#5a6b62]">Full Name:</span>
                <p className="text-sm font-bold text-[#0f1f17]">{teacher.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[#5a6b62] flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email:
                  </span>
                  <p className="font-medium text-[#0f1f17] break-all">{teacher.email}</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[#5a6b62] flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone:
                  </span>
                  <p className="font-medium text-[#0f1f17]">{teacher.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[#5a6b62] flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Department &amp; Designation:
                </span>
                <p className="font-bold text-[#0f1f17]">
                  {teacher.teacherProfile?.department?.name || "Unassigned"} • {teacher.teacherProfile?.designation || "Lecturer"}
                </p>
                <p className="text-[11px] text-[#5a6b62]">
                  Shift: {teacher.teacherProfile?.shift === "SECOND_SHIFT" || teacher.teacherProfile?.shift === "SECOND" ? "Shift 2 (Day)" : "Shift 1 (Morning)"}
                </p>
              </div>

              {teacher.teacherProfile?.qualification && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[#5a6b62] flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> Qualification:
                  </span>
                  <p className="font-semibold text-[#0f1f17]">{teacher.teacherProfile.qualification}</p>
                </div>
              )}

              {teacher.teacherProfile?.rejectionReason && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
                  <span className="font-bold">Rejection Reason:</span>
                  <p className="italic">{teacher.teacherProfile.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#e2e8e4] bg-[#fcfdfc] flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl text-xs h-9">
            Close
          </Button>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={loading}
                onClick={handleUpdate}
                className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-9 px-4 font-bold"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}
                Save Changes
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-9 px-4 font-bold"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

