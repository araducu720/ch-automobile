"use client";

import { ReactNode } from "react";
import { brandConfigs } from "@/lib/brandConfig";

const config = brandConfigs.walmart;

interface WalmartThemeProps {
  children: ReactNode;
}

export default function WalmartTheme({ children }: WalmartThemeProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2F8FD", fontFamily: config.fontFamily }}>
      {/* === WALMART HEADER — Authentic Walmart.com style === */}
      <header style={{ backgroundColor: "#0071CE" }}>
        {/* Top bar */}
        <div className="px-4 py-1 text-xs text-white/80 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex justify-between">
            <span>How do you want your items?</span>
            <div className="flex gap-4">
              <span>Sign In</span>
              <span>Account</span>
            </div>
          </div>
        </div>
        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
          {/* Walmart Spark Logo */}
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 28 28" className="w-8 h-8" fill="none">
              <circle cx="14" cy="14" r="14" fill="#FFC220" />
              <path d="M14 5l2.5 6h-5L14 5z" fill="#0071CE" />
              <path d="M14 23l-2.5-6h5L14 23z" fill="#0071CE" />
              <path d="M5 14l6-2.5v5L5 14z" fill="#0071CE" />
              <path d="M23 14l-6 2.5v-5L23 14z" fill="#0071CE" />
              <path d="M7.5 7.5l5.5 3.5-3.5 1.5L7.5 7.5z" fill="#0071CE" />
              <path d="M20.5 20.5l-5.5-3.5 3.5-1.5 2 5z" fill="#0071CE" />
            </svg>
            <span className="text-xl font-bold text-white tracking-tight">Walmart</span>
          </div>
          {/* Search bar — Walmart style */}
          <div className="flex-1 max-w-2xl">
            <div className="flex">
              <input
                type="text"
                placeholder="Search everything at Walmart online and in store"
                className="flex-1 px-4 py-2.5 text-sm rounded-l-full outline-none"
                style={{ color: "#2E2F32" }}
                disabled
              />
              <button
                className="px-5 rounded-r-full"
                style={{ backgroundColor: "#FFC220" }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#0071CE" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          {/* Right icons */}
          <div className="flex items-center gap-5 text-white text-xs">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Reorder</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>My Items</span>
            </div>
          </div>
        </div>
        {/* Category nav — sub-header */}
        <div style={{ backgroundColor: "#004C91" }}>
          <div className="max-w-7xl mx-auto px-4 py-2 flex gap-6 text-white text-sm">
            <span className="flex items-center gap-1 font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Departments
            </span>
            <span>Services</span>
            <span className="font-bold text-yellow-300">Identity Verification</span>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="text-xs flex gap-1" style={{ color: "#6D6E71" }}>
          <a href="#" style={{ color: "#0071CE" }}>Home</a>
          <span>/</span>
          <a href="#" style={{ color: "#0071CE" }}>Account</a>
          <span>/</span>
          <span style={{ color: "#2E2F32" }}>Identity Verification</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#2E2F32" }}>
          Seller Identity Verification
        </h1>
        {children}
      </main>

      {/* Footer — Walmart style */}
      <footer style={{ backgroundColor: "#004C91", color: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-bold mb-3">All Departments</h4>
              <div className="space-y-1 text-white/70">
                <p>Electronics</p>
                <p>Home & Garden</p>
                <p>Clothing</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3">Get to Know Us</h4>
              <div className="space-y-1 text-white/70">
                <p>Company</p>
                <p>Our Story</p>
                <p>Careers</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3">Customer Service</h4>
              <div className="space-y-1 text-white/70">
                <p>Help Center</p>
                <p>Returns</p>
                <p>Contact Us</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3">Sell on Walmart</h4>
              <div className="space-y-1 text-white/70">
                <p>Marketplace</p>
                <p>Seller Center</p>
                <p>Fulfillment</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/20 text-xs text-white/50 text-center">
            © 2024 Walmart. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
