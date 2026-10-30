"use client";

import React from "react";
import Link from "next/link";
import { Globe, ArrowRight, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { GithubIcon } from "@/components/shared/Icons";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DeveloperSection() {
  return (
    <section className="py-12 sm:py-18 bg-[#f6faf7] border-b border-[#e2e8e4]/70 overflow-hidden">
      <Container size="wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto min-w-0"
        >
          <Card className="border border-[#0a4b32]/20 shadow-md bg-white overflow-hidden rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 p-4 sm:p-8 items-center">
              {/* Developer Avatar / Icon */}
              <div className="md:col-span-4 flex flex-col items-center text-center min-w-0">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-[#0a4b32]/10 bg-gradient-to-br from-[#0a4b32] to-[#073825] flex items-center justify-center text-white shadow-md">
                  <div className="text-center p-3 sm:p-4">
                    <Code2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-[#ecdcb9] mb-1" />
                    <span className="text-xs sm:text-sm font-bold tracking-tight text-white block">
                      Architect &amp; Lead
                    </span>
                  </div>
                </div>
                <div className="mt-2.5 sm:mt-3">
                  <Badge variant="gold" className="text-[10px] sm:text-[11px] font-semibold">
                    Full Stack Developer
                  </Badge>
                </div>
              </div>

              {/* Developer Info */}
              <div className="md:col-span-8 space-y-2.5 sm:space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-[#0a4b32]">
                    About the Platform Architect
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#0f1f17] break-words">
                  Md Salman Hossain
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-[#0a4b32]">
                  Full Stack Developer &amp; Systems Architect
                </p>

                <p className="text-xs sm:text-sm text-[#5a6b62] leading-relaxed break-words">
                  EduNova was designed and developed by Md Salman Hossain to modernize the polytechnic educational ecosystem. By consolidating shift routines, multi-semester results, student profiles, and administrative governance into a single cohesive platform, EduNova bridges the gap between traditional polytechnic management and modern digital efficiency.
                </p>

                {/* Verified Links & CTA */}
                <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-[#dce3df] text-[#0f1f17] hover:bg-[#f0f7f3] text-xs h-8.5 sm:h-9"
                  >
                    <a
                      href="https://github.com/salman-hossain"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-[#dce3df] text-[#0f1f17] hover:bg-[#f0f7f3] text-xs h-8.5 sm:h-9"
                  >
                    <a
                      href="https://salmanhossain.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#0a4b32]" />
                      <span>Portfolio</span>
                    </a>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="bg-[#0a4b32] hover:bg-[#073825] text-white text-xs h-8.5 sm:h-9 w-full sm:w-auto sm:ml-auto"
                  >
                    <Link href="/developer" className="inline-flex items-center justify-center gap-1.5">
                      <span>Meet the Developer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}
