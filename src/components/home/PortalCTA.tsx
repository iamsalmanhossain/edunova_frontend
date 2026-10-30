"use client";

import React from "react";
import Link from "next/link";
import { LogIn, ArrowRight, ShieldCheck, UserCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

export default function PortalCTA() {
  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-[#063322] via-[#0a4b32] to-[#073825] text-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#c48b28] blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-emerald-400 blur-3xl" />
      </div>

      <Container size="wide" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 min-w-0"
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#ecdcb9]">
            <Sparkles className="w-3.5 h-3.5 text-[#ecdcb9] shrink-0" />
            <span className="truncate">EduNova Digital Portal</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight break-words">
            Your Campus, Connected Digitally.
          </h2>

          <p className="text-xs sm:text-base lg:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed break-words">
            Manage academic activities, access important information, submit student assessments, and stay connected through the official EduNova institute platform.
          </p>

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#c48b28] hover:bg-[#b07b22] text-white font-bold px-6 sm:px-8 h-10 sm:h-12 shadow-xl shadow-black/25 text-xs sm:text-base"
            >
              <Link href="/login" className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>Access Digital Campus</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 sm:px-6 h-10 sm:h-12 text-xs sm:text-sm backdrop-blur-xs"
            >
              <Link href="/register" className="flex items-center justify-center gap-2">
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#ecdcb9] shrink-0" />
                <span className="truncate">Create Account</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 shrink-0" />
              </Link>
            </Button>
          </div>

          <div className="pt-4 sm:pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ecdcb9] shrink-0" />
              <span>Role-based Secure Access</span>
            </span>
            <span className="hidden xs:inline text-white/30">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ecdcb9] shrink-0" />
              <span>Institutional Single Sign-On</span>
            </span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
