import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx + tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in EUR
 */
export function formatPrice(price: number, locale = 'de-DE'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format mileage with thousands separator
 */
export function formatMileage(km: number, locale = 'de-DE'): string {
  return `${new Intl.NumberFormat(locale).format(km)} km`;
}

/**
 * Format date
 */
export function formatDate(date: string | Date, locale = 'de-DE'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '…';
}

/**
 * Generate vehicle slug
 */
export function vehicleSlug(brand: string, model: string, year: number): string {
  return `${brand}-${model}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Debounce function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Build URL search params from object
 */
export function buildSearchParams(params: Record<string, string | number | boolean | undefined | null>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  const str = searchParams.toString();
  return str ? `?${str}` : '';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Fuel type labels
 */
export const fuelTypeLabels: Record<string, string> = {
  petrol: 'Benzin',
  diesel: 'Diesel',
  electric: 'Elektro',
  hybrid: 'Hybrid',
  plug_in_hybrid: 'Plug-in-Hybrid',
  hydrogen: 'Wasserstoff',
  lpg: 'LPG',
  cng: 'CNG',
};

/**
 * Transmission labels
 */
export const transmissionLabels: Record<string, string> = {
  automatic: 'Automatik',
  manual: 'Schaltgetriebe',
  semi_automatic: 'Halbautomatik',
};

/**
 * Body type labels
 */
export const bodyTypeLabels: Record<string, string> = {
  sedan: 'Limousine',
  suv: 'SUV',
  coupe: 'Coupé',
  cabrio: 'Cabrio',
  kombi: 'Kombi',
  hatchback: 'Schrägheck',
  van: 'Van',
  pickup: 'Pick-up',
  roadster: 'Roadster',
  limousine: 'Limousine',
  other: 'Sonstige',
};

/**
 * Condition labels
 */
export const conditionLabels: Record<string, string> = {
  new: 'Neuwagen',
  used: 'Gebrauchtwagen',
  demonstration: 'Vorführwagen',
  classic: 'Oldtimer',
};
