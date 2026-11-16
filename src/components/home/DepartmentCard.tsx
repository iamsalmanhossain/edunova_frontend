"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Users,
  Code2,
  Utensils,
  Cpu,
  Snowflake,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Department } from "@/types/department";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DepartmentCardProps {
  dept: Department;
  index?: number;
}

export default function DepartmentCard({ dept, index = 0 }: DepartmentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 150, y: 150 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const slug = (dept.slug || dept.code).toLowerCase();

  // Dynamic 3D perspective tilt & interactive spotlight
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Subtle 3D tilt (-5deg to +5deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setRotate({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  // Distinct department icon and theme colors
  const getDeptIcon = (code: string) => {
    switch (code.toUpperCase()) {
      case "CST":
        return <Code2 className="w-4 h-4 text-emerald-400" />;
      case "FOOD":
        return <Utensils className="w-4 h-4 text-amber-300" />;
      case "ENT":
        return <Cpu className="w-4 h-4 text-cyan-300" />;
      case "RAC":
        return <Snowflake className="w-4 h-4 text-sky-300" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
      className="h-full"
    >
      <Card
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-8px) scale3d(1.015, 1.015, 1.015)`
            : "rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)",
          transition: isHovered
            ? "transform 0.15s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.3s ease"
            : "transform 0.5s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.5s ease",
        }}
        className={`group relative overflow-hidden border border-[#e2e8e4] bg-white rounded-2xl flex flex-col justify-between h-full transition-all duration-300 ${
          isHovered
            ? "shadow-2xl shadow-[#0a4b32]/15 border-[#0a4b32]/40"
            : "shadow-sm hover:shadow-md"
        }`}
      >
        {/* Top Glowing Gradient Accent Line */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 z-20 transition-all duration-500 ${
            isHovered
              ? "bg-gradient-to-r from-[#0a4b32] via-[#c48b28] to-[#0a4b32] opacity-100 scale-x-100"
              : "bg-transparent opacity-0 scale-x-0"
          }`}
        />

        {/* Dynamic Cursor Spotlight Effect */}
        {isHovered && (
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl z-10 transition-opacity duration-300 opacity-100"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(10, 75, 50, 0.08), transparent 70%)`,
            }}
          />
        )}

        <div>
          {/* Department Image & Gradient Overlay */}
          <div className="relative h-52 w-full overflow-hidden bg-[#e6ede8]">
            {dept.imageUrl && (
              <Image
                src={dept.imageUrl}
                alt={`Department of ${dept.name}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
            )}
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a2318] via-black/35 to-black/10 group-hover:via-black/25 transition-colors duration-500" />

            {/* Dept Code Badge with Pulse Glow */}
            <div className="absolute top-3.5 right-3.5 z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black shadow-md bg-white/95 backdrop-blur-xs text-[#0a4b32] border border-white/60 tracking-wider">
                {getDeptIcon(dept.code)}
                <span>{dept.code}</span>
              </span>
            </div>

            {/* Shift Availability Pill */}
            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold shadow-xs bg-black/60 backdrop-blur-xs text-white/95 border border-white/20">
                <span>1st &amp; 2nd Shift</span>
              </span>
            </div>

            {/* Title on Image */}
            <div className="absolute bottom-3 left-4 right-4 text-white z-10">
              <h3 className="text-lg font-bold leading-snug drop-shadow-md group-hover:text-amber-200 transition-colors duration-300">
                {dept.name}
              </h3>
            </div>
          </div>

          {/* Department Body Content */}
          <CardContent className="p-5 space-y-4">
            <p className="text-xs sm:text-sm text-[#5a6b62] leading-relaxed line-clamp-3">
              {dept.description}
            </p>

            {/* Stats Pill */}
            <div className="flex items-center gap-3 pt-1 text-xs text-[#5a6b62] border-t border-[#edf2ee]">
              <span className="flex items-center gap-1.5 font-semibold text-[#0a4b32]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{dept._count?.subjects || "10+"} Subjects</span>
              </span>
              <span className="text-[#d8e2dc]">•</span>
              <span className="flex items-center gap-1.5 font-medium text-gray-600">
                <Users className="w-3.5 h-3.5 text-[#c48b28]" />
                <span>Dual Shifts</span>
              </span>
            </div>

            {/* Key Focus Highlights */}
            {dept.highlights && dept.highlights.length > 0 && (
              <div className="pt-2 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0a4b32] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#c48b28]" />
                  <span>Key Highlights</span>
                </p>
                <div className="space-y-1">
                  {dept.highlights.slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-[#47554f]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </div>

        {/* Footer Link with Animated Arrow */}
        <div className="p-5 pt-0 border-t border-[#f0f4f1] mt-auto">
          <Link
            href={`/departments/${slug}`}
            className="inline-flex items-center justify-between w-full pt-3 text-xs sm:text-sm font-bold text-[#0a4b32] group-hover:text-[#073825] transition-colors"
          >
            <span className="group-hover:underline">Explore Department</span>
            <div className="w-7 h-7 rounded-full bg-[#f0f7f3] group-hover:bg-[#0a4b32] text-[#0a4b32] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-1">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}
