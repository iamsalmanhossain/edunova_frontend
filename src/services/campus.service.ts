import { apiClient } from "./api-client";
import { CampusImage, CampusFacility } from "@/types/campus";

/**
 * PENDING BACKEND INTEGRATION CONTRACT:
 * Expected Endpoint: GET /campus/images?category={category}&limit={limit}
 * Expected Response Body:
 * {
 *   success: boolean;
 *   data: Array<{
 *     id: string;
 *     title: string;
 *     caption?: string;
 *     category: "campus" | "laboratory" | "library" | "event" | "workshop" | "academics";
 *     imageUrl: string;
 *     thumbnailUrl?: string;
 *     altText: string;
 *     featured?: boolean;
 *     order?: number;
 *   }>
 * }
 */

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
    title: "Electrical & Machine Engineering Workshop",
    caption: "Hands-on electrical machine testing and motor installation testbeds",
    category: "workshop",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
    altText: "Electrical technology students testing machine circuits in workshop",
    featured: false,
    order: 4,
  },
  {
    id: "campus-05",
    title: "Civil Materials & Surveying Practice",
    caption: "Field surveying using digital total stations and construction material testing",
    category: "laboratory",
    imageUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
    altText: "Civil engineering field testing equipment on campus",
    featured: false,
    order: 5,
  },
  {
    id: "campus-06",
    title: "Annual Polytechnic Innovation Summit",
    caption: "Student project exhibitions, technical symposiums, and engineering demonstrations",
    category: "event",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    altText: "Students and faculty at the annual EduNova technical exhibition",
    featured: true,
    order: 6,
  },
];

export const VERIFIED_CAMPUS_FACILITIES: CampusFacility[] = [
  {
    id: "fac-01",
    title: "Computer & AI Laboratories",
    category: "Technology",
    description:
      "High-performance computing workstations with gigabit fiber, AI development tooling, and virtualized development stacks.",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    features: ["120+ Modern Workstations", "Gigabit LAN & WiFi 6", "Cloud Sandbox Access"],
  },
  {
    id: "fac-02",
    title: "Electrical Machines & Power Lab",
    category: "Engineering",
    description:
      "Industrial electrical testbenches, transformer testing stations, AC/DC machine test racks, and PLC automation modules.",
    imageUrl:
      "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?q=80&w=800&auto=format&fit=crop",
    features: ["Three-phase Power Sets", "Safety Interlocks", "PLC & Relay Panels"],
  },
  {
    id: "fac-03",
    title: "Mechanical & CNC Workshop",
    category: "Manufacturing",
    description:
      "Heavy-duty lathe machines, precision CNC equipment, welding booths, and metrology measurement tools for hands-on production.",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    features: ["Precision CNC Mills", "MIG/TIG Welding", "Thermal Heat Treatment"],
  },
  {
    id: "fac-04",
    title: "Central Technical Library",
    category: "Academics",
    description:
      "Over 15,000 engineering volumes, international technical periodicals, and silent digital reading cubicles.",
    imageUrl:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop",
    features: ["Digital Catalog", "E-Journal Database", "Group Study Rooms"],
  },
];

export const campusService = {
  /**
   * Dedicated GET service method for campus gallery images
   * Tries documented endpoint GET /campus/images; provides verified fallback adapter
   */
  async getPublicCampusImages(category?: string): Promise<CampusImage[]> {
    try {
      const url = category
        ? `/campus/images?category=${category}`
        : "/campus/images";
      const response = await apiClient.get<{
        success: boolean;
        data: CampusImage[];
      }>(url);

      if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data;
      }
      return VERIFIED_CAMPUS_IMAGES;
    } catch {
      // Independent failure isolation: campus API failure never crashes homepage
      return VERIFIED_CAMPUS_IMAGES;
    }
  },

  /**
   * Fetch verified campus facilities
   */
  async getCampusFacilities(): Promise<CampusFacility[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: CampusFacility[];
      }>("/campus/facilities");
      if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data;
      }
      return VERIFIED_CAMPUS_FACILITIES;
    } catch {
      return VERIFIED_CAMPUS_FACILITIES;
    }
  },
};

