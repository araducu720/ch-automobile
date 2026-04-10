"use client";

import { ReactNode } from "react";
import { brandConfigs } from "@/lib/brandConfig";

const config = brandConfigs.amazon;

interface AmazonThemeProps {
  children: ReactNode;
}

export default function AmazonTheme({ children }: AmazonThemeProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EAEDED", fontFamily: config.fontFamily }}>
      {/* === AMAZON HEADER — Authentic Amazon.com style === */}
      <header>
        {/* Main nav bar */}
        <div style={{ backgroundColor: "#131921" }}>
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
            {/* Amazon Logo */}
            <div className="flex items-center gap-1 py-1">
              <span className="text-xl font-bold text-white tracking-tight">
                amazon
              </span>
              <span className="text-xs text-gray-400">.com</span>
            </div>

            {/* Deliver to */}
            <div className="text-white text-xs hidden md:block">
              <span className="text-gray-400">Deliver to</span>
              <div className="flex items-center gap-1 font-bold">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Romania
              </div>
            </div>

            {/* Search — Amazon style with category dropdown */}
            <div className="flex-1 max-w-3xl">
              <div className="flex">
                <select
                  className="px-2 py-2 text-xs rounded-l-md border-r"
                  style={{ backgroundColor: "#E3E6E6", color: "#0F1111" }}
                  disabled
                >
                  <option>All</option>
                </select>
                <input
                  type="text"
                  placeholder="Search Amazon"
                  className="flex-1 px-3 py-2 text-sm outline-none"
                  style={{ color: "#0F1111" }}
                  disabled
                />
                <button
                  className="px-4 rounded-r-md"
                  style={{ backgroundColor: "#FEBD69" }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#232F3E" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right nav */}
            <div className="flex items-center gap-5 text-white text-xs">
              <div>
                <span className="text-gray-400">Hello, sign in</span>
                <div className="font-bold text-sm flex items-center gap-1">
                  Account & Lists
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-gray-400">Returns</span>
                <div className="font-bold text-sm">& Orders</div>
              </div>
              <div className="relative">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <span
                  className="absolute -top-1 right-0 text-xs font-bold px-1.5"
                  style={{ color: "#FF9900" }}
                >
                  0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub nav — Amazon style */}
        <div style={{ backgroundColor: "#232F3E" }}>
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex gap-5 text-white text-sm">
            <span className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              All
            </span>
            <span>Today's Deals</span>
            <span>Customer Service</span>
            <span>Registry</span>
            <span className="font-bold" style={{ color: "#FF9900" }}>Seller Verification</span>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="text-xs flex gap-1" style={{ color: "#565959" }}>
          <a href="#" style={{ color: "#007185" }}>Your Account</a>
          <span>›</span>
          <a href="#" style={{ color: "#007185" }}>Seller Central</a>
          <span>›</span>
          <span style={{ color: "#CC0C39" }}>Identity Verification</span>
        </div>
      </div>

      {/* Main Content — Amazon card style */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div
          className="p-6 mb-6"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            border: "1px solid #D5D9D9",
          }}
        >
          <h1 className="text-xl font-normal mb-1" style={{ color: "#0F1111" }}>
            Seller Identity Verification
          </h1>
          <p className="text-sm" style={{ color: "#565959" }}>
            Complete the verification process to start selling on Amazon Marketplace
          </p>
        </div>
        {children}
      </main>

      {/* Footer — Amazon style */}
      <div>
        {/* Back to top */}
        <button
          className="w-full py-3 text-sm text-white"
          style={{ backgroundColor: "#37475A" }}
        >
          Back to top
        </button>

        {/* Footer links */}
        <footer style={{ backgroundColor: "#232F3E", color: "#DDD" }}>
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
              <div>
                <h4 className="font-bold text-white mb-3">Get to Know Us</h4>
                <div className="space-y-2 text-gray-400">
                  <p>Careers</p>
                  <p>Blog</p>
                  <p>About Amazon</p>
                  <p>Investor Relations</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white mb-3">Make Money with Us</h4>
                <div className="space-y-2 text-gray-400">
                  <p>Sell products on Amazon</p>
                  <p>Become an Affiliate</p>
                  <p>Advertise Your Products</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white mb-3">Amazon Payment Products</h4>
                <div className="space-y-2 text-gray-400">
                  <p>Amazon Rewards Visa</p>
                  <p>Amazon Store Card</p>
                  <p>Amazon Currency Converter</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white mb-3">Let Us Help You</h4>
                <div className="space-y-2 text-gray-400">
                  <p>Your Account</p>
                  <p>Your Orders</p>
                  <p>Returns & Replacements</p>
                  <p>Help</p>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom */}
          <div style={{ backgroundColor: "#131921" }}>
            <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-gray-500">
              <p>© 1996-2024, Amazon.com, Inc. or its affiliates</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
