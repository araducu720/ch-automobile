"use client";

import { useState, useEffect } from "react";
import { brandConfigs } from "@/lib/brandConfig";
import { Order } from "@/types/kyc";
import { getOrders } from "@/lib/api";
import OrderCard from "@/components/shared/OrderCard";

export default function AmazonOrdersPage() {
  const config = brandConfigs.amazon;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders("amazon");
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
      {/* Amazon-style Orders Header */}
      <div
        className="rounded-lg p-5 mb-6"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #D5D9D9",
          borderRadius: "8px",
          boxShadow: "0 2px 5px 0 rgba(213,217,217,.5)",
        }}
      >
        <h1 className="text-lg font-bold" style={{ color: "#0F1111" }}>
          Your Orders
        </h1>
        <div className="flex items-center gap-6 mt-3 text-sm">
          {["Orders", "Buy Again", "Not Yet Shipped", "Cancelled Orders"].map((tab, i) => (
            <span
              key={tab}
              className="pb-2 cursor-pointer"
              style={{
                color: i === 0 ? "#C45500" : "#007185",
                borderBottom: i === 0 ? "2px solid #C45500" : "none",
                fontWeight: i === 0 ? "bold" : "normal",
              }}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Search bar — Amazon orders style */}
      <div className="flex gap-2 mb-6">
        <div
          className="flex-1 flex rounded-lg overflow-hidden"
          style={{ border: "1px solid #D5D9D9" }}
        >
          <input
            type="text"
            placeholder="Search all orders"
            className="flex-1 px-4 py-2 text-sm outline-none"
            style={{ color: "#0F1111" }}
          />
          <button
            className="px-6 py-2 text-sm font-medium"
            style={{
              background: "linear-gradient(to bottom, #F7DFA5, #F0C14B)",
              border: "1px solid #A88734",
              borderLeft: "none",
              color: "#0F1111",
            }}
          >
            Search Orders
          </button>
        </div>
      </div>

      {/* Time filter */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-bold" style={{ color: "#0F1111" }}>
          {orders.length} orders placed in
        </span>
        <select
          className="text-sm px-3 py-1 rounded"
          style={{
            backgroundColor: "#F0F2F2",
            border: "1px solid #D5D9D9",
            color: "#0F1111",
          }}
        >
          <option>last 30 days</option>
          <option>past 3 months</option>
          <option>2024</option>
          <option>2023</option>
        </select>
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
            border: "1px solid #D5D9D9",
            borderRadius: "8px",
          }}
        >
          <p className="text-base" style={{ color: "#0F1111" }}>
            You have not placed any orders yet.
          </p>
          <p className="text-sm mt-2" style={{ color: "#565959" }}>
            Orders will show up here once you start processing.
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
