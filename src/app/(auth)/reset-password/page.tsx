import React from "react";
import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set New Password",
  description:
    "Set a new password for your EduNova digital campus account at Kishoreganj Polytechnic Institute.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      mode="reset-password"
      title="Create New Password"
      subtitle="Your identity has been verified. Please define a strong, unique password to secure your institutional portal."
      visualHeadline="Modern Security Infrastructure for Digital Campus Operations"
      visualSubheadline="All password updates are cryptographically hashed and logged with security timestamps to maintain institutional integrity."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}

