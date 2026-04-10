import { z } from 'zod';

/* ============================================
   Shared Schema Parts
   ============================================ */

const nameField = z.string().min(2, 'Mindestens 2 Zeichen').max(100);
const emailField = z.string().email('Ungültige E-Mail-Adresse');
const phoneField = z.string().min(6, 'Ungültige Telefonnummer').max(20).optional().or(z.literal(''));
const phoneRequiredField = z.string().min(6, 'Ungültige Telefonnummer').max(20);
const messageField = z.string().min(10, 'Mindestens 10 Zeichen').max(5000);
const privacyField = z.literal(true, {
  errorMap: () => ({ message: 'Bitte akzeptieren Sie die Datenschutzerklärung' }),
});

/* ============================================
   Inquiry Schema (matches backend InquiryController@store)
   ============================================ */

export const inquirySchema = z.object({
  type: z.enum(['general', 'test_drive', 'price_inquiry', 'financing', 'trade_in']),
  vehicle_id: z.number().optional(),
  name: nameField,
  email: emailField,
  phone: phoneField,
  message: messageField,
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional(),
  preferred_contact_method: z.enum(['email', 'phone', 'whatsapp']).optional(),
  locale: z.string().max(5).optional(),
  privacy_accepted: privacyField,
  website_url: z.string().max(0).optional(),
});

export type InquirySchemaType = z.infer<typeof inquirySchema>;

/* ============================================
   Trade-In Schema (matches backend InquiryController@storeTradeIn)
   ============================================ */

export const tradeInSchema = z.object({
  vehicle_id: z.number().optional(),
  name: nameField,
  email: emailField,
  phone: phoneRequiredField,
  trade_brand: z.string().min(1, 'Pflichtfeld'),
  trade_model: z.string().min(1, 'Pflichtfeld'),
  trade_year: z.number().min(1960).max(new Date().getFullYear() + 1),
  trade_mileage: z.number().min(0),
  trade_condition: z.enum(['excellent', 'good', 'fair', 'poor']),
  trade_description: z.string().max(5000).optional(),
  damage_description: z.string().max(5000).optional(),
  preferred_contact_method: z.enum(['email', 'phone', 'whatsapp']).optional(),
  locale: z.string().max(5).optional(),
  privacy_accepted: privacyField,
});

export type TradeInSchemaType = z.infer<typeof tradeInSchema>;

/* ============================================
   Reservation Schema (matches backend ReservationController@store)
   ============================================ */

export const reservationSchema = z.object({
  vehicle_id: z.number(),
  customer_name: nameField,
  customer_email: emailField,
  customer_phone: phoneRequiredField,
  billing_street: z.string().max(255).optional(),
  billing_city: z.string().max(255).optional(),
  billing_postal_code: z.string().max(20).optional(),
  billing_country: z.string().max(5).optional(),
  locale: z.string().max(5).optional(),
  privacy_accepted: privacyField,
});

export type ReservationSchemaType = z.infer<typeof reservationSchema>;

/* ============================================
   Review Schema (matches backend ReviewController@store)
   ============================================ */

export const reviewSchema = z.object({
  customer_name: nameField,
  customer_email: emailField.optional().or(z.literal('')),
  rating: z.number().min(1, 'Bewertung erforderlich').max(5),
  title: z.string().max(255).optional(),
  comment: z.string().min(20, 'Mindestens 20 Zeichen').max(500),
  vehicle_id: z.number().optional(),
  locale: z.string().max(5).optional(),
  privacy_accepted: privacyField,
});

export type ReviewSchemaType = z.infer<typeof reviewSchema>;

/* ============================================
   Newsletter Schema (matches backend SettingsController@subscribeNewsletter)
   ============================================ */

export const newsletterSchema = z.object({
  email: emailField,
  locale: z.string().default('de'),
  privacy_accepted: privacyField,
});

export type NewsletterSchemaType = z.infer<typeof newsletterSchema>;

/* ============================================
   Contact / General Inquiry Schema (simplified frontend-only)
   ============================================ */

export const contactSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  message: messageField,
  privacy_accepted: privacyField,
  website_url: z.string().max(0).optional(),
});

export type ContactSchemaType = z.infer<typeof contactSchema>;

/* ============================================
   Vehicle Filter Schema
   ============================================ */

export const vehicleFilterSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  fuel_type: z.enum(['petrol', 'diesel', 'electric', 'hybrid', 'plug_in_hybrid', 'hydrogen', 'lpg', 'cng']).optional(),
  transmission: z.enum(['automatic', 'manual', 'semi_automatic']).optional(),
  body_type: z.enum(['sedan', 'suv', 'coupe', 'cabrio', 'kombi', 'hatchback', 'van', 'pickup', 'roadster', 'limousine', 'other']).optional(),
  condition: z.enum(['new', 'used', 'demonstration', 'classic']).optional(),
  price_min: z.number().min(0).optional(),
  price_max: z.number().min(0).optional(),
  year_min: z.number().min(1900).optional(),
  year_max: z.number().optional(),
  mileage_max: z.number().min(0).optional(),
  power_min: z.number().min(0).optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export type VehicleFilterSchemaType = z.infer<typeof vehicleFilterSchema>;
