import React from "react";
import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Register for an EduNova institutional account for students and faculty.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Institutional Account"
      subtitle="Select whether you are enrolling as a student or registering as a faculty member at Kishoreganj Polytechnic Institute."
      visualHeadline="Join the Digital Technical Education Revolution at EduNova"
      visualSubheadline="Streamline your polytechnic journey with digital curriculum access, automated attendance, teacher remarks, and semester assessment management."
    >
      <RegisterForm />
    </AuthLayout>
  );
}

