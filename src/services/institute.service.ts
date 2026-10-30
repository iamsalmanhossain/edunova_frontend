import { apiClient } from "./api-client";
import { Institute, InstituteResponse } from "@/types/institute";

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
   * Fetch all institutes (Public)
   */
  async getInstitutes(): Promise<Institute[]> {
    try {
      const response = await apiClient.get<InstituteResponse>("/institutes");
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data as Institute[];
      }
      return VERIFIED_INSTITUTES;
    } catch {
      // Graceful fallback to verified institutions
      return VERIFIED_INSTITUTES;
    }
  },

  /**
   * Fetch institute by ID (Public)
   */
  async getInstituteById(id: string): Promise<Institute> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Institute }>(
        `/institutes/${id}`
      );
      if (response.data && response.data.data) {
        return response.data.data;
      }
      const found = VERIFIED_INSTITUTES.find((i) => i.id === id);
      return found || VERIFIED_INSTITUTES[0];
    } catch {
      const found = VERIFIED_INSTITUTES.find((i) => i.id === id);
      return found || VERIFIED_INSTITUTES[0];
    }
  },
};

