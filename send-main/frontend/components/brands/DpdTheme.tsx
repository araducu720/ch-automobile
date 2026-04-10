"use client";

import { ReactNode } from "react";
import { brandConfigs } from "@/lib/brandConfig";

const config = brandConfigs.dpd;

interface DpdThemeProps {
  children: ReactNode;
}

export default function DpdTheme({ children }: DpdThemeProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAFA", fontFamily: config.fontFamily }}>
      {/* === DPD HEADER — Authentic DPD style === */}
      <header>
        {/* Top utility bar */}
        <div style={{ backgroundColor: "#414042" }}>
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between text-xs text-white/80">
            <div className="flex gap-4">
              <span>DPD Group</span>
              <span>International</span>
            </div>
            <div className="flex gap-4">
              <span>Help</span>
              <span>Contact</span>
              <span>Login</span>
            </div>
          </div>
        </div>

        {/* Main header — DPD Red */}
        <div style={{ backgroundColor: "#DC0032" }}>
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* DPD Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 flex items-center justify-center rounded-lg"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <span className="text-xl font-black" style={{ color: "#DC0032" }}>dpd</span>
              </div>
              <div className="text-white hidden md:block">
                <div className="text-sm font-bold">DPD</div>
                <div className="text-xs opacity-80">Dynamic Parcel Distribution</div>
              </div>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6 text-white text-sm font-medium">
              <span>Track Parcel</span>
              <span>Ship</span>
              <span>Services</span>
              <span className="py-1 px-3 rounded" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                Verification
              </span>
              <span>About</span>
            </nav>

            {/* Mobile menu */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Red accent strip */}
        <div className="h-1" style={{ background: "linear-gradient(90deg, #DC0032 0%, #A00025 100%)" }} />
      </header>

      {/* Hero section — DPD style */}
      <div
        className="py-8"
        style={{
          background: "linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)",
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-xs mb-4" style={{ color: "#6D6E71" }}>
            <a href="#" style={{ color: "#DC0032" }}>Home</a>
            <span>›</span>
            <a href="#" style={{ color: "#DC0032" }}>Services</a>
            <span>›</span>
            <span>Courier Verification</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "#414042" }}>
            Courier Identity Verification
          </h1>
          <p className="text-sm mt-2" style={{ color: "#6D6E71" }}>
            Complete your identity verification to deliver with DPD
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer — DPD style */}
      <footer style={{ backgroundColor: "#414042", color: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-bold mb-3 text-white">Shipping</h4>
              <div className="space-y-2 text-gray-400">
                <p>Send a Parcel</p>
                <p>Pricing</p>
                <p>Parcel Shop Finder</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-white">Tracking</h4>
              <div className="space-y-2 text-gray-400">
                <p>Track & Trace</p>
                <p>Live Tracking</p>
                <p>Notifications</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-white">Business</h4>
              <div className="space-y-2 text-gray-400">
                <p>Business Solutions</p>
                <p>API Integration</p>
                <p>Become a Courier</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-white">Company</h4>
              <div className="space-y-2 text-gray-400">
                <p>About DPD</p>
                <p>Sustainability</p>
                <p>Press</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-xs text-gray-500">
            <p>© 2024 DPD Group. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Use</span>
              <span>Imprint</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
