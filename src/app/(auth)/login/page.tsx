import React from "react";
import type { Metadata } from "next";
import AuthCrossSlideContainer from "@/components/auth/AuthCrossSlideContainer";

export const metadata: Metadata = {
  title: "Portal Sign In",
  description:
    "Secure authentication portal for bdEduNova digital campus at Kishoreganj Government Polytechnic Institute (KIGPI).",
};

export default function LoginPage() {
  return <AuthCrossSlideContainer initialMode="login" />;
}
