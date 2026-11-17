import { apiClient } from "./api-client";
import { DeveloperProfile, UpdateDeveloperPayload } from "@/types/developer";

export const VERIFIED_DEVELOPER_PROFILE: DeveloperProfile = {
  id: "dev-primary",
  name: "Md Salman Hossain",
  title: "Full Stack Developer & Systems Architect",
  tagline: "Next.js 16 Architect • NestJS Specialist • Enterprise Full Stack Engineer",
  bio: `EduNova was conceptualized, designed, and architected by Md Salman Hossain to modernize the Bangladesh polytechnic academic ecosystem.

Recognizing that polytechnic institutes navigate complex operations—including dual-shift scheduling (1st & 2nd Shifts), 8 progressive semesters, multi-department practical marks, and strict BTEB/DTE accreditation—Salman built EduNova from scratch as an enterprise-grade digital campus platform.

By uniting students, faculty members, heads of departments, and institutional leadership under a resilient, high-speed architecture, EduNova eliminates administrative friction and empowers 2,800+ students with automated grade calculation, attendance analytics, and dynamic campus exploration.`,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  skills: [
    "Next.js 16 (App Router)",
    "TypeScript",
    "NestJS",
    "PostgreSQL",
    "Prisma ORM",
    "Tailwind CSS",
    "Zustand State Engine",
    "Docker & Cloud Systems",
    "Enterprise RBAC & Security",
    "REST & Microservices",
  ],
  githubUrl: "https://github.com/salman-hossain",
  linkedinUrl: "https://linkedin.com/in/salman-hossain",
  portfolioUrl: "https://salmanhossain.dev",
  email: "contact@salmanhossain.dev",
  phone: "+880 1711-100001",
  location: "Dhaka / Kishoreganj, Bangladesh",
  isAvailableForHire: true,
  isPublished: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-03-01T00:00:00.000Z",
};

export const developerService = {
  /**
   * Public retrieval of developer profile
   */
  async getDeveloper(): Promise<DeveloperProfile> {
    try {
      const res = await apiClient.get<any>("/developer", { skipAuth: true });
      const raw = res?.data ?? res;
      if (raw && raw.name) return raw;
      return VERIFIED_DEVELOPER_PROFILE;
    } catch {
      return VERIFIED_DEVELOPER_PROFILE;
    }
  },

  /**
   * Admin retrieval of developer profile
   */
  async getAdminDeveloper(): Promise<DeveloperProfile> {
    try {
      const res = await apiClient.get<any>("/developer/admin");
      const raw = res?.data ?? res;
      if (raw && raw.name) return raw;
      return VERIFIED_DEVELOPER_PROFILE;
    } catch {
      return VERIFIED_DEVELOPER_PROFILE;
    }
  },

  /**
   * Admin upsert developer profile
   */
  async saveDeveloper(
    payload: UpdateDeveloperPayload,
    avatarFile?: File | null
  ): Promise<DeveloperProfile> {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("title", payload.title);
    if (payload.tagline) formData.append("tagline", payload.tagline);
    formData.append("bio", payload.bio);
    if (payload.avatarUrl) formData.append("avatarUrl", payload.avatarUrl);
    if (payload.skills && payload.skills.length > 0) {
      formData.append("skills", JSON.stringify(payload.skills));
    }
    if (payload.githubUrl) formData.append("githubUrl", payload.githubUrl);
    if (payload.linkedinUrl) formData.append("linkedinUrl", payload.linkedinUrl);
    if (payload.portfolioUrl) formData.append("portfolioUrl", payload.portfolioUrl);
    if (payload.email) formData.append("email", payload.email);
    if (payload.phone) formData.append("phone", payload.phone);
    if (payload.location) formData.append("location", payload.location);
    if (payload.isAvailableForHire !== undefined) {
      formData.append("isAvailableForHire", String(payload.isAvailableForHire));
    }
    if (payload.isPublished !== undefined) {
      formData.append("isPublished", String(payload.isPublished));
    }
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const res = await apiClient.post<any>("/developer", formData);
    return res?.data ?? res;
  },

  /**
   * Admin update developer profile by ID
   */
  async updateDeveloper(
    id: string,
    payload: Partial<UpdateDeveloperPayload>,
    avatarFile?: File | null
  ): Promise<DeveloperProfile> {
    const formData = new FormData();
    if (payload.name) formData.append("name", payload.name);
    if (payload.title) formData.append("title", payload.title);
    if (payload.tagline) formData.append("tagline", payload.tagline);
    if (payload.bio) formData.append("bio", payload.bio);
    if (payload.avatarUrl) formData.append("avatarUrl", payload.avatarUrl);
    if (payload.skills) formData.append("skills", JSON.stringify(payload.skills));
    if (payload.githubUrl !== undefined) formData.append("githubUrl", payload.githubUrl);
    if (payload.linkedinUrl !== undefined) formData.append("linkedinUrl", payload.linkedinUrl);
    if (payload.portfolioUrl !== undefined) formData.append("portfolioUrl", payload.portfolioUrl);
    if (payload.email !== undefined) formData.append("email", payload.email);
    if (payload.phone !== undefined) formData.append("phone", payload.phone);
    if (payload.location !== undefined) formData.append("location", payload.location);
    if (payload.isAvailableForHire !== undefined) {
      formData.append("isAvailableForHire", String(payload.isAvailableForHire));
    }
    if (payload.isPublished !== undefined) {
      formData.append("isPublished", String(payload.isPublished));
    }
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const res = await apiClient.patch<any>(`/developer/${id}`, formData);
    return res?.data ?? res;
  },
};
