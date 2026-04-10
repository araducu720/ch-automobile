import type { Metadata } from "next";
import WalmartTheme from "@/components/brands/WalmartTheme";

export const metadata: Metadata = {
  title: "Walmart - Identity Verification",
  description: "Complete your identity verification for Walmart Marketplace",
  icons: { icon: "/brands/walmart-favicon.ico" },
};

export default function WalmartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-brand="walmart">
      <WalmartTheme>{children}</WalmartTheme>
    </div>
  );
}
