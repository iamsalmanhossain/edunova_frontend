import { apiClient } from "./api-client";
import {
  CampusFacility,
  CampusGallery,
  CampusLife,
  QueryCampusParams,
  CreateFacilityPayload,
  UpdateFacilityPayload,
  CreateGalleryPayload,
  UpdateGalleryPayload,
  CreateCampusLifePayload,
  UpdateCampusLifePayload,
  CampusImage,
} from "@/types/campus";

// Legacy Fallback Images Data
export const VERIFIED_CAMPUS_IMAGES: CampusImage[] = [
  {
    id: "campus-01",
    title: "Institutional Main Academic Building",
    caption: "Central academic administrative complex featuring state-of-the-art auditoriums and lecture halls",
    category: "campus",
    imageUrl:
      "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
    altText: "EduNova Main Academic Campus Building Exterior View",
    featured: true,
    order: 1,
  },
  {
    id: "campus-02",
    title: "Advanced Computer Software Lab",
    caption: "Modern workstation facility equipped with gigabit networking and development environments",
    category: "laboratory",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    altText: "Students working in EduNova Computer Science and Software Laboratory",
    featured: true,
    order: 2,
  },
  {
    id: "campus-03",
    title: "Central Digital Library & Research Center",
    caption: "Comprehensive repository of technical journals, textbooks, and e-learning terminals",
    category: "library",
    imageUrl:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop",
    altText: "EduNova Central Academic Library with quiet study halls",
    featured: false,
    order: 3,
  },
  {
    id: "campus-04",
    title: "Electrical & Electronics Engineering Workshop",
    caption: "Heavy machinery testbeds, circuit breadboarding stations, and industrial automation tools",
    category: "workshop",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
    altText: "Engineering students in the Electrical Machines Workshop",
    featured: false,
    order: 4,
  },
  {
    id: "campus-05",
    title: "Annual Tech Innovation & Project Showcase",
    caption: "Annual campus festival where engineering students demonstrate hardware and software capstones",
    category: "event",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    altText: "Students exhibiting robotics and technology projects",
    featured: false,
    order: 5,
  },
  {
    id: "campus-06",
    title: "Collaborative Seminar & Lecture Theatre",
    caption: "Acoustically treated interactive classroom for guest lectures and technical symposiums",
    category: "academics",
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    altText: "Interactive group discussion in modern campus lecture hall",
    featured: false,
    order: 6,
  },
];

// Fallback Facilities Data
export const VERIFIED_CAMPUS_FACILITIES: CampusFacility[] = [
  {
    id: "fac-01",
    title: "Computer Software & Artificial Intelligence Laboratory",
    slug: "computer-ai-lab",
    category: "LABORATORY",
    description:
      "Modern high-performance computing center featuring 60+ workstations, gigabit network connectivity, Linux virtualization environments, and machine learning development suites.",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    features: [
      "60+ High-Performance Workstations",
      "Dedicated Gigabit Fiber LAN",
      "Virtualization & Server Infrastructure",
      "AI & Machine Learning Software Tooling",
    ],
    order: 1,
    isPublished: true,
  },
  {
    id: "fac-02",
    title: "Electrical Machines & Industrial Automation Workshop",
    slug: "electrical-machines-workshop",
    category: "WORKSHOP",
    description:
      "Fully operational heavy-current laboratory containing AC/DC motors, induction generators, PLC industrial automation panels, and safety testing rigs.",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
    features: [
      "Three-Phase AC/DC Motor Testbeds",
      "Programmable Logic Controllers (PLC)",
      "High-Voltage Circuit Breaker Simulators",
      "Digital Oscilloscopes & Analyzers",
    ],
    order: 2,
    isPublished: true,
  },
  {
    id: "fac-03",
    title: "Central Technical Library & Digital Research Wing",
    slug: "central-technical-library",
    category: "LIBRARY",
    description:
      "A quiet academic haven holding over 18,000 engineering titles, national and international journals, subscribed IEEE research access, and student study spaces.",
    imageUrl:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop",
    features: [
      "18,000+ Printed Engineering Volumes",
      "Digital Terminals for E-Journal Access",
      "Quiet Individual & Group Study Pods",
      "Book Lending & Renewal Automation",
    ],
    order: 3,
    isPublished: true,
  },
  {
    id: "fac-04",
    title: "Food Chemistry & Microbial Quality Testing Laboratory",
    slug: "food-chemistry-lab",
    category: "LABORATORY",
    description:
      "Sanitary laboratory space dedicated to food preservation research, microbial analysis, titration testing, moisture measurement, and pasteurization units.",
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    features: [
      "Autoclaves & Microbial Incubators",
      "Digital Refractometers & pH Meters",
      "Food Packaging & Thermal Sealers",
      "Spectrophotometers for Chemical Assay",
    ],
    order: 4,
    isPublished: true,
  },
  {
    id: "fac-05",
    title: "Refrigeration, HVAC & Cryogenic Systems Facility",
    slug: "refrigeration-hvac-lab",
    category: "WORKSHOP",
    description:
      "Equipped with industrial chiller trainers, domestic heat pumps, commercial air-handling units (AHU), and eco-friendly refrigerant recovery machinery.",
    imageUrl:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1200&auto=format&fit=crop",
    features: [
      "Commercial Chillers & Heat Exchangers",
      "HVAC Ductwork & Air Balance Trainers",
      "Refrigerant Charging & Recovery Stations",
      "Digital Pressure & Psychrometric Meters",
    ],
    order: 5,
    isPublished: true,
  },
];

