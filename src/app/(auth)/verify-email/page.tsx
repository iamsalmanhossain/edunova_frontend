import React from "react";
import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Verify your institutional email address to activate your EduNova account at Kishoreganj Polytechnic Institute.",
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      mode="verify-email"
      title="Verify Institutional Email"
      subtitle="Please enter the 6-digit confirmation security PIN sent to your email to activate portal access."
      visualHeadline="Two-Factor Security Verification for Digital Campus"
      visualSubheadline="Protecting Polytechnic student records, semester grades, and academic data with email verification safeguards."
    >
      <VerifyEmailForm />
    </AuthLayout>
  );
}

