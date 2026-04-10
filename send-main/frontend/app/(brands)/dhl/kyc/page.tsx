"use client";

import KycForm from "@/components/kyc/KycForm";
import { brandConfigs } from "@/lib/brandConfig";

export default function DhlKycPage() {
  const config = brandConfigs.dhl;

  return (
    <div>
      {/* DHL-style content with angular design */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2">
          <div
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            {/* DHL red top bar */}
            <div className="h-1.5" style={{ backgroundColor: "#D40511" }} />

            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-2 h-12"
                  style={{ backgroundColor: "#FFCC00" }}
                />
                <div>
                  <h2 className="text-lg font-black" style={{ color: "#333333" }}>
                    IDENTITY VERIFICATION
                  </h2>
                  <p className="text-xs" style={{ color: "#666666" }}>
                    Required for DHL Express account activation
                  </p>
                </div>
              </div>

              {/* DHL-style info alert */}
              <div
                className="p-4 mb-6 flex items-start gap-3"
                style={{
                  backgroundColor: "#FFFBEB",
                  borderLeft: "4px solid #FFCC00",
                }}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#CC9900" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs" style={{ color: "#333333" }}>
                  <strong>IMPORTANT:</strong> Please ensure all documents are valid and not expired.
                  Submissions with expired documents will be automatically rejected.
                  Processing typically takes 1-2 business days.
                </div>
              </div>

              <KycForm brandConfig={config} />
            </div>
          </div>
        </div>

        {/* Side panel — DHL angular style */}
        <div className="space-y-5">
          {/* Service level indicator */}
          <div
            style={{
              backgroundColor: "#FFCC00",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <div className="p-5">
              <h3
                className="text-sm font-black uppercase tracking-wide mb-2"
                style={{ color: "#D40511" }}
              >
                Express Service
              </h3>
              <p className="text-xs" style={{ color: "#333333" }}>
                Priority verification processing for express logistics partners.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold" style={{ color: "#333333" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                1-2 business days
              </div>
            </div>
          </div>

          {/* Required docs */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <div className="h-1" style={{ backgroundColor: "#D40511" }} />
            <div className="p-5">
              <h3
                className="text-sm font-black uppercase tracking-wide mb-3"
                style={{ color: "#333333" }}
              >
                Required Documents
              </h3>
              <ul className="space-y-3">
                {[
                  { icon: "🪪", label: "Government-issued photo ID" },
                  { icon: "📄", label: "Business registration (if applicable)" },
                  { icon: "📸", label: "Clear selfie photo" },
                  { icon: "🏠", label: "Proof of address" },
                ].map((doc) => (
                  <li key={doc.label} className="flex items-center gap-2.5 text-xs" style={{ color: "#333333" }}>
                    <span className="text-base">{doc.icon}</span>
                    {doc.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* DHL Contact — red block */}
          <div style={{ backgroundColor: "#D40511" }}>
            <div className="p-5 text-white">
              <h3 className="text-sm font-black uppercase tracking-wide mb-2">
                DHL Express Support
              </h3>
              <p className="text-xs opacity-90 mb-4">
                Available 24/7 for express logistics inquiries.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1-800-225-5345
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  express@dhl.com
                </div>
              </div>
              <button
                className="mt-4 w-full py-2 text-xs font-black uppercase tracking-wide"
                style={{
                  backgroundColor: "#FFCC00",
                  color: "#333333",
                }}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
