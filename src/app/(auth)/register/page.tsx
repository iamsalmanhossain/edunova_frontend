import React from "react";
import type { Metadata } from "next";
import AuthCrossSlideContainer from "@/components/auth/AuthCrossSlideContainer";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Register for a bdEduNova institutional account for students and faculty at Kishoreganj Government Polytechnic Institute (KIGPI).",
};

export default function RegisterPage() {
  return <AuthCrossSlideContainer initialMode="register" />;
}
