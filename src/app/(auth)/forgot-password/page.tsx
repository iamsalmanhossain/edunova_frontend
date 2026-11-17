import React from "react";
import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your bdEduNova digital campus account password at Kishoreganj Government Polytechnic Institute (KIGPI).",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      mode="forgot-password"
      title="Reset Account Password"
      subtitle="Enter your verified institutional email address and we'll dispatch instant password recovery instructions."
      visualHeadline="Protecting Your Digital Identity & Academic Records"
      visualSubheadline="bdEduNova enforces institutional-grade cryptographic security to keep student examination records and teacher portals safe."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

