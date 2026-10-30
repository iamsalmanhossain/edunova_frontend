import React from "react";
import type { Metadata } from "next";
import {
  Code2,
  Globe,
  Layers,
  Server,
  Database,
} from "lucide-react";
import { GithubIcon } from "@/components/shared/Icons";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Meet the Developer — Md Salman Hossain",
  description:
    "Learn about Md Salman Hossain, the Full Stack Developer and Systems Architect behind EduNova Digital Campus Platform.",
};

export default function DeveloperPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <SectionHeading
          badge="Platform Architect"
          title="Meet the Developer: Md Salman Hossain"
          subtitle="Full Stack Developer passionate about crafting resilient, production-ready educational systems and scalable software."
        />

        <div className="max-w-4xl mx-auto space-y-10">
          {/* Profile Card */}
          <Card className="border border-[#0a4b32]/25 shadow-lg overflow-hidden bg-white">
            <div className="p-6 sm:p-10 space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#0a4b32] to-[#073825] text-white flex items-center justify-center shrink-0 shadow-md ring-4 ring-[#0a4b32]/10">
                  <Code2 className="w-14 h-14 text-[#ecdcb9]" />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <Badge variant="gold" className="text-xs uppercase font-bold">
                      Full Stack Developer
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Creator of EduNova
                    </Badge>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1f17]">
                    Md Salman Hossain
                  </h2>
                  <p className="text-sm font-semibold text-[#0a4b32]">
                    Next.js Architect • NestJS Specialist • Enterprise Full Stack Engineer
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-3">
                    <Button asChild size="sm" variant="outline" className="text-xs h-9">
                      <a
                        href="https://github.com/salman-hossain"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>GitHub Profile</span>
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="text-xs h-9">
                      <a
                        href="https://salmanhossain.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5 text-[#0a4b32]" />
                        <span>Personal Portfolio</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div className="pt-6 border-t border-[#e2e8e4] space-y-4 text-sm sm:text-base text-[#5a6b62] leading-relaxed">
                <h3 className="text-lg font-bold text-[#0f1f17]">
                  Why EduNova Was Built
                </h3>
                <p>
                  Polytechnic institutes in Bangladesh manage intricate academic operations: dual-shift scheduling (First and Second shifts), eight progressive semesters, multi-departmental faculty structures, continuous practical marks, and strict board standards.
                </p>
                <p>
                  Traditionally, much of this administration relied on manual ledgers and fragmented records. EduNova was built from the ground up to solve these systemic friction points by delivering an enterprise-grade digital campus platform that brings students, teachers, department heads, and institute principals into one unified, secure digital environment.
                </p>
              </div>

              {/* Architectural Highlights */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#f0f7f3] border border-[#0a4b32]/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0a4b32] font-bold text-sm">
                    <Layers className="w-4 h-4" />
                    <span>Modern Frontend</span>
                  </div>
                  <p className="text-xs text-[#5a6b62]">
                    Next.js App Router, Tailwind CSS v4, shadcn/ui primitives, mobile-first responsive design.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#f0f7f3] border border-[#0a4b32]/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0a4b32] font-bold text-sm">
                    <Server className="w-4 h-4" />
                    <span>Resilient Backend</span>
                  </div>
                  <p className="text-xs text-[#5a6b62]">
                    NestJS micro-architecture, Argon2 security, Redis OTP verification, strict DTOs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#f0f7f3] border border-[#0a4b32]/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0a4b32] font-bold text-sm">
                    <Database className="w-4 h-4" />
                    <span>PostgreSQL &amp; Prisma</span>
                  </div>
                  <p className="text-xs text-[#5a6b62]">
                    Normalized relational schema with rigorous cascade constraints and institute-level scoping.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
