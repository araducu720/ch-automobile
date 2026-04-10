"use client";

import Link from "next/link";

const brands = [
  {
    slug: "walmart",
    name: "Walmart",
    tagline: "Save Money. Live Better.",
    bg: "#0071CE",
    accent: "#FFC220",
    textColor: "#FFFFFF",
    hoverBg: "#005BA1",
    icon: (
      <svg viewBox="0 0 40 40" className="w-12 h-12" fill="none">
        <circle cx="20" cy="20" r="20" fill="#FFC220" />
        <path d="M20 8l3.5 8.5h-7L20 8z" fill="#0071CE" />
        <path d="M20 32l-3.5-8.5h7L20 32z" fill="#0071CE" />
        <path d="M8 20l8.5-3.5v7L8 20z" fill="#0071CE" />
        <path d="M32 20l-8.5 3.5v-7L32 20z" fill="#0071CE" />
      </svg>
    ),
  },
  {
    slug: "amazon",
    name: "Amazon",
    tagline: "Earth's most customer-centric company",
    bg: "#232F3E",
    accent: "#FF9900",
    textColor: "#FFFFFF",
    hoverBg: "#131921",
    icon: (
      <svg viewBox="0 0 40 40" className="w-12 h-12" fill="none">
        <rect width="40" height="40" rx="8" fill="#FF9900" />
        <path d="M10 24c5 3 10 4 16 2" stroke="#232F3E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M24 22l3 2.5-3 2" stroke="#232F3E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="8" y="19" fill="#232F3E" fontWeight="900" fontSize="12" fontFamily="Arial">a</text>
      </svg>
    ),
  },
  {
    slug: "dpd",
    name: "DPD",
    tagline: "Dynamic Parcel Distribution",
    bg: "#DC0032",
    accent: "#FFFFFF",
    textColor: "#FFFFFF",
    hoverBg: "#A00025",
    icon: (
      <div
        className="w-12 h-12 flex items-center justify-center rounded-lg"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <span className="text-2xl font-black" style={{ color: "#DC0032" }}>dpd</span>
      </div>
    ),
  },
  {
    slug: "dhl",
    name: "DHL Express",
    tagline: "Excellence. Simply delivered.",
    bg: "#FFCC00",
    accent: "#D40511",
    textColor: "#333333",
    hoverBg: "#E6B800",
    icon: (
      <span
        className="text-3xl font-black tracking-widest italic"
        style={{ color: "#D40511" }}
      >
        DHL
      </span>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KYC Verification Platform</h1>
            <p className="text-sm text-gray-500 mt-1">Multi-brand identity verification system</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="live-dot" />
            <span className="text-xs text-gray-500 font-medium">System Online</span>
          </div>
        </div>
      </header>

      {/* Brand Selection */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Select Platform</h2>
          <p className="text-gray-500 mt-2">Choose your platform to begin identity verification</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/${brand.slug}/kyc`}
              className="group block rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
            >
              <div
                className="p-8 flex items-center gap-6 transition-colors"
                style={{ backgroundColor: brand.bg, color: brand.textColor }}
              >
                <div className="flex-shrink-0">{brand.icon}</div>
                <div>
                  <h3 className="text-xl font-bold">{brand.name}</h3>
                  <p className="text-sm mt-1 opacity-80">{brand.tagline}</p>
                  <div
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
                    style={{ backgroundColor: brand.accent, color: brand.bg }}
                  >
                    Start Verification
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900">4</div>
            <div className="text-sm text-gray-500 mt-1">Platforms</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">24/7</div>
            <div className="text-sm text-gray-500 mt-1">Availability</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">&lt;5min</div>
            <div className="text-sm text-gray-500 mt-1">Avg. Verification</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
          KYC Verification Platform &copy; {new Date().getFullYear()} — All rights reserved
        </div>
      </footer>
    </div>
  );
}
