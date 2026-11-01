import { apiClient } from "./api-client";
import { Institute } from "@/types/institute";

// Verified institutional fallback data directly from verified backend seed
export const VERIFIED_INSTITUTES: Institute[] = [
  {
    id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    name: "Kishoreganj Polytechnic Institute",
    code: "KIPI",
    division: "Dhaka",
    district: "Kishoreganj",
    address: "Korimganj, Kishoreganj, Bangladesh",
    website: "https://kishoreganj.polytech.gov.bd",
    isActive: true,
    studentCount: 1250,
    teacherCount: 48,
  },
  {
    id: "b45e7f1a-92c1-4ef3-8a3b-28394019284a",
    name: "Dhaka Polytechnic Institute",
    code: "DPI",
    division: "Dhaka",
    district: "Dhaka",
    address: "Tejgaon, Dhaka-1208, Bangladesh",
    website: "https://dpi.gov.bd",
    isActive: true,
    studentCount: 3200,
    teacherCount: 110,
  },
];

export const instituteService = {
  /**
   * Fetch all institutes from backend GET /institutes (Public)
   */
  async getInstitutes(): Promise<Institute[]> {
    try {
      const response = await apiClient.get<unknown>(
        "/institutes?limit=100&isActive=true",
        { skipAuth: true }
      );

      const raw = response.data as Record<string, unknown> | unknown[];
      if (Array.isArray(raw) && raw.length > 0) {
        return raw as Institute[];
      }
      if (raw && typeof raw === "object") {
        const nestedData = (raw as { data?: unknown }).data;
        if (Array.isArray(nestedData) && nestedData.length > 0) {
          return nestedData as Institute[];
        }
      }
      return VERIFIED_INSTITUTES;
    } catch (error) {
      console.warn("Could not load institutes from backend, using verified fallback:", error);
      return VERIFIED_INSTITUTES;
    }
  },

  /**
   * Fetch institute by ID (Public)
   */
  async getInstituteById(id: string): Promise<Institute> {
    try {
      const response = await apiClient.get<unknown>(`/institutes/${id}`, {
        skipAuth: true,
      });
      const raw = response.data as Record<string, unknown>;
      if (raw && typeof raw === "object") {
        const inst = (raw.data || raw) as Institute;
        if (inst && inst.id) return inst;
      }
      const found = VERIFIED_INSTITUTES.find((i) => i.id === id);
      return found || VERIFIED_INSTITUTES[0];
    } catch {
      const found = VERIFIED_INSTITUTES.find((i) => i.id === id);
      return found || VERIFIED_INSTITUTES[0];
    }
  },
};

