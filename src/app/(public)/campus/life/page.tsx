import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Campus Life & Student Activities",
  description:
    "Student clubs, robotics society, technical seminars, and athletic events at Kishoreganj Polytechnic Institute.",
};

const CLUBS = [
  {
    title: "Polytechnic Robotics & AI Club",
    description: "Hands-on microcontrollers, IoT development, line-follower robots, and competitive exhibitions.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Computer Programming Society",
    description: "Algorithmic contests, web application hackathons, and open source development meetups.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Annual Sports & Cultural Festival",
    description: "Intra-department cricket, football, debate competitions, and national day observances.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
  },
];

export default function CampusLifePage() {
  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <SectionHeading
          badge="Co-curricular & Community"
          title="Student Life &amp; Co-curricular Clubs"
          subtitle="Beyond the classroom: technical clubs, sports tournaments, hackathons, and leadership development."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {CLUBS.map((club, idx) => (
            <Card key={idx} className="overflow-hidden border border-[#e2e8e4]">
              <div className="relative h-48 w-full">
                <Image
                  src={club.image}
                  alt={club.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-lg font-bold text-[#0f1f17]">{club.title}</h3>
                <p className="text-xs sm:text-sm text-[#5a6b62] leading-relaxed">
                  {club.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
