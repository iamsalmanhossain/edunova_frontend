import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { TOP_BAR_CONFIG } from "@/config/navigation";
import Container from "@/components/shared/Container";

export default function TopBar() {
  return (
    <div className="hidden lg:block bg-[#073825] text-white/90 text-xs py-2 border-b border-[#0a4b32]/40">
      <Container size="wide" className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a
            href={`tel:${TOP_BAR_CONFIG.phone}`}
            className="flex items-center gap-2 hover:text-[#c48b28] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#c48b28]" />
            <span>{TOP_BAR_CONFIG.phone}</span>
          </a>
          <a
            href={`mailto:${TOP_BAR_CONFIG.email}`}
            className="flex items-center gap-2 hover:text-[#c48b28] transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#c48b28]" />
            <span>{TOP_BAR_CONFIG.email}</span>
          </a>
          <span className="flex items-center gap-2 text-white/70">
            <MapPin className="w-3.5 h-3.5 text-[#c48b28]" />
            <span>{TOP_BAR_CONFIG.location}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-white/75">
          <Clock className="w-3.5 h-3.5 text-[#c48b28]" />
          <span>{TOP_BAR_CONFIG.officeHours}</span>
        </div>
      </Container>
    </div>
  );
}

