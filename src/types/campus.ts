export interface GalleryImageItem {
  id: string;
  url: string;
  caption?: string;
  order?: number;
  uploadedAt: string;
}

export interface FlatGalleryPhoto {
  id: string;
  url: string;
  title: string;
  caption?: string;
  category: string;
  albumId: string;
  albumTitle: string;
  eventDate?: string | null;
  uploadedAt?: string;
}

export interface CampusGallery {
  id: string;
  instituteId?: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  category: string;
  coverImage?: string | null;
  images: GalleryImageItem[];
  eventDate?: string | null;
  order?: number;
  isPublished?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CampusFacility {
  id: string;
  instituteId?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  features: string[];
  order?: number;
  isPublished?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CampusLife {
  id: string;
  instituteId?: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  activities: string[];
  contactEmail?: string | null;
  order?: number;
  isPublished?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface QueryCampusParams {
  instituteId?: string;
  category?: string;
  search?: string;
  isPublished?: boolean;
  includeDeleted?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateFacilityPayload {
  title: string;
  slug?: string;
  category: string;
  description: string;
  imageUrl?: string;
  features?: string[];
  order?: number;
  isPublished?: boolean;
}

export interface UpdateFacilityPayload extends Partial<CreateFacilityPayload> {}

export interface CreateGalleryPayload {
  title: string;
  slug?: string;
  description?: string;
  category: string;
  coverImage?: string;
  eventDate?: string;
  order?: number;
  isPublished?: boolean;
}

export interface UpdateGalleryPayload extends Partial<CreateGalleryPayload> {}

export interface AddGalleryImagesPayload {
  imageUrls?: string[];
  captions?: string[];
}

export interface CreateCampusLifePayload {
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  activities?: string[];
  contactEmail?: string;
  order?: number;
  isPublished?: boolean;
}

export interface UpdateCampusLifePayload extends Partial<CreateCampusLifePayload> {}

// Legacy compatibility alias
export interface CampusImage {
  id: string;
  title: string;
  caption?: string;
  category?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText: string;
  featured?: boolean;
  order?: number;
}
