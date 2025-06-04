// src/lib/utils.ts
// - Added mapPageTypeToCategoryLabel function.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapPageTypeToCategoryLabel(pageType: string | undefined | null): string {
  if (!pageType) return ''; // Handle undefined or null pageType gracefully
  switch (pageType.toUpperCase()) {
    case 'MAIN': return 'Main';
    case 'CONTENT_HUB': return 'Explore';
    case 'RESOURCES': return 'Resources';
    // Add other mappings as needed
    default: return pageType; // Fallback to the raw page_type if not specifically mapped
  }
}