import { apiClient } from "./api-client";
import { Department } from "@/types/department";

export const VERIFIED_DEPARTMENTS: Department[] = [
  {
    id: "e03dfd3c-1d76-448c-b793-c087a5d53b42",
    name: "Computer Science & Technology",
    code: "CST",
    slug: "cst",
    description:
      "Modern curriculum covering software engineering, computer networking, database systems, artificial intelligence, web development, and cybersecurity.",
    highlights: [
      "Modern Computing & AI Laboratory",
      "Industry-standard Software Development",
      "Network Engineering & Cisco Labs",
      "High Placement in Tech Industry",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    _count: {
      subjects: 12,
      studentProfiles: 800,
      teacherProfiles: 15,
    },
  },
  {
    id: "f04dfd3c-2e87-459d-c804-d198b6e64c53",
    name: "Food Technology",
    code: "FOOD",
    slug: "food",
    description:
      "Specialized education in food chemistry, industrial processing, quality assurance, preservation science, food packaging, and hygiene compliance.",
    highlights: [
      "Advanced Food Quality & Safety Testing",
      "Food Microbiology & Chemical Analysis",
      "Modern Preservation & Pilot Plants",
      "Agro-processing & Beverage Industry Internships",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1200&auto=format&fit=crop",
    _count: {
      subjects: 10,
      studentProfiles: 650,
      teacherProfiles: 12,
    },
  },
  {
    id: "e15ffd3c-3f98-460e-d915-e209c7f75d64",
    name: "Electronics Technology",
    code: "ENT",
    slug: "ent",
    description:
      "Practical mastery in analog & digital electronics, microprocessor systems, telecommunications, embedded devices, robotics, and industrial instrumentation.",
    highlights: [
      "Microcontroller & Embedded Systems Lab",
      "Robotics, IoT & Prototyping Workshop",
      "Digital Signal Processing & Telecom Labs",
      "PCB Design & Industrial Automation",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=1200&auto=format&fit=crop",
    _count: {
      subjects: 11,
      studentProfiles: 700,
      teacherProfiles: 13,
    },
  },
  {
    id: "r26ffd3c-4a09-471f-ea26-f310d8a86e75",
    name: "Refrigeration & Air Conditioning Technology",
    code: "RAC",
    slug: "rac",
    description:
      "Hands-on expertise in thermodynamics, central air conditioning plants, industrial cold storage, commercial ventilation, and eco-friendly cooling systems.",
    highlights: [
      "Commercial HVAC & Central AC Lab",
      "Cold Storage & Industrial Chillers Plant",
      "Thermodynamics & Heat Transfer Workshop",
      "Eco-Friendly Refrigerants & Energy Auditing",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop",
    _count: {
      subjects: 10,
      studentProfiles: 650,
      teacherProfiles: 12,
    },
  },
];

export const departmentService = {
  /**
   * Fetch public departments from backend GET /departments.
   * Defaults to Kishoreganj Government Polytechnic Institute (KIGPI) and ensures the 4 core departments are returned.
   */
  async getDepartments(instituteId?: string): Promise<Department[]> {
    const targetInstId = instituteId || "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b";

    try {
      const url = `/departments?instituteId=${encodeURIComponent(targetInstId)}&limit=100`;
      const response = await apiClient.get<unknown>(url, { skipAuth: true });

      const raw = response.data as Record<string, unknown> | unknown[];
      let items: Department[] = [];

      if (Array.isArray(raw)) {
        items = raw as Department[];
      } else if (raw && typeof raw === "object") {
        const nestedData = (raw as { data?: unknown }).data;
        if (Array.isArray(nestedData)) {
          items = nestedData as Department[];
        }
      }

      if (items.length > 0) {
        const validCodes = ["CST", "FOOD", "ENT", "RAC"];
        const filtered = items.filter((d) => validCodes.includes(d.code?.toUpperCase()));

        // Always merge with verified departments so that imageUrl, descriptions, and highlights are never null
        const map = new Map<string, Department>();
        VERIFIED_DEPARTMENTS.forEach((vd) => map.set(vd.code.toUpperCase(), vd));
        filtered.forEach((fd) => {
          const code = fd.code?.toUpperCase();
          if (map.has(code)) {
            const base = map.get(code)!;
            map.set(code, {
              ...base,
              ...fd,
              imageUrl: fd.imageUrl || base.imageUrl,
              description: fd.description || base.description,
              highlights: (fd.highlights && fd.highlights.length > 0) ? fd.highlights : base.highlights,
            });
          }
        });
        return Array.from(map.values()).filter((d) => validCodes.includes(d.code?.toUpperCase()));
      }

      return VERIFIED_DEPARTMENTS;
    } catch {
      return VERIFIED_DEPARTMENTS;
    }
  },

  /**
   * Fetch single department by code or ID
   */
  async getDepartmentByCodeOrId(identifier: string): Promise<Department | null> {
    const lower = identifier.toLowerCase().trim();
    const directMatch = VERIFIED_DEPARTMENTS.find(
      (d) =>
        d.id === identifier ||
        d.code.toLowerCase() === lower ||
        (d.slug && d.slug.toLowerCase() === lower) ||
        d.name.toLowerCase().includes(lower)
    );

    try {
      const response = await apiClient.get<{ success: boolean; data: Department }>(
        `/departments/${identifier}`
      );
      if (response.data && response.data.data) {
        return {
          ...directMatch,
          ...response.data.data,
        };
      }
      return directMatch || null;
    } catch {
      return directMatch || null;
    }
  },
};

