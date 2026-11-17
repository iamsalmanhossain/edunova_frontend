export interface DeveloperProfile {
  id: string;
  name: string;
  title: string;
  tagline?: string | null;
  bio: string;
  avatarUrl?: string | null;
  skills: string[];
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  isAvailableForHire?: boolean;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateDeveloperPayload {
  name: string;
  title: string;
  tagline?: string;
  bio: string;
  avatarUrl?: string;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  isAvailableForHire?: boolean;
  isPublished?: boolean;
}