// Fallback Gallery Data
export const VERIFIED_CAMPUS_GALLERIES: CampusGallery[] = [
  {
    id: "gal-01",
    title: "Annual Polytechnic Innovation Summit & Tech Expo",
    slug: "annual-polytechnic-innovation-summit",
    description:
      "Students from CST, ENT, Food, and RAC showcase hardware prototypes, autonomous robots, solar chillers, and software applications.",
    category: "EVENTS",
    coverImage:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    eventDate: "2026-03-15T09:00:00.000Z",
    order: 1,
    isPublished: true,
    images: [
      {
        id: "img-01",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
        caption: "Auditorium keynote speech and opening ceremony of Innovation Summit",
        uploadedAt: "2026-03-15T09:30:00.000Z",
      },
      {
        id: "img-02",
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
        caption: "Engineering students demonstrating microcontroller automation circuit",
        uploadedAt: "2026-03-15T10:15:00.000Z",
      },
      {
        id: "img-03",
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
        caption: "Computer programming competition at Software Testing Center",
        uploadedAt: "2026-03-15T11:00:00.000Z",
      },
      {
        id: "img-04",
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
        caption: "Industry jury panel reviewing student project presentations",
        uploadedAt: "2026-03-15T14:00:00.000Z",
      },
    ],
  },
  {
    id: "gal-02",
    title: "Campus Architecture, Grounds & Green Quadrangles",
    slug: "campus-architecture-grounds",
    description:
      "A scenic visual tour around the Kishoreganj Polytechnic Institute academic buildings, tree-lined walkways, and student dormitories.",
    category: "CAMPUS",
    coverImage:
      "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
    eventDate: "2026-02-10T10:00:00.000Z",
    order: 2,
    isPublished: true,
    images: [
      {
        id: "img-05",
        url: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
        caption: "Central Academic Building entrance and lush lawn perimeter",
        uploadedAt: "2026-02-10T10:10:00.000Z",
      },
      {
        id: "img-06",
        url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
        caption: "Main academic quadrangle during morning shift lecture break",
        uploadedAt: "2026-02-10T10:45:00.000Z",
      },
      {
        id: "img-07",
        url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
        caption: "Students collaborating on group assignments in the campus garden",
        uploadedAt: "2026-02-10T11:30:00.000Z",
      },
    ],
  },
  {
    id: "gal-03",
    title: "Engineering Practicums & Workshop Laboratory Sessions",
    slug: "engineering-practicums-laboratories",
    description:
      "Daily experiential learning inside the physics, food analysis, refrigeration, and electronics laboratories.",
    category: "LABS",
    coverImage:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1200&auto=format&fit=crop",
    eventDate: "2026-01-20T11:00:00.000Z",
    order: 3,
    isPublished: true,
    images: [
      {
        id: "img-08",
        url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1200&auto=format&fit=crop",
        caption: "Electronics instructors guiding students through oscilloscope wave analysis",
        uploadedAt: "2026-01-20T11:15:00.000Z",
      },
      {
        id: "img-09",
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
        caption: "Food preservation chemical titration in microbiology facility",
        uploadedAt: "2026-01-20T12:00:00.000Z",
      },
      {
        id: "img-10",
        url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop",
        caption: "Reference section research at Central Digital Library",
        uploadedAt: "2026-01-20T14:30:00.000Z",
      },
    ],
  },
];

