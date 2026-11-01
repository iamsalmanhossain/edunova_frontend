import React from "react";
import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your EduNova digital campus account password at Kishoreganj Polytechnic Institute.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      mode="forgot-password"
      title="Reset Account Password"
      subtitle="Enter your verified institutional email address and we'll dispatch instant password recovery instructions."
      visualHeadline="Protecting Your Digital Identity & Academic Records"
      visualSubheadline="EduNova enforces institutional-grade cryptographic security to keep student examination records and teacher portals safe."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

