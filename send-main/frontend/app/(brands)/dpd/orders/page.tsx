"use client";

import { useState, useEffect } from "react";
import { brandConfigs } from "@/lib/brandConfig";
import { Order } from "@/types/kyc";
import { getOrders } from "@/lib/api";
import OrderCard from "@/components/shared/OrderCard";

export default function DpdOrdersPage() {
  const config = brandConfigs.dpd;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders("dpd");
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
      {/* DPD Orders Header */}
      <div
        className="rounded-lg overflow-hidden mb-6"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div className="h-1" style={{ backgroundColor: "#DC0032" }} />
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold" style={{ color: "#414042" }}>
                Parcel Tracking
              </h1>
              <p className="text-sm mt-1" style={{ color: "#6D6E71" }}>
                Track your DPD deliveries
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: "#E8F5E9" }}>
              <div className="live-dot" />
              <span className="text-xs font-medium" style={{ color: "#2E7D32" }}>Live Tracking</span>
            </div>
          </div>

          {/* DPD-style tracking search */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Enter parcel number..."
              className="flex-1 px-4 py-2.5 text-sm rounded-lg outline-none"
              style={{
                border: "1px solid #BDBDBD",
                color: "#414042",
              }}
            />
            <button
              className="px-6 py-2.5 text-sm font-bold text-white rounded-lg"
              style={{ backgroundColor: "#DC0032" }}
            >
              Track
            </button>
          </div>
        </div>
      </div>

      {/* Orders */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="kyc-spinner" />
        </div>
      ) : orders.length === 0 ? (
        <div
          className="text-center py-12 rounded-lg"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="#BDBDBD" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-bold" style={{ color: "#414042" }}>No parcels to display</h3>
          <p className="text-sm mt-2" style={{ color: "#6D6E71" }}>
            Your delivery history will appear here.
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