// Fallback Campus Life Data
export const VERIFIED_CAMPUS_LIVES: CampusLife[] = [
  {
    id: "life-01",
    title: "KIPI Polytechnic Robotics & Artificial Intelligence Club",
    category: "CLUBS",
    description:
      "A hands-on student club dedicated to autonomous rover design, Arduino & Raspberry Pi hardware programming, IoT sensing, and national robotics olympiads.",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
    activities: [
      "Weekly Microcontroller & Sensor Workshops",
      "Line-Follower & Battle-Bot Engineering Competitions",
      "Industrial IoT Automation Hackathons",
      "Mentorship from Senior Electronics Instructors",
    ],
    contactEmail: "robotics.club@kipi.edu.bd",
    order: 1,
    isPublished: true,
  },
  {
    id: "life-02",
    title: "Computer Science & Programming Society (CSPS)",
    category: "SOCIETIES",
    description:
      "Fosters competitive programming problem-solving, modern web & mobile engineering, algorithm workshops, and collaborative open-source community contributions.",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    activities: [
      "Bi-Weekly Intra-Polytechnic Code Sprints",
      "Web Stack & Next.js Framework Bootcamps",
      "Cybersecurity & CTF Training Sessions",
      "Guest Technical Lectures by Software Engineers",
    ],
    contactEmail: "csps@kipi.edu.bd",
    order: 2,
    isPublished: true,
  },
  {
    id: "life-03",
    title: "Rover Scout Group & Community Humanitarian Unit",
    category: "SCOUTS",
    description:
      "Instilling discipline, civic leadership, disaster relief management, blood donation drives, and national scouting jamboree participation.",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    activities: [
      "Disaster Readiness & First-Aid Certifications",
      "Institutional Campus Cleanliness Drives",
      "Annual National Scout Jamboree Delegations",
      "Blood Donor Registry & Free Health Camps",
    ],
    contactEmail: "roverscout@kipi.edu.bd",
    order: 3,
    isPublished: true,
  },
  {
    id: "life-04",
    title: "Polytechnic Sports Board & Athletics Council",
    category: "SPORTS",
    description:
      "Organizing inter-departmental cricket leagues, football championships, table tennis tournaments, badminton, and annual sports week.",
    imageUrl:
      "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=1200&auto=format&fit=crop",
    activities: [
      "Annual Inter-Department Football Cup",
      "Inter-Polytechnic Cricket Tournaments",
      "Indoor Games: Table Tennis & Carrom",
      "Annual Athletic Meet & Marathon",
    ],
    contactEmail: "sports@kipi.edu.bd",
    order: 4,
    isPublished: true,
  },
];

