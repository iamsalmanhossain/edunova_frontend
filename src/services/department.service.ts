import { apiClient } from "./api-client";
import { Department } from "@/types/department";

export const VERIFIED_DEPARTMENTS: Department[] = [
  {
    id: "e03dfd3c-1d76-448c-b793-c087a5d53b42",
    name: "Computer Science & Technology",
    code: "CST",
    slug: "computer-science-and-technology",
    description:
      "Modern curriculum covering software engineering, computer networking, database management systems, artificial intelligence, and cybersecurity.",
    highlights: [
      "Modern Computing & AI Laboratory",
      "Industry-standard Software Development",
      "Network Engineering & Cisco Labs",
      "High Placement in Tech Industry",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    _count: {
      subjects: 11,
      studentProfiles: 320,
      teacherProfiles: 12,
    },
  },
  {
    id: "f14efd3c-2e87-459d-c804-d198b6e64c53",
    name: "Electrical Technology",
    code: "ET",
    slug: "electrical-technology",
    description:
      "Comprehensive training in electrical machines, power systems, industrial automation, transmission, and smart grid infrastructures.",
    highlights: [
      "High-Voltage Power Labs",
      "Electrical Machines Testing",
      "Industrial Automation & PLC",
      "Switchgear & Power Protection",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?q=80&w=1200&auto=format&fit=crop",
    _count: {
      subjects: 11,
      studentProfiles: 280,
      teacherProfiles: 10,
    },
  },
  {
    id: "a25ffd3c-3f98-460e-d915-e209c7f75d64",
    name: "Civil Technology",
    code: "CT",
    slug: "civil-technology",
    description:
      "Focusing on structural analysis, surveying, foundation engineering, sustainable construction materials, and environmental infrastructure.",
    highlights: [
      "Total Station Advanced Surveying",
      "Concrete & Soil Mechanics Lab",
      "CAD & Structural Modeling",
      "Highway & Bridge Engineering",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
    _count: {
      subjects: 7,
      studentProfiles: 290,
      teacherProfiles: 11,
    },
  },
  {
    id: "b36ffd3c-4a09-471f-ea26-f310d8a86e75",
    name: "Mechanical Technology",
    code: "MT",
    slug: "mechanical-technology",
    description:
      "Advanced engineering in thermodynamics, fluid mechanics, CNC manufacturing, robotics, and precision mechanical fabrication.",
    highlights: [
      "CNC Machine & Tool Workshop",
      "Thermal & Fluid Engineering Lab",
      "Advanced Fabrication & Welding",
      "Mechatronics & CAD/CAM Systems",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
    _count: {
      subjects: 7,
      studentProfiles: 260,
      teacherProfiles: 9,
    },
  },
];

export const departmentService = {
  /**
   * Fetch public departments from backend GET /departments.
   * If instituteId is passed, returns ONLY the departments offered by that institute!
   */
  async getDepartments(instituteId?: string): Promise<Department[]> {
    try {
      const url = instituteId
        ? `/departments?instituteId=${encodeURIComponent(instituteId)}&limit=100`
        : "/departments?limit=100";
      const response = await apiClient.get<unknown>(url, { skipAuth: true });

      const raw = response.data as Record<string, unknown> | unknown[];
      let items: Department[] = [];

      if (Array.isArray(raw) && raw.length > 0) {
        items = raw as Department[];
      } else if (raw && typeof raw === "object") {
        const nestedData = (raw as { data?: unknown }).data;
        if (Array.isArray(nestedData) && nestedData.length > 0) {
          items = nestedData as Department[];
        }
      }

      if (items.length > 0) {
        return items.map((dept, index) => {
          const fallback = VERIFIED_DEPARTMENTS[index % VERIFIED_DEPARTMENTS.length];
          return {
            ...fallback,
            ...dept,
            id: dept.id || fallback.id,
            slug: dept.code ? dept.code.toLowerCase() : fallback.slug,
          };
        });
      }

      return instituteId ? [] : VERIFIED_DEPARTMENTS;
    } catch (error) {
      console.warn("Could not load departments from backend:", error);
      return instituteId ? [] : VERIFIED_DEPARTMENTS;
    }
  },

  /**
   * Fetch single department by code or ID
   */
  async getDepartmentByCodeOrId(identifier: string): Promise<Department | null> {
    const directMatch = VERIFIED_DEPARTMENTS.find(
      (d) =>
        d.id === identifier ||
        d.code.toLowerCase() === identifier.toLowerCase() ||
        d.slug === identifier.toLowerCase()
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

