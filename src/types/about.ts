export interface InstituteInfo {
  id: string;
  name: string;
  code: string;
  division?: string;
  district?: string;
  address?: string | null;
  website?: string | null;
}

export interface InstituteAbout {
  id: string;
  instituteId: string;
  slug: string;
  title: string;
  tagline?: string | null;
  content: string;
  bannerUrl?: string | null;
  images: string[];
  mission?: string | null;
  vision?: string | null;
  history?: string | null;
  markdownFile?: string | null;
  isPublished: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  institute?: InstituteInfo;
}

export interface CreateAboutPayload {
  instituteId?: string;
  slug?: string;
  title: string;
  tagline?: string;
  content?: string;
  bannerUrl?: string;
  images?: string[];
  mission?: string;
  vision?: string;
  history?: string;
  isPublished?: boolean;
}

export interface QueryAboutParams {
  instituteId?: string;
  slug?: string;
  isPublished?: boolean;
  includeDeleted?: boolean;
  page?: number;
  limit?: number;
}