export const campusService = {
  // =========================================================================
  // 1. FACILITIES API
  // =========================================================================

  async getFacilities(params?: QueryCampusParams): Promise<CampusFacility[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "ALL") query.set("category", params.category);
    if (params?.search) query.set("search", params.search.trim());
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    try {
      const res = await apiClient.get<any>(`/campus/facilities${qs}`, { skipAuth: true });
      const raw = res?.data ?? res;
      if (Array.isArray(raw) && raw.length > 0) return raw;
      if (raw && typeof raw === "object" && Array.isArray((raw as any).data)) {
        return (raw as any).data;
      }
      return VERIFIED_CAMPUS_FACILITIES;
    } catch {
      return VERIFIED_CAMPUS_FACILITIES;
    }
  },

  async getFacilityById(id: string): Promise<CampusFacility | null> {
    try {
      const res = await apiClient.get<any>(`/campus/facilities/${id}`, { skipAuth: true });
      return res?.data ?? res;
    } catch {
      return VERIFIED_CAMPUS_FACILITIES.find((f) => f.id === id || f.slug === id) || null;
    }
  },

  async createFacility(payload: CreateFacilityPayload, imageFile?: File | null): Promise<CampusFacility> {
    const formData = new FormData();
    formData.append("title", payload.title);
    if (payload.slug) formData.append("slug", payload.slug);
    formData.append("category", payload.category);
    formData.append("description", payload.description);
    if (payload.features && payload.features.length > 0) {
      formData.append("features", JSON.stringify(payload.features));
    }
    if (payload.imageUrl) formData.append("imageUrl", payload.imageUrl);
    if (payload.isPublished !== undefined) formData.append("isPublished", String(payload.isPublished));
    if (imageFile) formData.append("image", imageFile);

    const res = await apiClient.post<any>("/campus/facilities", formData);
    return res?.data ?? res;
  },

  async updateFacility(id: string, payload: UpdateFacilityPayload, imageFile?: File | null): Promise<CampusFacility> {
    const formData = new FormData();
    if (payload.title) formData.append("title", payload.title);
    if (payload.slug) formData.append("slug", payload.slug);
    if (payload.category) formData.append("category", payload.category);
    if (payload.description) formData.append("description", payload.description);
    if (payload.features) formData.append("features", JSON.stringify(payload.features));
    if (payload.imageUrl) formData.append("imageUrl", payload.imageUrl);
    if (payload.isPublished !== undefined) formData.append("isPublished", String(payload.isPublished));
    if (imageFile) formData.append("image", imageFile);

    const res = await apiClient.patch<any>(`/campus/facilities/${id}`, formData);
    return res?.data ?? res;
  },

  async deleteFacility(id: string): Promise<void> {
    await apiClient.delete(`/campus/facilities/${id}`);
  },

  async restoreFacility(id: string): Promise<CampusFacility> {
    const res = await apiClient.post<any>(`/campus/facilities/${id}/restore`);
    return res?.data ?? res;
  },

  // =========================================================================
  // 2. PHOTO GALLERY (ALBUMS & IMAGES) API
  // =========================================================================

  async getGalleries(params?: QueryCampusParams): Promise<CampusGallery[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "ALL") query.set("category", params.category);
    if (params?.search) query.set("search", params.search.trim());
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    try {
      const res = await apiClient.get<any>(`/campus/gallery${qs}`, { skipAuth: true });
      const raw = res?.data ?? res;
      if (Array.isArray(raw) && raw.length > 0) return raw;
      if (raw && typeof raw === "object" && Array.isArray((raw as any).data)) {
        return (raw as any).data;
      }
      return VERIFIED_CAMPUS_GALLERIES;
    } catch {
      return VERIFIED_CAMPUS_GALLERIES;
    }
  },

  async getGalleryById(id: string): Promise<CampusGallery | null> {
    try {
      const res = await apiClient.get<any>(`/campus/gallery/${id}`, { skipAuth: true });
      return res?.data ?? res;
    } catch {
      return VERIFIED_CAMPUS_GALLERIES.find((g) => g.id === id || g.slug === id) || null;
    }
  },

  async createGallery(
    payload: CreateGalleryPayload,
    coverFile?: File | null,
    imageFiles?: File[]
  ): Promise<CampusGallery> {
    const formData = new FormData();
    formData.append("title", payload.title);
    if (payload.slug) formData.append("slug", payload.slug);
    if (payload.description) formData.append("description", payload.description);
    formData.append("category", payload.category);
    if (payload.eventDate) formData.append("eventDate", payload.eventDate);
    if (payload.coverImage) formData.append("coverImage", payload.coverImage);
    if (payload.isPublished !== undefined) formData.append("isPublished", String(payload.isPublished));

    if (coverFile) formData.append("cover", coverFile);
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => formData.append("images", file));
    }

    const res = await apiClient.post<any>("/campus/gallery", formData);
    return res?.data ?? res;
  },

  async updateGallery(
    id: string,
    payload: UpdateGalleryPayload,
    coverFile?: File | null,
    imageFiles?: File[]
  ): Promise<CampusGallery> {
    const formData = new FormData();
    if (payload.title) formData.append("title", payload.title);
    if (payload.slug) formData.append("slug", payload.slug);
    if (payload.description) formData.append("description", payload.description);
    if (payload.category) formData.append("category", payload.category);
    if (payload.eventDate) formData.append("eventDate", payload.eventDate);
    if (payload.coverImage) formData.append("coverImage", payload.coverImage);
    if (payload.isPublished !== undefined) formData.append("isPublished", String(payload.isPublished));

    if (coverFile) formData.append("cover", coverFile);
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => formData.append("images", file));
    }

    const res = await apiClient.patch<any>(`/campus/gallery/${id}`, formData);
    return res?.data ?? res;
  },

  async addGalleryImages(
    galleryId: string,
    files: File[],
    imageUrls?: string[],
    captions?: string[]
  ): Promise<CampusGallery> {
    const formData = new FormData();
    if (files && files.length > 0) {
      files.forEach((f) => formData.append("images", f));
    }
    if (imageUrls && imageUrls.length > 0) {
      formData.append("imageUrls", JSON.stringify(imageUrls));
    }
    if (captions && captions.length > 0) {
      formData.append("captions", JSON.stringify(captions));
    }

    const res = await apiClient.post<any>(`/campus/gallery/${galleryId}/images`, formData);
    return res?.data ?? res;
  },

  async removeGalleryImage(galleryId: string, imageId: string): Promise<CampusGallery> {
    const res = await apiClient.delete<any>(`/campus/gallery/${galleryId}/images/${imageId}`);
    return res?.data ?? res;
  },

  async deleteGallery(id: string): Promise<void> {
    await apiClient.delete(`/campus/gallery/${id}`);
  },

  async restoreGallery(id: string): Promise<CampusGallery> {
    const res = await apiClient.post<any>(`/campus/gallery/${id}/restore`);
    return res?.data ?? res;
  },

  // =========================================================================
  // 3. CAMPUS LIFE API
  // =========================================================================

  async getCampusLife(params?: QueryCampusParams): Promise<CampusLife[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "ALL") query.set("category", params.category);
    if (params?.search) query.set("search", params.search.trim());
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    try {
      const res = await apiClient.get<any>(`/campus/life${qs}`, { skipAuth: true });
      const raw = res?.data ?? res;
      if (Array.isArray(raw) && raw.length > 0) return raw;
      if (raw && typeof raw === "object" && Array.isArray((raw as any).data)) {
        return (raw as any).data;
      }
      return VERIFIED_CAMPUS_LIVES;
    } catch {
      return VERIFIED_CAMPUS_LIVES;
    }
  },

  async getCampusLifeById(id: string): Promise<CampusLife | null> {
    try {
      const res = await apiClient.get<any>(`/campus/life/${id}`, { skipAuth: true });
      return res?.data ?? res;
    } catch {
      return VERIFIED_CAMPUS_LIVES.find((c) => c.id === id) || null;
    }
  },

  async createCampusLife(payload: CreateCampusLifePayload, imageFile?: File | null): Promise<CampusLife> {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("category", payload.category);
    formData.append("description", payload.description);
    if (payload.activities && payload.activities.length > 0) {
      formData.append("activities", JSON.stringify(payload.activities));
    }
    if (payload.contactEmail) formData.append("contactEmail", payload.contactEmail);
    if (payload.imageUrl) formData.append("imageUrl", payload.imageUrl);
    if (payload.isPublished !== undefined) formData.append("isPublished", String(payload.isPublished));
    if (imageFile) formData.append("image", imageFile);

    const res = await apiClient.post<any>("/campus/life", formData);
    return res?.data ?? res;
  },

  async updateCampusLife(id: string, payload: UpdateCampusLifePayload, imageFile?: File | null): Promise<CampusLife> {
    const formData = new FormData();
    if (payload.title) formData.append("title", payload.title);
    if (payload.category) formData.append("category", payload.category);
    if (payload.description) formData.append("description", payload.description);
    if (payload.activities) formData.append("activities", JSON.stringify(payload.activities));
    if (payload.contactEmail) formData.append("contactEmail", payload.contactEmail);
    if (payload.imageUrl) formData.append("imageUrl", payload.imageUrl);
    if (payload.isPublished !== undefined) formData.append("isPublished", String(payload.isPublished));
    if (imageFile) formData.append("image", imageFile);

    const res = await apiClient.patch<any>(`/campus/life/${id}`, formData);
    return res?.data ?? res;
  },

  async deleteCampusLife(id: string): Promise<void> {
    await apiClient.delete(`/campus/life/${id}`);
  },

  async restoreCampusLife(id: string): Promise<CampusLife> {
    const res = await apiClient.post<any>(`/campus/life/${id}/restore`);
    return res?.data ?? res;
  },

  // Legacy compatibility
  async getCampusFacilities(params?: QueryCampusParams): Promise<CampusFacility[]> {
    return this.getFacilities(params);
  },

  async getPublicCampusImages(category?: string, limit = 12): Promise<CampusImage[]> {
    return this.getPublicImages(category, limit);
  },

  async getPublicImages(category?: string, limit = 12): Promise<CampusImage[]> {
    const galleries = await this.getGalleries({ category, limit });
    const flattened: CampusImage[] = [];
    for (const g of galleries) {
      if (g.images && g.images.length > 0) {
        for (const img of g.images) {
          flattened.push({
            id: img.id,
            title: g.title,
            caption: img.caption || g.description || undefined,
            category: g.category,
            imageUrl: img.url,
            altText: img.caption || g.title,
          });
        }
      } else if (g.coverImage) {
        flattened.push({
          id: g.id,
          title: g.title,
          caption: g.description || undefined,
          category: g.category,
          imageUrl: g.coverImage,
          altText: g.title,
        });
      }
    }
    return flattened.slice(0, limit);
  },
};
