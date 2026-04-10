/**
 * Application-wide constants
 */

export const SITE_NAME = 'C-H Automobile & Exclusive Cars';
export const SITE_DESCRIPTION = 'Ihr exklusiver Fahrzeughändler in Friedberg – Premium & Sportwagen, persönliche Beratung, erstklassiger Service.';

export const COMPANY_INFO = {
  name: 'C-H Automobile & Exclusive Cars',
  street: 'Straßheimer Str. 67-69',
  zip: '61169',
  city: 'Friedberg',
  state: 'Hessen',
  country: 'Deutschland',
  phone: '+49 1517 5606841',
  email: 'info@ch-automobile.de',
  website: 'https://ch-automobile.de',
  googleMapsUrl: 'https://maps.app.goo.gl/your-map-link',
  coordinates: {
    lat: 50.3345,
    lng: 8.7548,
  },
  hours: {
    weekdays: '09:00 – 18:00',
    saturday: '10:00 – 14:00',
    sunday: 'Geschlossen',
  },
} as const;

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const SUPPORTED_LOCALES = [
  'de', 'en', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'cs', 'sk',
  'hu', 'ro', 'bg', 'hr', 'sl', 'et', 'lv', 'lt', 'fi', 'sv',
  'da', 'el', 'ga', 'mt',
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'de';

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  cs: 'Čeština',
  sk: 'Slovenčina',
  hu: 'Magyar',
  ro: 'Română',
  bg: 'Български',
  hr: 'Hrvatski',
  sl: 'Slovenščina',
  et: 'Eesti',
  lv: 'Latviešu',
  lt: 'Lietuvių',
  fi: 'Suomi',
  sv: 'Svenska',
  da: 'Dansk',
  el: 'Ελληνικά',
  ga: 'Gaeilge',
  mt: 'Malti',
};

export const ITEMS_PER_PAGE = 12;

export const VEHICLE_SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Neueste zuerst' },
  { value: 'created_at_asc', label: 'Älteste zuerst' },
  { value: 'price_asc', label: 'Preis aufsteigend' },
  { value: 'price_desc', label: 'Preis absteigend' },
  { value: 'mileage_asc', label: 'Kilometerstand aufsteigend' },
  { value: 'mileage_desc', label: 'Kilometerstand absteigend' },
  { value: 'year_desc', label: 'Baujahr absteigend' },
  { value: 'year_asc', label: 'Baujahr aufsteigend' },
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
