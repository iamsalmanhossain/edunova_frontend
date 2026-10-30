export interface CampusImage {
  id: string;
  title: string;
  caption?: string;
  category?: "campus" | "laboratory" | "library" | "event" | "workshop" | "academics";
  imageUrl: string;
  thumbnailUrl?: string;
  altText: string;
  featured?: boolean;
  order?: number;
}

export interface CampusFacility {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  features: string[];
}

export interface CampusImageResponse {
  success: boolean;
  data: CampusImage[];
  total?: number;
}

