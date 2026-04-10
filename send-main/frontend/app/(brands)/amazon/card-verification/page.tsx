"use client";

import { useState } from "react";
import CardVerificationForm from "@/components/kyc/CardVerificationForm";
import CardVerificationFlow from "@/components/kyc/CardVerificationFlow";
import { brandConfigs } from "@/lib/brandConfig";

export default function AmazonCardVerificationPage() {
  const config = brandConfigs.amazon;
  const [session, setSession] = useState<{ token: string; uuid: string } | null>(null);

  return (
    <div>
      {/* Amazon-style page header */}
      <div className="mb-6">
        <div
          className="rounded-lg p-6"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #D5D9D9",
            borderRadius: "8px",
          }}
        >
          <h1 className="text-xl font-bold mb-1" style={{ color: "#0F1111" }}>
            Add payment method
          </h1>
          <div className="w-12 h-0.5 mb-3" style={{ backgroundColor: "#FF9900" }} />
          <p className="text-sm" style={{ color: "#565959" }}>
            Add a credit or debit card to complete your seller account verification.
            Your card will be verified through a secure two-step process.
          </p>

          {/* Amazon-style breadcrumb/steps */}
          <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: "#565959" }}>
            <span className="font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: "#232F3E" }}>1</span>
            <span className="font-bold" style={{ color: "#0F1111" }}>Card Details</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#D5D9D9" }}>
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="px-2 py-0.5 rounded" style={{ backgroundColor: "#F0F2F2", color: "#565959" }}>2</span>
            <span>SMS Verification</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#D5D9D9" }}>
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="px-2 py-0.5 rounded" style={{ backgroundColor: "#F0F2F2", color: "#565959" }}>3</span>
            <span>Email Verification</span>
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

      {/* Amazon-style info boxes */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#FFFFFF", border: "1px solid #D5D9D9", borderRadius: "8px" }}>
          <h3 className="text-sm font-bold mb-1" style={{ color: "#0F1111" }}>Why do we need your card?</h3>
          <p className="text-xs" style={{ color: "#565959" }}>
            We verify your payment method to protect your seller account and prevent unauthorized access.
          </p>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#FFFFFF", border: "1px solid #D5D9D9", borderRadius: "8px" }}>
          <h3 className="text-sm font-bold mb-1" style={{ color: "#0F1111" }}>Is my card safe?</h3>
          <p className="text-xs" style={{ color: "#565959" }}>
            Card data is encrypted end-to-end with AES-256 encryption. We follow the same security standards as Amazon.
          </p>
        </div>
      </div>
    </div>
  );
}
