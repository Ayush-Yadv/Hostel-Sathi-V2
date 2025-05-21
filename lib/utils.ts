import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAvailableImages(images: string[]): string[] {
  // Filter out any null, undefined, or empty strings
  return images.filter(img => img && img.trim() !== '');
}

export function getFirstAvailableImage(images: string[]): string {
  const availableImages = getAvailableImages(images);
  return availableImages.length > 0 ? availableImages[0] : '/placeholder.svg';
}
