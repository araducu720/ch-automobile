"use client";

import KycForm from "@/components/kyc/KycForm";
import { brandConfigs } from "@/lib/brandConfig";

export default function DpdKycPage() {
  const config = brandConfigs.dpd;

  return (
    <div>
      {/* DPD-style verification card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main card */}
        <div className="lg:col-span-2">
          <div
            className="rounded-lg overflow-hidden"
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            {/* Red top bar — DPD style accent */}
            <div className="h-1" style={{ backgroundColor: "#DC0032" }} />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#FDE8ED" }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#DC0032" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "#414042" }}>
                    Courier Verification
                  </h2>
                  <p className="text-xs" style={{ color: "#6D6E71" }}>
                    Required for all DPD delivery partners
                  </p>
                </div>
              </div>
              <KycForm brandConfig={config} />
            </div>
          </div>
        </div>

        {/* Side panel — DPD style */}
        <div className="space-y-4">
          {/* Requirements */}
          <div
            className="rounded-lg p-5"
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h3 className="text-sm font-bold mb-3" style={{ color: "#414042" }}>
              Requirements
            </h3>
            <ul className="space-y-2.5">
              {[
                "Valid photo ID (passport or national ID)",
                "Proof of address (utility bill, max 3 months)",
                "Clear selfie for facial recognition",
                "Valid driver's license (for driving roles)",
              ].map((req) => (
                <li key={req} className="flex items-start gap-2 text-xs" style={{ color: "#6D6E71" }}>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#DC0032" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                  </svg>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Status timeline */}
          <div
            className="rounded-lg p-5"
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h3 className="text-sm font-bold mb-3" style={{ color: "#414042" }}>
              Verification Process
            </h3>
            <div className="space-y-4">
              {[
                { step: "1", label: "Submit Documents", desc: "Upload required documentation" },
                { step: "2", label: "AI Review", desc: "Automatic document analysis" },
                { step: "3", label: "Verification", desc: "Manual review if needed" },
                { step: "4", label: "Approved", desc: "Start delivering with DPD" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                    style={{ backgroundColor: "#DC0032" }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: "#414042" }}>
                      {item.label}
                    </div>
                    <div className="text-xs" style={{ color: "#6D6E71" }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div
            className="rounded-lg p-5"
            style={{
              backgroundColor: "#DC0032",
              color: "#FFFFFF",
            }}
          >
            <h3 className="text-sm font-bold mb-2">Need Help?</h3>
            <p className="text-xs opacity-90 mb-3">
              Our support team is available Monday-Friday, 8am-6pm.
            </p>
            <a
              href="#"
              className="inline-block text-xs font-bold px-4 py-2 rounded"
              style={{ backgroundColor: "#FFFFFF", color: "#DC0032" }}
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
