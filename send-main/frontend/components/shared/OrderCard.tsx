"use client";

import { BrandConfig } from "@/lib/brandConfig";
import { Order } from "@/types/kyc";

interface OrderCardProps {
  order: Order;
  brandConfig: BrandConfig;
}

export default function OrderCard({ order, brandConfig }: OrderCardProps) {
  const statusColors: Record<string, string> = {
    pending: "#9CA3AF",
    processing: brandConfig.primaryColor,
    verified: brandConfig.success,
    shipped: brandConfig.accent,
    delivered: brandConfig.success,
    cancelled: brandConfig.error,
    on_hold: "#F59E0B",
  };

  return (
    <div
      className="p-4 transition-all hover:translate-y-[-2px]"
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: brandConfig.buttonRadius === "0px" ? "0" : "8px",
        boxShadow: brandConfig.cardShadow,
        border: `1px solid ${brandConfig.border}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-mono font-bold" style={{ color: brandConfig.textPrimary }}>
          #{order.order_number}
        </span>
        <span
          className="px-2 py-1 text-xs font-bold uppercase"
          style={{
            backgroundColor: `${statusColors[order.status] || "#9CA3AF"}15`,
            color: statusColors[order.status] || "#9CA3AF",
            borderRadius: brandConfig.buttonRadius,
          }}
        >
          {order.status}
        </span>
      </div>

      <p className="text-sm font-medium" style={{ color: brandConfig.textPrimary }}>
        {order.customer_name}
      </p>
      <p className="text-xs" style={{ color: brandConfig.textSecondary }}>
        {order.customer_email}
      </p>

      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${brandConfig.border}` }}>
        <span className="text-lg font-bold" style={{ color: brandConfig.textPrimary }}>
          {new Intl.NumberFormat("en", { style: "currency", currency: order.currency }).format(order.amount)}
        </span>
        <span className="text-xs" style={{ color: brandConfig.textSecondary }}>
          {new Date(order.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
