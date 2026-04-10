'use server';

import { getTranslations } from 'next-intl/server';
import { submitInquiry, submitTradeIn, submitReview as apiSubmitReview, createReservation, subscribeNewsletter, confirmInvoice as apiConfirmInvoice, uploadSignature as apiUploadSignature, uploadPaymentProof as apiUploadPaymentProof, uploadSignedContract as apiUploadSignedContract } from '@/lib/api';
import { inquirySchema, tradeInSchema, reviewSchema, reservationSchema, newsletterSchema } from '@/lib/validations';
import type { InquiryFormData, TradeInFormData, ReviewFormData, ReservationFormData, NewsletterFormData } from '@/types';

export type ActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: unknown;
};

/* ---------- Contact / Inquiry ---------- */
export async function submitContactAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const tv = await getTranslations('validation');
  const ta = await getTranslations('actions');

  // Honeypot check
  if (raw.website_url) {
    return { success: true, message: ta('contactSuccess') };
  }

  const parsed = inquirySchema.safeParse({
    ...raw,
    type: raw.type || 'general',
    vehicle_id: raw.vehicle_id ? Number(raw.vehicle_id) : undefined,
    privacy_accepted: raw.privacy_accepted === 'true',
  });

  if (!parsed.success) {
    return {
      success: false,
      message: tv('checkInputs'),
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const { privacy_accepted, website_url, ...submitData } = parsed.data;
    await submitInquiry(submitData as InquiryFormData);
    return {
      success: true,
      message: ta('contactSuccess'),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : tv('genericError');
    return { success: false, message };
  }
}

/* ---------- Trade-In ---------- */
export async function submitTradeInAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const tv = await getTranslations('validation');
  const ta = await getTranslations('actions');

  const parsed = tradeInSchema.safeParse({
    ...raw,
    vehicle_id: raw.vehicle_id ? Number(raw.vehicle_id) : undefined,
    trade_year: Number(raw.trade_year),
    trade_mileage: Number(raw.trade_mileage),
    privacy_accepted: raw.privacy_accepted === 'true',
  });

  if (!parsed.success) {
    return {
      success: false,
      message: tv('checkInputs'),
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    // Collect photos if any
    const photos = formData.getAll('photos') as File[];
    const { privacy_accepted, ...submitData } = parsed.data;
    const dataWithPhotos: TradeInFormData = {
      ...submitData,
      photos: photos.filter((f) => f.size > 0),
    };
    await submitTradeIn(dataWithPhotos);
    return {
      success: true,
      message: ta('tradeInSuccess'),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : tv('genericError');
    return { success: false, message };
  }
}

/* ---------- Reservation ---------- */
export async function submitReservationAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const tv = await getTranslations('validation');
  const ta = await getTranslations('actions');

  const parsed = reservationSchema.safeParse({
    ...raw,
    vehicle_id: Number(raw.vehicle_id),
    privacy_accepted: raw.privacy_accepted === 'true',
  });

  if (!parsed.success) {
    return {
      success: false,
      message: tv('checkInputs'),
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const { privacy_accepted, ...submitData } = parsed.data;
    const result = await createReservation(submitData as ReservationFormData);
    return {
      success: true,
      message: ta('reservationSuccess'),
      data: result.data,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : tv('genericError');
    return { success: false, message };
  }
}

/* ---------- Review ---------- */
export async function submitReviewAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const tv = await getTranslations('validation');
  const ta = await getTranslations('actions');

  const parsed = reviewSchema.safeParse({
    ...raw,
    rating: Number(raw.rating),
    privacy_accepted: raw.privacy_accepted === 'true',
  });

  if (!parsed.success) {
    return {
      success: false,
      message: tv('checkInputs'),
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const { privacy_accepted, ...submitData } = parsed.data;
    await apiSubmitReview(submitData as ReviewFormData);
    return {
      success: true,
      message: ta('reviewSuccess'),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : tv('genericError');
    return { success: false, message };
  }
}

/* ---------- Newsletter ---------- */
export async function submitNewsletterAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const tv = await getTranslations('validation');
  const ta = await getTranslations('actions');

  const parsed = newsletterSchema.safeParse({
    ...raw,
    privacy_accepted: raw.privacy_accepted === 'true',
  });

  if (!parsed.success) {
    return {
      success: false,
      message: tv('checkInputs'),
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const { privacy_accepted, ...submitData } = parsed.data;
    await subscribeNewsletter(submitData as NewsletterFormData);
    return {
      success: true,
      message: ta('newsletterSuccess'),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : tv('genericError');
    return { success: false, message };
  }
}

/* ---------- Purchase Wizard: Confirm Invoice ---------- */
export async function confirmInvoiceAction(reference: string): Promise<ActionResult> {
  try {
    await apiConfirmInvoice(reference);
    return { success: true, message: 'Invoice confirmed.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred.';
    return { success: false, message };
  }
}

/* ---------- Purchase Wizard: Upload Signature ---------- */
export async function uploadSignatureAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const reference = formData.get('reference') as string;
  const file = formData.get('signature') as File;

  if (!reference || !file || file.size === 0) {
    return { success: false, message: 'Bitte laden Sie eine Unterschrift hoch.' };
  }

  try {
    await apiUploadSignature(reference, file);
    return { success: true, message: 'Unterschrift hochgeladen.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fehler beim Hochladen.';
    return { success: false, message };
  }
}

/* ---------- Purchase Wizard: Upload Signed Contract ---------- */
export async function uploadSignedContractAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const reference = formData.get('reference') as string;
  const file = formData.get('signed_contract') as File;

  if (!reference || !file || file.size === 0) {
    return { success: false, message: 'Bitte laden Sie den unterschriebenen Vertrag hoch.' };
  }

  try {
    await apiUploadSignedContract(reference, file);
    return { success: true, message: 'Unterschriebener Vertrag hochgeladen.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fehler beim Hochladen.';
    return { success: false, message };
  }
}

/* ---------- Purchase Wizard: Upload Payment Proof ---------- */
export async function uploadPaymentProofAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const reference = formData.get('reference') as string;
  const file = formData.get('payment_proof') as File;

  if (!reference || !file || file.size === 0) {
    return { success: false, message: 'Bitte laden Sie einen Zahlungsnachweis hoch.' };
  }

  try {
    await apiUploadPaymentProof(reference, file);
    return { success: true, message: 'Zahlungsnachweis hochgeladen.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fehler beim Hochladen.';
    return { success: false, message };
  }
}