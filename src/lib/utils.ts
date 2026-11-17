import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely validates if a string is a valid image URL for Next.js <Image />.
 * Must begin with http://, https://, or / (relative public path), or data:image/.
 * Type guard narrows to string.
 */
export function isValidImageUrl(url?: string | null): url is string {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:image/")
  );
}

/**
 * Returns a valid URL or falls back to the default avatar.
 * Prevents Next.js Image component from crashing on invalid/dummy database strings.
 */
export function getSafeAvatarUrl(
  url?: string | null,
  fallback = "/images/default-avatar.png"
): string {
  return isValidImageUrl(url) ? url.trim() : fallback;
}
