"use client";

import { useState, useEffect } from "react";
import { brandConfigs } from "@/lib/brandConfig";
import { Order } from "@/types/kyc";
import { getOrders } from "@/lib/api";
import OrderCard from "@/components/shared/OrderCard";

export default function WalmartOrdersPage() {
  const config = brandConfigs.walmart;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders("walmart");
        setOrders(data);
      } catch {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      {/* Walmart Orders Header */}
      <div className="mb-6">
        <div
          className="rounded-lg p-6"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E6E7E8",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold" style={{ color: "#2E2F32" }}>
                Marketplace Orders
              </h1>
              <p className="text-sm mt-1" style={{ color: "#6D6E71" }}>
                Track your Walmart Marketplace orders in real-time
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="live-dot" />
              <span className="text-xs font-medium" style={{ color: "#2A8703" }}>Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters — Walmart style */}
      <div className="flex items-center gap-3 mb-6">
        {["All Orders", "Processing", "Shipped", "Delivered"].map((filter, i) => (
          <button
            key={filter}
            className="px-4 py-2 text-sm font-medium rounded-full transition-colors"
            style={{
              backgroundColor: i === 0 ? "#0071CE" : "#FFFFFF",
              color: i === 0 ? "#FFFFFF" : "#2E2F32",
              border: i === 0 ? "none" : "1px solid #E6E7E8",
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="kyc-spinner" />
          <span className="ml-3 text-sm" style={{ color: "#6D6E71" }}>Loading orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div
          className="text-center py-12 rounded-lg"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E6E7E8" }}
        >
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="#CBCBCB" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-bold" style={{ color: "#2E2F32" }}>No orders yet</h3>
          <p className="text-sm mt-1" style={{ color: "#6D6E71" }}>
            Orders will appear here once customers start purchasing.
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
