import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { FOOTER_CONFIG, TOP_BAR_CONFIG } from "@/config/navigation";
import Container from "@/components/shared/Container";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#052317] text-white/90 border-t border-[#0a4b32]/50">
      <div className="py-12 sm:py-16">
        <Container size="wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
            {/* Column 1: Brand & Overview (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-4">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0a4b32] border border-[#c48b28]/40 flex items-center justify-center text-white shadow-sm">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold tracking-tight text-white">
                    EduNova
                  </span>
                  <span className="block text-[10px] tracking-wider uppercase text-[#c48b28] font-semibold -mt-1">
                    Digital Campus Platform
                  </span>
                </div>
              </Link>

              <p className="text-sm text-white/75 leading-relaxed pr-0 lg:pr-6">
                {FOOTER_CONFIG.about}
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs text-white/60">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#073825] border border-[#0a4b32]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  System Status: Operational
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#c48b28]">
                Institution
              </h3>
              <ul className="space-y-2 text-sm">
                {FOOTER_CONFIG.quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/75 hover:text-white hover:underline transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Academics & Facilities (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#c48b28]">
                Academics
              </h3>
              <ul className="space-y-2 text-sm">
                {FOOTER_CONFIG.academicLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/75 hover:text-white hover:underline transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#c48b28]">
                Contact
              </h3>
              <ul className="space-y-2.5 text-xs text-white/75">
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#c48b28] shrink-0 mt-0.5" />
                  <span>{TOP_BAR_CONFIG.location}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
                  <a
                    href={`tel:${TOP_BAR_CONFIG.phone}`}
                    className="hover:text-white hover:underline"
                  >
                    {TOP_BAR_CONFIG.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
                  <a
                    href={`mailto:${TOP_BAR_CONFIG.email}`}
                    className="hover:text-white hover:underline truncate"
                  >
                    {TOP_BAR_CONFIG.email}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
                  <span>{TOP_BAR_CONFIG.officeHours}</span>
                </li>
              </ul>
            </div>

            {/* Column 5: Meet the Developer (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#c48b28]">
                Developer
              </h3>
              <div className="bg-[#073825]/90 rounded-lg p-3.5 border border-[#0a4b32]">
                <p className="text-sm font-semibold text-white">
                  {FOOTER_CONFIG.developer.name}
                </p>
                <p className="text-xs text-[#c48b28] font-medium">
                  {FOOTER_CONFIG.developer.title}
                </p>
                <p className="text-[11px] text-white/65 mt-1 leading-snug">
                  Built to modernize institutional academic management.
                </p>
                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#0a4b32]/70 text-xs">
                  <Link
                    href={FOOTER_CONFIG.developer.meetLink}
                    className="text-[#c48b28] hover:text-white inline-flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>View Bio</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar: Copyright & Policies */}
      <div className="border-t border-[#0a4b32]/40 py-5 bg-[#031910]">
        <Container
          size="wide"
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60"
        >
          <p>
            &copy; {currentYear} EduNova Digital Campus Platform. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
            <Link
              href="/about"
              className="hover:text-white transition-colors"
            >
              Institutional Policy
            </Link>
            <Link
              href="/contact"
              className="hover:text-white transition-colors"
            >
              Support & Inquiries
            </Link>
            <Link
              href="/developer"
              className="hover:text-white transition-colors"
            >
              Meet Developer
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
