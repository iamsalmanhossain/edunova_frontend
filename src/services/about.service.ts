import { apiClient } from "./api-client";
import { InstituteAbout, CreateAboutPayload, QueryAboutParams } from "@/types/about";

export const DEFAULT_ABOUT_DATA: InstituteAbout = {
  id: "default-kipi-about",
  instituteId: "kipi-default-id",
  slug: "main",
  title: "Kishoreganj Polytechnic Institute (KIPI)",
  tagline: "Empowering Next-Generation Engineers with Technical Pedagogical Excellence",
  content: `# Welcome to Kishoreganj Polytechnic Institute (KIPI)

Kishoreganj Polytechnic Institute stands as a premier government technical education institution affiliated with the **Bangladesh Technical Education Board (BTEB)** and managed under the **Directorate of Technical Education (DTE)**.

## Core Engineering Disciplines
Our institute offers state-of-the-art 4-year Diploma in Engineering qualifications across 4 specialized departments:
- **Computer Science & Technology (CST)**: Software engineering, networking, cyber systems, and applied artificial intelligence.
- **Food Technology (FOOD)**: Food microbiology, industrial preservation, processing, and quality control.
- **Electronics Technology (ENT)**: Telecommunications, microprocessors, embedded robotics, and automation.
- **Refrigeration & Air Conditioning Technology (RAC)**: Thermal systems, industrial HVAC plants, and cryogenic design.

## Academic Infrastructure
- **Dual Shifts**: 1st Shift (Morning) & 2nd Shift (Day) catering to thousands of diploma engineers.
- **Hands-On Laboratories**: Fully equipped computer networks, circuit testing facilities, food analysis labs, and thermodynamic workshops.
- **Industry Attachment**: 8th-semester mandatory industrial training in leading technology and manufacturing firms across Bangladesh.`,
  bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
  images: [
    "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop",
  ],
  mission: "To deliver accessible, high-quality polytechnic and vocational education that equips students with real-world engineering skills, scientific inquiry, and ethical leadership required for industrial growth.",
  vision: "To be recognized as a leading technical institute in Bangladesh producing globally competent diploma engineers driving digital and industrial transformation.",
  history: "Established to meet the growing need for mid-level technical professionals in Bangladesh, Kishoreganj Polytechnic Institute has consistently produced skilled engineers serving in public infrastructure, industrial plants, and global tech organizations.",
  markdownFile: null,
  isPublished: true,
  deletedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  institute: {
    id: "kipi-default-id",
    name: "Kishoreganj Polytechnic Institute",
    code: "KIPI-54049",
    division: "Dhaka",
    district: "Kishoreganj",
    address: "Karimganj, Kishoreganj, Dhaka, Bangladesh",
    website: "https://kipi.gov.bd",
  },
};

export const aboutService = {
  /**
   * Public: প্রতিষ্ঠানের মূল About তথ্য সংগ্রহ করা
   */
  async getPublicAbout(params?: QueryAboutParams): Promise<InstituteAbout> {
    const searchParams = new URLSearchParams();
    if (params?.instituteId) searchParams.append("instituteId", params.instituteId);
    if (params?.slug) searchParams.append("slug", params.slug);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

    try {
      const res = await apiClient.get<any>(`/about${query}`, { skipAuth: true });
      const raw = res?.data ?? res;
      if (raw && typeof raw === "object" && "title" in raw) {
        return raw as InstituteAbout;
      }
      return DEFAULT_ABOUT_DATA;
    } catch {
      // Return verified fallback if backend has no about entry seeded yet
      return DEFAULT_ABOUT_DATA;
    }
  },

  /**
   * Admin: ড্রাফটসহ সকল About এন্ট্রি লিস্ট দেখা
   */
  async getAdminAll(params?: QueryAboutParams): Promise<{ data: InstituteAbout[]; meta: any }> {
    const searchParams = new URLSearchParams();
    if (params?.instituteId) searchParams.append("instituteId", params.instituteId);
    if (params?.slug) searchParams.append("slug", params.slug);
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));

    try {
      const res = await apiClient.get<any>(
        `/about/admin/all?${searchParams.toString()}`
      );
      const raw = res?.data ?? res;
      let items: InstituteAbout[] = [];
      if (Array.isArray(raw)) {
        items = raw;
      } else if (raw && typeof raw === "object" && Array.isArray((raw as any).data)) {
        items = (raw as any).data;
      }

      const meta = (res as any)?.meta ?? (raw as any)?.meta ?? {
        total: items.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.max(1, Math.ceil(items.length / (params?.limit || 10))),
      };

      return { data: items, meta };
    } catch {
      return {
        data: [DEFAULT_ABOUT_DATA],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };
    }
  },

  /**
   * Admin: নতুন About তৈরি বা আপডেট করা (Multipart Form-Data সাপোর্ট)
   */
  async saveAbout(
    payload: CreateAboutPayload,
    files?: {
      readmeFile?: File | null;
      bannerFile?: File | null;
      galleryFiles?: File[];
    },
    existingId?: string
  ): Promise<InstituteAbout> {
    const formData = new FormData();

    // টেক্সট ডাটা অ্যাপেন্ড করা
    if (payload.title) formData.append("title", payload.title);
    if (payload.tagline) formData.append("tagline", payload.tagline);
    if (payload.content) formData.append("content", payload.content);
    if (payload.mission) formData.append("mission", payload.mission);
    if (payload.vision) formData.append("vision", payload.vision);
    if (payload.history) formData.append("history", payload.history);
    if (payload.slug) formData.append("slug", payload.slug);
    if (payload.instituteId) formData.append("instituteId", payload.instituteId);
    if (payload.isPublished !== undefined) {
      formData.append("isPublished", String(payload.isPublished));
    }
    if (payload.images && payload.images.length > 0) {
      formData.append("images", JSON.stringify(payload.images));
    }

    // ফাইল ও ইমেজ অ্যাপেন্ড করা
    if (files?.readmeFile) {
      formData.append("readme", files.readmeFile);
    }
    if (files?.bannerFile) {
      formData.append("banner", files.bannerFile);
    }
    if (files?.galleryFiles && files.galleryFiles.length > 0) {
      files.galleryFiles.forEach((file) => formData.append("images", file));
    }

    if (existingId) {
      const res = await apiClient.patch<any>(`/about/${existingId}`, formData);
      return res?.data ?? res;
    } else {
      const res = await apiClient.post<any>(`/about`, formData);
      return res?.data ?? res;
    }
  },

  /**
   * Admin: README.md ফাইল প্রিভিউ করার হেল্পার
   */
  async uploadReadmePreview(file: File): Promise<{ filename: string; content: string; size: number }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<any>(
      "/about/upload-readme",
      formData
    );
    return res?.data ?? res;
  },

  /**
   * Admin: সফট ডিলিট করা
   */
  async deleteAbout(id: string): Promise<void> {
    await apiClient.delete(`/about/${id}`);
  },

  /**
   * Admin: রিস্টোর করা
   */
  async restoreAbout(id: string): Promise<InstituteAbout> {
    const res = await apiClient.post<any>(`/about/${id}/restore`);
    return res?.data ?? res;
  },
};
