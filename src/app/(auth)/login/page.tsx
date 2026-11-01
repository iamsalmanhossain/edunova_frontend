import React from "react";
import type { Metadata } from "next";
import AuthCrossSlideContainer from "@/components/auth/AuthCrossSlideContainer";

export const metadata: Metadata = {
  title: "Portal Sign In",
  description:
    "Secure authentication portal for EduNova digital campus at Kishoreganj Polytechnic Institute.",
};

export default function LoginPage() {
  return <AuthCrossSlideContainer initialMode="login" />;
}
