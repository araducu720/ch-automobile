"use client";

import { useState, useEffect } from "react";
import { BrandConfig } from "@/lib/brandConfig";
import { KycStatusEvent } from "@/types/kyc";

interface LiveNotificationProps {
  brandConfig: BrandConfig;
  events: KycStatusEvent[];
}

export default function LiveNotification({ brandConfig, events }: LiveNotificationProps) {
  const [visible, setVisible] = useState<KycStatusEvent[]>([]);

  useEffect(() => {
    if (events.length > 0) {
      const latest = events[events.length - 1];
      setVisible((prev) => [...prev, latest]);

      const timeout = setTimeout(() => {
        setVisible((prev) => prev.filter((e) => e.uuid !== latest.uuid));
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [events]);

  if (visible.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visible.map((event) => (
        <div
          key={event.uuid}
          className="p-4 max-w-sm animate-slide-in"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: brandConfig.buttonRadius === "0px" ? "4px" : "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            borderLeft: `4px solid ${
              event.status === "approved"
                ? brandConfig.success
                : event.status === "rejected"
                ? brandConfig.error
                : brandConfig.primaryColor
            }`,
          }}
        >
          <p className="text-sm font-bold" style={{ color: brandConfig.textPrimary }}>
            KYC {event.status.replace("_", " ").toUpperCase()}
          </p>
          <p className="text-xs mt-1" style={{ color: brandConfig.textSecondary }}>
            {event.full_name} — {event.email}
          </p>
        </div>
      ))}
    </div>
  );
}
