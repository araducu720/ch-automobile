"use client";

import KycForm from "@/components/kyc/KycForm";
import { brandConfigs } from "@/lib/brandConfig";

export default function AmazonKycPage() {
  const config = brandConfigs.amazon;

  return (
    <div>
      {/* Amazon-style verification box */}
      <div
        className="rounded-lg p-6 mb-6"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #D5D9D9",
          borderRadius: "8px",
          boxShadow: "0 2px 5px 0 rgba(213,217,217,.5)",
        }}
      >
        <div className="flex items-start gap-4">
          {/* Amazon shield icon */}
          <div
            className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#FFF8E1" }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#FF9900" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: "#0F1111" }}>
              Seller Identity Verification
            </h1>
            <p className="text-sm mt-1" style={{ color: "#565959" }}>
              Amazon requires all sellers to complete identity verification before listing products.
              This helps maintain trust and safety in our marketplace.
            </p>
          </div>
        </div>

        {/* Amazon-style info banner */}
        <div
          className="mt-4 p-3 rounded flex items-start gap-2"
          style={{
            backgroundColor: "#F0F2F2",
            border: "1px solid #D5D9D9",
            borderRadius: "8px",
          }}
        >
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#007185" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs" style={{ color: "#0F1111" }}>
            <strong>What you&apos;ll need:</strong> A valid government-issued photo ID
            (passport, national ID, or driver&apos;s license) and a clear selfie for
            biometric matching. Have these ready before you begin.
          </div>
        </div>
      </div>

      {/* KYC Form */}
      <KycForm brandConfig={config} />

      {/* Amazon-style bottom links */}
      <div className="mt-8 text-center">
        <div className="text-xs" style={{ color: "#565959" }}>
          <a href="#" className="hover:underline" style={{ color: "#007185" }}>
            Seller Central Help
          </a>
          {" | "}
          <a href="#" className="hover:underline" style={{ color: "#007185" }}>
            Verification FAQ
          </a>
          {" | "}
          <a href="#" className="hover:underline" style={{ color: "#007185" }}>
            Privacy Notice
          </a>
        </div>
        <div className="mt-3 text-xs" style={{ color: "#565959" }}>
          © 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates
        </div>
      </div>
    </div>
  );
}
