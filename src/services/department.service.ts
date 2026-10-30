import { apiClient } from "./api-client";
import { Department, DepartmentResponse } from "@/types/department";

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
    id: "et-dept-002",
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
    id: "ct-dept-003",
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
    id: "mt-dept-004",
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
   * Fetch public departments from backend GET /departments
   */
  async getDepartments(instituteId?: string): Promise<Department[]> {
    try {
      const url = instituteId
        ? `/departments?instituteId=${instituteId}`
        : "/departments";
      const response = await apiClient.get<DepartmentResponse>(url);
      if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return (response.data.data as Department[]).map((dept, index) => {
          const fallback = VERIFIED_DEPARTMENTS[index % VERIFIED_DEPARTMENTS.length];
          return {
            ...fallback,
            ...dept,
            slug: dept.code
              ? dept.code.toLowerCase()
              : fallback.slug,
          };
        });
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

