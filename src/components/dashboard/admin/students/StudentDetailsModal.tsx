"use client";

import React, { useState } from "react";
import { AdminStudentItem, UpdateStudentPayload } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { appToast } from "@/store/useToastStore";
import {
  X,
  Users,
  Building2,
  Phone,
  Mail,
  Loader2,
  Edit2,
  Save,
  MapPin,
  Heart,
  Calendar,
} from "lucide-react";

interface StudentDetailsModalProps {
  student: AdminStudentItem | null;
  onClose: () => void;
  onSave: (id: string, payload: UpdateStudentPayload) => Promise<void>;
}

export default function StudentDetailsModal({
  student,
  onClose,
  onSave,
}: StudentDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const profile = student?.studentProfile;
  const [name, setName] = useState(student?.name || "");
  const [phone, setPhone] = useState(student?.phone || "");
  const [rollNo, setRollNo] = useState(profile?.rollNo || "");
  const [registrationNo, setRegistrationNo] = useState(profile?.registrationNo || "");
  const [semester, setSemester] = useState(profile?.semester || 1);
  const [shift, setShift] = useState(profile?.shift || "FIRST");
  const [session, setSession] = useState(profile?.session || "");
  const [bloodGroup, setBloodGroup] = useState(profile?.bloodGroup || "");
  const [guardianName, setGuardianName] = useState(profile?.guardianName || "");
  const [guardianPhone, setGuardianPhone] = useState(profile?.guardianPhone || "");
  const [address, setAddress] = useState(profile?.address || "");

  if (!student) return null;

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await onSave(student.id, {
        name,
        phone,
        studentProfile: {
          rollNo,
          registrationNo,
          semester: Number(semester),
          shift,
          session,
          bloodGroup,
          guardianName,
          guardianPhone,
          address,
        },
      });
      setIsEditing(false);
      appToast.success("Student details updated successfully!", "Student Updated");
    } catch (err: unknown) {
      appToast.error("Failed to update student: " + (err instanceof Error ? err.message : "Error"), "Update Failed");
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
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0f1f17]">
                Student Registry Record
              </h3>
              <p className="text-xs text-[#5a6b62]">
                Official Academic Identity
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
          {/* Status Badge */}
          <div className="flex items-center gap-2 pb-2 border-b border-[#f0f4f1]">
            <Badge
              className={`text-xs font-bold ${
                student.status === "ACTIVE"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : student.status === "SUSPENDED"
                  ? "bg-rose-100 text-rose-800 border-rose-200"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              Account Status: {student.status}
            </Badge>
            <span className="text-xs text-[#5a6b62]">
              Department: {profile?.department?.name || "Unassigned"}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
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
                  <label className="font-semibold text-[#0f1f17] block mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0f1f17] block mb-1">Roll No</label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0f1f17] block mb-1">Registration No</label>
                  <input
                    type="text"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#0f1f17] block mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
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
                  <label className="font-semibold text-[#0f1f17] block mb-1">Session</label>
                  <input
                    type="text"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    placeholder="2023-24"
                    className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#0f1f17] block mb-1">Guardian Name</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0f1f17] block mb-1">Guardian Phone</label>
                  <input
                    type="text"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#0f1f17] block mb-1">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e2e8e4] focus:outline-none focus:ring-1 focus:ring-[#0a4b32]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#0f1f17]">{student.name}</p>
                  <p className="text-xs text-[#5a6b62]">{student.email}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#0a4b32] text-sm block">Roll: {profile?.rollNo}</span>
                  <span className="text-[11px] text-[#5a6b62] font-mono">Reg: {profile?.registrationNo}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[#5a6b62] flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Institute &amp; Department:
                </span>
                <p className="font-bold text-[#0f1f17] flex items-center gap-2">
                  <span>{profile?.institute?.name || "Kishoreganj Polytechnic Institute"}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#0a4b32]/10 text-[#0a4b32] border border-[#0a4b32]/25">
                    {profile?.institute?.code || "KIPI"}
                  </span>
                </p>
                <p className="text-xs text-[#5a6b62]">
                  Department: <span className="font-semibold text-[#0f1f17]">{profile?.department?.name || "General"}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[#5a6b62] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Semester &amp; Shift:
                  </span>
                  <p className="font-bold text-[#0f1f17]">
                    Semester {profile?.semester} • {profile?.shift === "SECOND_SHIFT" || profile?.shift === "SECOND" ? "Shift 2 (Day)" : "Shift 1 (Morning)"}
                  </p>
                  <p className="text-[11px] text-[#5a6b62]">Session: {profile?.session || "N/A"}</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[#5a6b62] flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-500" /> Blood Group:
                  </span>
                  <p className="font-bold text-[#0f1f17]">{profile?.bloodGroup || "Not recorded"}</p>
                  <p className="text-[11px] text-[#5a6b62]">Phone: {student.phone || "N/A"}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[#5a6b62]">Guardian Contact:</span>
                <p className="font-semibold text-[#0f1f17]">
                  {profile?.guardianName || "N/A"} ({profile?.guardianPhone || "No contact"})
                </p>
              </div>

              {profile?.address && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[#5a6b62] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Permanent Address:
                  </span>
                  <p className="font-medium text-[#0f1f17]">{profile.address}</p>
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
              <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Student
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

