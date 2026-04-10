"use client";

import { useState, FormEvent } from "react";
import { BrandConfig } from "@/lib/brandConfig";
import { KycFormData, DocumentType, KycVerification } from "@/types/kyc";
import { submitKyc } from "@/lib/api";
import DocumentUpload from "./DocumentUpload";
import StatusTracker from "./StatusTracker";

interface KycFormProps {
  brandConfig: BrandConfig;
}

type Step = "personal" | "address" | "documents" | "review" | "submitted";

export default function KycForm({ brandConfig }: KycFormProps) {
  const [step, setStep] = useState<Step>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedKyc, setSubmittedKyc] = useState<KycVerification | null>(null);

  const [formData, setFormData] = useState<Partial<KycFormData>>({
    brand_slug: brandConfig.slug,
    document_type: "id_card",
  });

  const updateField = (field: keyof KycFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitKyc(formData as KycFormData);
      setSubmittedKyc(result);
      setStep("submitted");
    } catch (err: any) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
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

  if (step === "submitted" && submittedKyc) {
    return (
      <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }}>
        <StatusTracker kyc={submittedKyc} brandConfig={brandConfig} />
      </div>
    );
  }

  const steps: { key: Step; label: string }[] = [
    { key: "personal", label: "Personal Info" },
    { key: "address", label: "Address" },
    { key: "documents", label: "Documents" },
    { key: "review", label: "Review" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }} className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 px-4">
        {steps.map((s, index) => (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  backgroundColor: index <= currentStepIndex ? brandConfig.primaryColor : "#E5E7EB",
                  color: index <= currentStepIndex ? brandConfig.headerText : "#9CA3AF",
                  borderRadius: brandConfig.buttonRadius === "0px" ? "4px" : "50%",
                }}
              >
                {index + 1}
              </div>
              <span
                className="text-xs mt-1 font-medium"
                style={{ color: index <= currentStepIndex ? brandConfig.textPrimary : brandConfig.textSecondary }}
              >
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className="h-0.5 w-12 sm:w-20 mx-2"
                style={{ backgroundColor: index < currentStepIndex ? brandConfig.primaryColor : "#E5E7EB" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div
        className="p-6 sm:p-8"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: brandConfig.buttonRadius === "0px" ? "0" : "12px",
          boxShadow: brandConfig.cardShadow,
          border: `1px solid ${brandConfig.border}`,
        }}
      >
        {error && (
          <div
            className="mb-6 p-4 text-sm"
            style={{
              backgroundColor: `${brandConfig.error}10`,
              color: brandConfig.error,
              borderRadius: brandConfig.buttonRadius,
              border: `1px solid ${brandConfig.error}30`,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Info */}
          {step === "personal" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold mb-6" style={{ color: brandConfig.textPrimary }}>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  value={formData.first_name || ""}
                  onChange={(v) => updateField("first_name", v)}
                  required
                  brand={brandConfig}
                />
                <InputField
                  label="Last Name"
                  value={formData.last_name || ""}
                  onChange={(v) => updateField("last_name", v)}
                  required
                  brand={brandConfig}
                />
              </div>
              <InputField
                label="Email Address"
                type="email"
                value={formData.email || ""}
                onChange={(v) => updateField("email", v)}
                required
                brand={brandConfig}
              />
              <InputField
                label="Phone Number"
                type="tel"
                value={formData.phone || ""}
                onChange={(v) => updateField("phone", v)}
                brand={brandConfig}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Date of Birth"
                  type="date"
                  value={formData.date_of_birth || ""}
                  onChange={(v) => updateField("date_of_birth", v)}
                  brand={brandConfig}
                />
                <InputField
                  label="Nationality"
                  value={formData.nationality || ""}
                  onChange={(v) => updateField("nationality", v)}
                  brand={brandConfig}
                />
              </div>
              <NavigationButtons
                brand={brandConfig}
                onNext={() => setStep("address")}
                showBack={false}
              />
            </div>
          )}

          {/* Step 2: Address */}
          {step === "address" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold mb-6" style={{ color: brandConfig.textPrimary }}>
                Address Details
              </h2>
              <InputField
                label="Address Line 1"
                value={formData.address_line_1 || ""}
                onChange={(v) => updateField("address_line_1", v)}
                brand={brandConfig}
              />
              <InputField
                label="Address Line 2"
                value={formData.address_line_2 || ""}
                onChange={(v) => updateField("address_line_2", v)}
                brand={brandConfig}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="City"
                  value={formData.city || ""}
                  onChange={(v) => updateField("city", v)}
                  brand={brandConfig}
                />
                <InputField
                  label="State / Province"
                  value={formData.state || ""}
                  onChange={(v) => updateField("state", v)}
                  brand={brandConfig}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Postal Code"
                  value={formData.postal_code || ""}
                  onChange={(v) => updateField("postal_code", v)}
                  brand={brandConfig}
                />
                <InputField
                  label="Country"
                  value={formData.country || ""}
                  onChange={(v) => updateField("country", v)}
                  brand={brandConfig}
                />
              </div>
              <NavigationButtons
                brand={brandConfig}
                onBack={() => setStep("personal")}
                onNext={() => setStep("documents")}
              />
            </div>
          )}

          {/* Step 3: Documents */}
          {step === "documents" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold mb-6" style={{ color: brandConfig.textPrimary }}>
                Identity Documents
              </h2>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: brandConfig.textPrimary }}
                >
                  Document Type
                </label>
                <select
                  value={formData.document_type || "id_card"}
                  onChange={(e) => updateField("document_type", e.target.value as DocumentType)}
                  className="w-full px-4 py-3 text-sm outline-none transition-all"
                  style={{
                    border: `1px solid ${brandConfig.inputBorder}`,
                    borderRadius: brandConfig.buttonRadius,
                    color: brandConfig.textPrimary,
                    backgroundColor: brandConfig.inputBg,
                  }}
                >
                  <option value="id_card">ID Card</option>
                  <option value="passport">Passport</option>
                  <option value="driving_license">Driving License</option>
                </select>
              </div>
              <InputField
                label="Document Number"
                value={formData.document_number || ""}
                onChange={(v) => updateField("document_number", v)}
                brand={brandConfig}
              />
              <DocumentUpload
                label="Document Front"
                onFileSelect={(f) => updateField("document_front", f)}
                brandConfig={brandConfig}
                required
              />
              <DocumentUpload
                label="Document Back"
                onFileSelect={(f) => updateField("document_back", f)}
                brandConfig={brandConfig}
              />
              <DocumentUpload
                label="Selfie with Document"
                onFileSelect={(f) => updateField("selfie", f)}
                brandConfig={brandConfig}
              />
              <NavigationButtons
                brand={brandConfig}
                onBack={() => setStep("address")}
                onNext={() => setStep("review")}
              />
            </div>
          )}

          {/* Step 4: Review */}
          {step === "review" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold mb-6" style={{ color: brandConfig.textPrimary }}>
                Review & Submit
              </h2>
              <ReviewSection title="Personal Information" brand={brandConfig}>
                <ReviewItem label="Name" value={`${formData.first_name || ""} ${formData.last_name || ""}`} brand={brandConfig} />
                <ReviewItem label="Email" value={formData.email || ""} brand={brandConfig} />
                <ReviewItem label="Phone" value={formData.phone || "—"} brand={brandConfig} />
                <ReviewItem label="Date of Birth" value={formData.date_of_birth || "—"} brand={brandConfig} />
              </ReviewSection>
              <ReviewSection title="Address" brand={brandConfig}>
                <ReviewItem label="Address" value={formData.address_line_1 || "—"} brand={brandConfig} />
                <ReviewItem label="City" value={`${formData.city || ""}, ${formData.postal_code || ""}`} brand={brandConfig} />
                <ReviewItem label="Country" value={formData.country || "—"} brand={brandConfig} />
              </ReviewSection>
              <ReviewSection title="Documents" brand={brandConfig}>
                <ReviewItem label="Type" value={formData.document_type?.replace("_", " ") || "—"} brand={brandConfig} />
                <ReviewItem label="Number" value={formData.document_number || "—"} brand={brandConfig} />
                <ReviewItem label="Front" value={formData.document_front?.name || "Not uploaded"} brand={brandConfig} />
                <ReviewItem label="Back" value={formData.document_back?.name || "Not uploaded"} brand={brandConfig} />
                <ReviewItem label="Selfie" value={formData.selfie?.name || "Not uploaded"} brand={brandConfig} />
              </ReviewSection>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep("documents")}
                  className="flex-1 px-6 py-3 text-sm font-semibold transition-all"
                  style={{
                    border: `2px solid ${brandConfig.border}`,
                    borderRadius: brandConfig.buttonRadius,
                    color: brandConfig.textPrimary,
                    backgroundColor: "transparent",
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 text-sm font-bold transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: brandConfig.primaryColor,
                    color: brandConfig.headerText,
                    borderRadius: brandConfig.buttonRadius,
                    border: "none",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Verification"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// Reusable branded input
function InputField({
  label,
  type = "text",
  value,
  onChange,
  required,
  brand,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  brand: BrandConfig;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: brand.textPrimary }}>
        {label} {required && <span style={{ color: brand.error }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 text-sm outline-none transition-all"
        style={{
          border: `1px solid ${brand.inputBorder}`,
          borderRadius: brand.buttonRadius,
          color: brand.textPrimary,
          backgroundColor: brand.inputBg,
        }}
        onFocus={(e) => (e.target.style.borderColor = brand.inputFocus)}
        onBlur={(e) => (e.target.style.borderColor = brand.inputBorder)}
      />
    </div>
  );
}

// Navigation buttons
function NavigationButtons({
  brand,
  onBack,
  onNext,
  showBack = true,
}: {
  brand: BrandConfig;
  onBack?: () => void;
  onNext?: () => void;
  showBack?: boolean;
}) {
  return (
    <div className="flex gap-3 pt-4">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-6 py-3 text-sm font-semibold transition-all"
          style={{
            border: `2px solid ${brand.border}`,
            borderRadius: brand.buttonRadius,
            color: brand.textPrimary,
            backgroundColor: "transparent",
          }}
        >
          Back
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          className="flex-1 px-6 py-3 text-sm font-bold transition-all"
          style={{
            backgroundColor: brand.primaryColor,
            color: brand.headerText,
            borderRadius: brand.buttonRadius,
            border: "none",
          }}
        >
          Continue
        </button>
      )}
    </div>
  );
}

// Review section
function ReviewSection({
  title,
  brand,
  children,
}: {
  title: string;
  brand: BrandConfig;
  children: React.ReactNode;
}) {
  return (
    <div
      className="p-4"
      style={{
        backgroundColor: brand.bgLight,
        borderRadius: brand.buttonRadius,
        border: `1px solid ${brand.border}`,
      }}
    >
      <h3 className="text-sm font-bold mb-3" style={{ color: brand.textPrimary }}>
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewItem({
  label,
  value,
  brand,
}: {
  label: string;
  value: string;
  brand: BrandConfig;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span style={{ color: brand.textSecondary }}>{label}</span>
      <span className="font-medium" style={{ color: brand.textPrimary }}>
        {value}
      </span>
    </div>
  );
}
