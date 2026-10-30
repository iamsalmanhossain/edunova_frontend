import React from "react";
import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Portal Sign In",
  description:
    "Secure authentication portal for EduNova digital campus at Kishoreganj Polytechnic Institute.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to access student records, shift routines, marks, and administrative portals."
      visualHeadline="Connecting Students, Teachers & Administration in One Unified Digital Ecosystem"
      visualSubheadline="Access official academic routines, real-time attendance logs, examination records, and institutional communications with high security."
    >
      <LoginForm />
    </AuthLayout>
  );
}

