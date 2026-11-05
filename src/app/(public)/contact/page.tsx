import React from "react";
import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { TOP_BAR_CONFIG } from "@/config/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Contact & Institutional Office",
  description:
    "Get in touch with Kishoreganj Polytechnic Institute administrative office and academic inquiries.",
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <SectionHeading
          badge="Direct Inquiries"
          title="Contact &amp; Administrative Office"
          subtitle="Reach out to our registrar, admissions desk, or department offices for official assistance."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-[#e2e8e4] p-6 space-y-6">
              <h3 className="text-xl font-bold text-[#0f1f17]">
                Kishoreganj Polytechnic Institute
              </h3>

              <div className="space-y-4 text-sm text-[#5a6b62]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#0a4b32] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0f1f17]">Location</p>
                    <p>{TOP_BAR_CONFIG.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#0a4b32] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0f1f17]">Phone Number</p>
                    <a href={`tel:${TOP_BAR_CONFIG.phone}`} className="hover:underline text-[#0a4b32]">
                      {TOP_BAR_CONFIG.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#0a4b32] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0f1f17]">Email Address</p>
                    <a href={`mailto:${TOP_BAR_CONFIG.email}`} className="hover:underline text-[#0a4b32]">
                      {TOP_BAR_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#0a4b32] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0f1f17]">Office Hours</p>
                    <p>{TOP_BAR_CONFIG.officeHours}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <Card className="border border-[#e2e8e4] p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[#0f1f17] mb-2">
                Send an Administrative Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-[#5a6b62] mb-6">
                Fill out the form below and our institutional registrar will respond to your query.
              </p>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name">Your Full Name</Label>
                    <Input id="contact-name" placeholder="Salman Hossain" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">Email Address</Label>
                    <Input id="contact-email" type="email" placeholder="salman@gmail.com" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-subject">Subject</Label>
                  <Input id="contact-subject" placeholder="e.g. Admission Inquiry / Transcript" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-msg">Message</Label>
                  <Textarea
                    id="contact-msg"
                    rows={4}
                    placeholder="Provide details about your query..."
                    className="w-full rounded-md border border-[#dce3df] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a4b32]"
                  />
                </div>

                <Button className="w-full sm:w-auto bg-[#0a4b32] hover:bg-[#073825] text-white">
                  <Send className="w-4 h-4 mr-2" />
                  <span>Send Message</span>
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
