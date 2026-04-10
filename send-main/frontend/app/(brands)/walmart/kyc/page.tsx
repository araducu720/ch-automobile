"use client";

import KycForm from "@/components/kyc/KycForm";
import { brandConfigs } from "@/lib/brandConfig";

export default function WalmartKycPage() {
  const config = brandConfigs.walmart;

  return (
    <div>
      {/* Walmart-style page header */}
      <div className="mb-6">
        <div
          className="rounded-lg p-6"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E6E7E8",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#E3F2FD" }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#0071CE" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "#2E2F32" }}>
                Marketplace Seller Verification
              </h1>
              <p className="text-sm mt-1" style={{ color: "#6D6E71" }}>
                To sell on Walmart Marketplace, we need to verify your identity. This process
                typically takes less than 5 minutes.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#2A8703" }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure & encrypted
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#2A8703" }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  GDPR compliant
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#2A8703" }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ~5 min process
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Form */}
      <KycForm brandConfig={config} />

      {/* Walmart-style help section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E6E7E8" }}>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#0071CE" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-bold" style={{ color: "#2E2F32" }}>Quick Process</span>
          </div>
          <p className="text-xs" style={{ color: "#6D6E71" }}>
            Most verifications are completed within minutes. You&apos;ll receive an email confirmation.
          </p>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E6E7E8" }}>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#0071CE" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm font-bold" style={{ color: "#2E2F32" }}>Data Security</span>
          </div>
          <p className="text-xs" style={{ color: "#6D6E71" }}>
            All data is encrypted and stored securely. We follow strict privacy guidelines.
          </p>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E6E7E8" }}>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#0071CE" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-sm font-bold" style={{ color: "#2E2F32" }}>Need Help?</span>
          </div>
          <p className="text-xs" style={{ color: "#6D6E71" }}>
            Contact Seller Support at 1-800-Walmart or visit the Help Center.
          </p>
        </div>
      </div>
    </div>
  );
}
