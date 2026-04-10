"use client";

import { useState, useEffect } from "react";
import { brandConfigs } from "@/lib/brandConfig";
import { Order } from "@/types/kyc";
import { getOrders } from "@/lib/api";
import OrderCard from "@/components/shared/OrderCard";

export default function DhlOrdersPage() {
  const config = brandConfigs.dhl;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders("dhl");
        setOrders(data);
      } catch {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      {/* DHL Express Orders Header — angular design */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
        className="mb-6"
      >
        <div className="h-1.5" style={{ backgroundColor: "#D40511" }} />
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10" style={{ backgroundColor: "#FFCC00" }} />
              <div>
                <h1 className="text-lg font-black uppercase tracking-wide" style={{ color: "#333333" }}>
                  Shipment Tracking
                </h1>
                <p className="text-xs mt-0.5" style={{ color: "#666666" }}>
                  DHL Express worldwide shipments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5" style={{ backgroundColor: "#FFCC00" }}>
              <div className="live-dot" style={{ backgroundColor: "#D40511" }} />
              <span className="text-xs font-black uppercase" style={{ color: "#333333" }}>Live</span>
            </div>
          </div>

          {/* DHL tracking search */}
          <div className="mt-4 flex gap-0">
            <input
              type="text"
              placeholder="Enter DHL Express tracking number..."
              className="flex-1 px-4 py-3 text-sm outline-none border"
              style={{
                borderColor: "#999999",
                color: "#333333",
              }}
            />
            <button
              className="px-8 py-3 text-sm font-black uppercase tracking-wide text-white"
              style={{ backgroundColor: "#D40511" }}
            >
              Track
            </button>
          </div>
        </div>
      </div>

      {/* Status filter tabs — DHL style */}
      <div className="flex gap-0 mb-6 overflow-x-auto">
        {["All Shipments", "In Transit", "Out for Delivery", "Delivered", "Exception"].map((tab, i) => (
          <button
            key={tab}
            className="px-5 py-2.5 text-xs font-bold whitespace-nowrap uppercase tracking-wide"
            style={{
              backgroundColor: i === 0 ? "#D40511" : "#FFFFFF",
              color: i === 0 ? "#FFFFFF" : "#333333",
              border: i === 0 ? "none" : "1px solid #E0D5B3",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Shipments */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="kyc-spinner" />
        </div>
      ) : orders.length === 0 ? (
        <div
          className="text-center py-16"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#FFFBEB" }}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#CC9900" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-base font-black uppercase" style={{ color: "#333333" }}>
            No Shipments
          </h3>
          <p className="text-sm mt-2" style={{ color: "#666666" }}>
            Your DHL Express shipments will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} brandConfig={config} />
          ))}
        </div>
      )}
    </div>
  );
}
