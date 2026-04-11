/* ============================================
   API Type Definitions
   — Aligned with backend response fields
   ============================================ */

// ---------- Vehicle ----------
export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  variant: string | null;
  slug: string;
  year: number;
  price: number;
  price_on_request: boolean;
  mileage: number;
  fuel_type: FuelType;
  transmission: Transmission;
  body_type: BodyType;
  color: string | null;
  interior_color: string | null;
  power_hp: number | null;
  power_kw: number | null;
  engine_displacement: number | null;
  doors: number | null;
  seats: number | null;
  emission_class: string | null;
  co2_emissions: number | null;
  fuel_consumption_combined: number | null;
  fuel_consumption_urban: number | null;
  fuel_consumption_extra_urban: number | null;
  registration_date: string | null;
  tuv_until: string | null;
  previous_owners: number | null;
  accident_free: boolean;
  non_smoker: boolean;
  garage_kept: boolean;
  condition: VehicleCondition;
  warranty: string | null;
  description: Record<string, string>;
  features: string[];
  equipment: string[];
  status: VehicleStatus;
  is_featured: boolean;
  mobile_de_id: string | null;
  views_count: number;
  full_name: string;
  formatted_price: string;
  formatted_mileage: string;
  main_image: string | null;
  thumbnail: string | null;
  images: MediaItem[];
  images_count: number;
  created_at: string;
  updated_at: string;
}

export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'plug_in_hybrid' | 'hydrogen' | 'lpg' | 'cng';
export type Transmission = 'automatic' | 'manual' | 'semi_automatic';
export type BodyType = 'sedan' | 'suv' | 'coupe' | 'cabrio' | 'kombi' | 'hatchback' | 'van' | 'pickup' | 'roadster' | 'limousine' | 'other';
export type VehicleCondition = 'new' | 'used' | 'demonstration' | 'classic';
export type VehicleStatus = 'available' | 'reserved' | 'sold' | 'draft';

export interface MediaItem {
  id: number;
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
  alt: string;
  order: number;
}

// ---------- Vehicle Filters ----------
export interface VehicleFilters {
  brand?: string;
  model?: string;
  fuel_type?: FuelType;
  transmission?: Transmission;
  body_type?: BodyType;
  condition?: VehicleCondition;
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  mileage_max?: number;
  power_min?: number;
  search?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}

// ---------- Inquiry ----------
export interface Inquiry {
  id: number;
  type: InquiryType;
  vehicle_id: number | null;
  vehicle?: Vehicle;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  preferred_date: string | null;
  preferred_time: string | null;
  preferred_contact_method: string | null;
  status: InquiryStatus;
  reference_number: string;
  locale: string | null;
  created_at: string;
}

export type InquiryType = 'general' | 'test_drive' | 'price_inquiry' | 'financing' | 'trade_in';
export type InquiryStatus = 'new' | 'in_progress' | 'completed' | 'archived';

// ---------- Trade-In ----------
export interface TradeInValuation {
  id: number;
  inquiry_id: number;
  trade_brand: string;
  trade_model: string;
  trade_year: number;
  trade_mileage: number;
  trade_condition: string;
  trade_description: string | null;
  estimated_value: number | null;
  photos: MediaItem[];
}

// ---------- Reservation ----------
export interface Reservation {
  id: number;
  vehicle_id: number;
  vehicle?: Vehicle;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  deposit_amount: number;
  bank_transfer_status: PaymentStatus;
  payment_reference: string;
  admin_notes: string | null;
  reservation_expires_at: string;
  payment_confirmed_at: string | null;
  created_at: string;
}

export type PaymentStatus = 'pending' | 'confirmed' | 'expired' | 'cancelled';

// ---------- Blog ----------
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
}

export interface BlogPost {
  id: number;
  category_id: number;
  category?: BlogCategory;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  featured_image_thumbnail: string | null;
  author: string;
  is_published: boolean;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  related?: BlogPost[];
}

// ---------- Review ----------
export interface Review {
  id: number;
  customer_name: string;
  rating: number;
  title: string;
  comment: string;
  vehicle: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface ReviewAggregate {
  average_rating: number;
  total_count: number;
  breakdown: Record<number, number>;
}

// ---------- Company Settings ----------
export interface CompanySettings {
  company_name: string;
  street: string;
  zip: string;
  city: string;
  phone: string;
  email: string;
  whatsapp: string | null;
  tax_id: string | null;
  trade_register: string | null;
  bank_name: string | null;
  iban: string | null;
  bic: string | null;
  imprint: Record<string, string>;
  privacy_policy: Record<string, string>;
  terms: Record<string, string>;
  meta_title: Record<string, string>;
  meta_description: Record<string, string>;
  opening_hours: Record<string, string>;
}

// ---------- API Response Wrappers ----------
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// ---------- Form Data ----------
export interface InquiryFormData {
  type: InquiryType;
  vehicle_id?: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  preferred_date?: string;
  preferred_time?: string;
  preferred_contact_method?: string;
  locale?: string;
  website_url?: string;
}

export interface TradeInFormData {
  vehicle_id?: number;
  name: string;
  email: string;
  phone: string;
  message?: string;
  trade_brand: string;
  trade_model: string;
  trade_year: number;
  trade_mileage: number;
  trade_condition: string;
  trade_description?: string;
  damage_description?: string;
  photos?: File[];
  preferred_contact_method?: string;
  locale?: string;
}

export interface ReservationFormData {
  vehicle_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  billing_street?: string;
  billing_city?: string;
  billing_postal_code?: string;
  billing_country?: string;
  locale?: string;
}

export interface ReviewFormData {
  customer_name: string;
  customer_email?: string;
  rating: number;
  title?: string;
  comment: string;
  vehicle_id?: number;
  locale?: string;
}

export interface NewsletterFormData {
  email: string;
  locale: string;
}

// ---------- Action Result ----------
export type ActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: unknown;
};
