"use client";

import React, { useState } from "react";
import { UserAccountStatus } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Loader2, X } from "lucide-react";

interface UserStatusModalProps {
  user: {
    id: string;
    name: string;
    currentStatus: UserAccountStatus;
  } | null;
  onClose: () => void;
  onSubmit: (userId: string, newStatus: UserAccountStatus) => Promise<void>;
}

export default function UserStatusModal({
  user,
  onClose,
  onSubmit,
}: UserStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<UserAccountStatus>(
    user?.currentStatus || "ACTIVE"
  );
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit(user.id, selectedStatus);
      onClose();
    } catch (err: unknown) {
      alert("Failed to update user status: " + (err instanceof Error ? err.message : "Error"));
    } finally {
      setLoading(false);
    }
  };

  const statusOptions: { label: string; value: UserAccountStatus; desc: string; color: string }[] = [
    {
      label: "Active",
      value: "ACTIVE",
      desc: "Full access to login, take roll call, and submit student marks.",
      color: "border-emerald-500 bg-emerald-50/50 text-emerald-950",
    },
    {
      label: "Suspended",
      value: "SUSPENDED",
      desc: "Temporarily revokes all active JWT sessions and blocks login.",
      color: "border-rose-500 bg-rose-50/50 text-rose-950",
    },
    {
      label: "Deactivated",
      value: "DEACTIVATED",
      desc: "Account is retired or permanently blocked from the campus network.",
      color: "border-gray-400 bg-gray-50 text-gray-900",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#dce3df] shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0f4f1]">
          <div className="flex items-center gap-2 text-[#0f1f17]">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold">Manage Account Status</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#5a6b62]">
          Update account access permissions for <span className="font-bold text-[#0f1f17]">{user.name}</span>.
        </p>

        <div className="space-y-2.5">
          {statusOptions.map((opt) => (
            <label
              key={opt.value}
              onClick={() => setSelectedStatus(opt.value)}
              className={`block p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedStatus === opt.value
                  ? opt.color + " ring-1 ring-offset-1"
                  : "border-[#e2e8e4] bg-[#fcfdfc] text-[#5a6b62] hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{opt.label}</span>
                <input
                  type="radio"
                  name="status"
                  value={opt.value}
                  checked={selectedStatus === opt.value}
                  onChange={() => setSelectedStatus(opt.value)}
                  className="accent-[#0a4b32]"
                />
              </div>
              <p className="text-[11px] mt-1 opacity-80">{opt.desc}</p>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0f4f1]">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl text-xs h-9">
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={loading || selectedStatus === user.currentStatus}
            onClick={handleSubmit}
            className="bg-[#0a4b32] hover:bg-[#073825] text-white rounded-xl text-xs h-9 px-4 font-bold"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
            Save Status
          </Button>
        </div>
      </div>
    </div>
  );
}

