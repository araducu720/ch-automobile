"use client";

import { useEffect, useState } from "react";
import { BrandConfig } from "@/lib/brandConfig";
import { KycVerification, KycStatus } from "@/types/kyc";
import { getKycStatus } from "@/lib/api";

interface StatusTrackerProps {
  kyc: KycVerification;
  brandConfig: BrandConfig;
}

const statusSteps: { key: KycStatus; label: string; icon: string }[] = [
  { key: "pending", label: "Submitted", icon: "📄" },
  { key: "documents_uploaded", label: "Documents Received", icon: "📎" },
  { key: "in_review", label: "Under Review", icon: "🔍" },
  { key: "approved", label: "Verified", icon: "✅" },
];

export default function StatusTracker({ kyc: initialKyc, brandConfig }: StatusTrackerProps) {
  const [kyc, setKyc] = useState(initialKyc);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      try {
        const updated = await getKycStatus(kyc.uuid);
        setKyc(updated);

        if (updated.status === "approved" || updated.status === "rejected") {
          setPolling(false);
        }
      } catch {
        // silently ignore polling errors
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [kyc.uuid, polling]);

  const currentIndex = statusSteps.findIndex((s) => s.key === kyc.status);
  const isRejected = kyc.status === "rejected";

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="p-8 text-center"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: brandConfig.buttonRadius === "0px" ? "0" : "12px",
          boxShadow: brandConfig.cardShadow,
          border: `1px solid ${brandConfig.border}`,
        }}
      >
        {/* Header */}
        <div
          className="w-20 h-20 mx-auto mb-4 flex items-center justify-center text-3xl"
          style={{
            backgroundColor: isRejected
              ? `${brandConfig.error}15`
              : kyc.status === "approved"
              ? `${brandConfig.success}15`
              : `${brandConfig.primaryColor}15`,
            borderRadius: brandConfig.buttonRadius === "0px" ? "8px" : "50%",
          }}
        >
          {isRejected ? "❌" : kyc.status === "approved" ? "✅" : "⏳"}
        </div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: brandConfig.textPrimary }}>
          {isRejected
            ? "Verification Rejected"
            : kyc.status === "approved"
            ? "Identity Verified!"
            : "Verification In Progress"}
        </h2>

        <p className="text-sm mb-1" style={{ color: brandConfig.textSecondary }}>
          Reference: <span className="font-mono font-bold">{kyc.uuid.slice(0, 8).toUpperCase()}</span>
        </p>

        {/* Rejected reason */}
        {isRejected && kyc.rejection_reason && (
          <div
            className="mt-4 p-4 text-left text-sm"
            style={{
              backgroundColor: `${brandConfig.error}08`,
              border: `1px solid ${brandConfig.error}30`,
              borderRadius: brandConfig.buttonRadius,
              color: brandConfig.error,
            }}
          >
            <strong>Reason:</strong> {kyc.rejection_reason}
          </div>
        )}

        {/* Progress steps */}
        {!isRejected && (
          <div className="mt-8 space-y-0">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={step.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 flex items-center justify-center text-lg transition-all"
                      style={{
                        backgroundColor: isCompleted ? brandConfig.primaryColor : "#F3F4F6",
                        color: isCompleted ? "#FFFFFF" : "#9CA3AF",
                        borderRadius: "50%",
                        border: isCurrent ? `3px solid ${brandConfig.accent}` : "none",
                      }}
                    >
                      {step.icon}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className="w-0.5 h-8"
                        style={{
                          backgroundColor: index < currentIndex ? brandConfig.primaryColor : "#E5E7EB",
                        }}
                      />
                    )}
                  </div>
                  <div className="ml-4 text-left">
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: isCompleted ? brandConfig.textPrimary : brandConfig.textSecondary,
                      }}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs" style={{ color: brandConfig.primaryColor }}>
                        {polling && "Processing..."}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Confidence Score */}
        {kyc.confidence_score !== null && (
          <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${brandConfig.border}` }}>
            <p className="text-xs" style={{ color: brandConfig.textSecondary }}>
              Confidence Score
            </p>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-1000"
                style={{
                  width: `${kyc.confidence_score}%`,
                  backgroundColor:
                    kyc.confidence_score >= 80
                      ? brandConfig.success
                      : kyc.confidence_score >= 50
                      ? brandConfig.accent
                      : brandConfig.error,
                  borderRadius: "9999px",
                }}
              />
            </div>
            <p className="text-sm font-bold mt-1" style={{ color: brandConfig.textPrimary }}>
              {kyc.confidence_score}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
