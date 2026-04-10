"use client";

import { ReactNode } from "react";
import { brandConfigs } from "@/lib/brandConfig";

const config = brandConfigs.dhl;

interface DhlThemeProps {
  children: ReactNode;
}

export default function DhlTheme({ children }: DhlThemeProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF", fontFamily: config.fontFamily }}>
      {/* === DHL HEADER — Authentic DHL Express style === */}
      <header>
        {/* Top bar — DHL characteristic yellow */}
        <div style={{ backgroundColor: "#FFCC00" }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* DHL Logo — iconic red on yellow */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <span
                  className="text-3xl font-black tracking-widest italic"
                  style={{ color: "#D40511" }}
                >
                  DHL
                </span>
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold" style={{ color: "#D40511" }}>EXPRESS</div>
                <div className="text-xs" style={{ color: "#333" }}>Excellence. Simply delivered.</div>
              </div>
            </div>

            {/* Navigation — DHL style */}
            <nav className="hidden md:flex items-center gap-5 text-sm font-bold" style={{ color: "#333333" }}>
              <span>Track</span>
              <span>Ship</span>
              <span>Logistics Solutions</span>
              <span
                className="py-1.5 px-3"
                style={{
                  backgroundColor: "#D40511",
                  color: "#FFFFFF",
                }}
              >
                Verification
              </span>
              <span>About Us</span>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4 text-sm" style={{ color: "#333" }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Red accent line — signature DHL design element */}
        <div className="h-2" style={{ backgroundColor: "#D40511" }} />
      </header>

      {/* Hero Section — DHL angular style */}
      <div
        className="py-10"
        style={{
          background: "linear-gradient(135deg, #FFFBEB 0%, #FFF8E1 100%)",
          borderBottom: "3px solid #FFCC00",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-4" style={{ color: "#666666" }}>
            <a href="#" style={{ color: "#D40511", fontWeight: "bold" }}>Home</a>
            <span style={{ color: "#D40511" }}>›</span>
            <a href="#" style={{ color: "#D40511", fontWeight: "bold" }}>Express</a>
            <span style={{ color: "#D40511" }}>›</span>
            <span>Identity Verification</span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="w-1 h-16"
              style={{ backgroundColor: "#D40511" }}
            />
            <div>
              <h1 className="text-3xl font-black" style={{ color: "#333333" }}>
                Express Identity Verification
              </h1>
              <p className="text-sm mt-1" style={{ color: "#666666" }}>
                Verify your identity to access DHL Express services
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {children}
      </main>

      {/* Footer — DHL style */}
      <footer>
        {/* Yellow divider */}
        <div className="h-2" style={{ backgroundColor: "#FFCC00" }} />

        <div style={{ backgroundColor: "#333333", color: "#FFFFFF" }}>
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
              <div>
                <h4 className="font-black mb-3 text-yellow-400">Quick Links</h4>
                <div className="space-y-2 text-gray-400">
                  <p>Track a Shipment</p>
                  <p>Ship Now</p>
                  <p>Get a Quote</p>
                  <p>Schedule a Pickup</p>
                </div>
              </div>
              <div>
                <h4 className="font-black mb-3 text-yellow-400">DHL Express</h4>
                <div className="space-y-2 text-gray-400">
                  <p>Services</p>
                  <p>Customs</p>
                  <p>Rates & Transit Times</p>
                </div>
              </div>
              <div>
                <h4 className="font-black mb-3 text-yellow-400">Support</h4>
                <div className="space-y-2 text-gray-400">
                  <p>Contact DHL</p>
                  <p>FAQ</p>
                  <p>Service Points</p>
                </div>
              </div>
              <div>
                <h4 className="font-black mb-3 text-yellow-400">Company</h4>
                <div className="space-y-2 text-gray-400">
                  <p>About DHL</p>
                  <p>Sustainability</p>
                  <p>Press</p>
                  <p>Careers</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black italic" style={{ color: "#FFCC00" }}>DHL</span>
                <span className="text-xs text-gray-500">© 2024 DHL International GmbH. All rights reserved.</span>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Privacy Notice</span>
                <span>Terms of Use</span>
                <span>Legal Notice</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
