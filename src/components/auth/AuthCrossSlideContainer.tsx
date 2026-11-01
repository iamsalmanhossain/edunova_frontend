"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowLeft } from "lucide-react";
import AuthVisualPanel from "./AuthVisualPanel";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthCrossSlideContainerProps {
  initialMode?: "login" | "register";
}

export default function AuthCrossSlideContainer({
  initialMode = "login",
}: AuthCrossSlideContainerProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Handle browser back/forward history navigation
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        if (window.location.pathname.includes("/register")) {
          setMode("register");
        } else if (window.location.pathname.includes("/login")) {
          setMode("login");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const switchToRegister = () => {
    setMode("register");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/register");
    }
  };

  const switchToLogin = () => {
    setMode("login");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/login");
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="h-screen max-h-screen w-full flex flex-col lg:flex-row bg-[#fcfdfc] overflow-hidden no-scrollbar select-none sm:select-auto">
      {/* Visual Panel:
          - Desktop: Takes 5/12 or 1/2 width.
          - In 'login' mode: Left side (order-1)
          - In 'register' mode: Right side (order-2)
          - Cross-slide spring animation via Framer Motion layout prop
      */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 28,
          mass: 0.8,
        }}
        className={`hidden lg:flex w-5/12 xl:w-1/2 h-full z-10 ${
          isLogin ? "order-1" : "order-2"
        }`}
      >
        <AuthVisualPanel
          mode={mode}
          headline={
            isLogin
              ? "Connecting Students, Teachers & Administration in One Unified Digital Ecosystem"
              : "Empowering Next-Generation Engineers with Official Digital Identity & Records"
          }
          subheadline={
            isLogin
              ? "Access official academic routines, real-time attendance logs, examination records, and institutional communications with high security."
              : "Register as an enrolled Polytechnic student or accredited teacher to view semester syllabi, mark submissions, and shift notifications."
          }
        />
      </motion.div>

      {/* Form Container:
          - Desktop: Takes 7/12 or 1/2 width.
          - In 'login' mode: Right side (order-2)
          - In 'register' mode: Left side (order-1)
          - Cross-slide spring animation via Framer Motion layout prop
      */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 28,
          mass: 0.8,
        }}
        className={`w-full lg:w-7/12 xl:w-1/2 h-full flex flex-col justify-between p-4 sm:p-6 lg:p-7 xl:p-8 overflow-y-auto no-scrollbar z-20 ${
          isLogin ? "order-2" : "order-1"
        }`}
      >
        {/* Top Header / Back Nav */}
        <div className="flex items-center justify-between shrink-0 pb-2 sm:pb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5a6b62] hover:text-[#0a4b32] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>

          {/* Quick toggle pill on desktop to preview layout swap */}
          <div className="hidden sm:flex items-center gap-1 bg-[#f0f4f1] p-1 rounded-full border border-[#dce3df]/70 text-xs font-medium">
            <button
              type="button"
              onClick={switchToLogin}
              className={`px-3 py-1 rounded-full transition-all text-xs font-semibold cursor-pointer ${
                isLogin
                  ? "bg-[#0a4b32] text-white shadow-xs"
                  : "text-[#5a6b62] hover:text-[#0f1f17]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={switchToRegister}
              className={`px-3 py-1 rounded-full transition-all text-xs font-semibold cursor-pointer ${
                !isLogin
                  ? "bg-[#0a4b32] text-white shadow-xs"
                  : "text-[#5a6b62] hover:text-[#0f1f17]"
              }`}
            >
              Register
            </button>
          </div>

          {/* Compact EduNova Logo for Mobile */}
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0a4b32] text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#0a4b32]">
              EduNova
            </span>
          </Link>
        </div>

        {/* Center Content with Animated Presence */}
        <div className="w-full max-w-md mx-auto my-auto py-1 sm:py-2">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div className="mb-3 sm:mb-4 text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f1f17] tracking-tight">
                    Welcome Back
                  </h1>
                  <p className="mt-1 text-xs text-[#5a6b62] leading-snug">
                    Sign in to your account to access student records, shift routines, marks, and administrative portals.
                  </p>
                </div>

                <LoginForm onSwitchToRegister={switchToRegister} />
              </motion.div>
            ) : (
              <motion.div
                key="register-content"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div className="mb-2 sm:mb-3 text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f1f17] tracking-tight">
                    Create Digital Campus Account
                  </h1>
                  <p className="mt-1 text-xs text-[#5a6b62] leading-snug">
                    Choose your role as Student or Teacher and enter verified academic credentials.
                  </p>
                </div>

                <RegisterForm onSwitchToLogin={switchToLogin} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Disclaimer */}
        <div className="shrink-0 pt-2 sm:pt-3 text-center text-[11px] text-[#5a6b62]/80 border-t border-[#e2e8e4]/70">
          <p>
            Authorized access only for verified students, faculty &amp; administrators of Kishoreganj Polytechnic Institute.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
