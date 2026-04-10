import type { Metadata } from "next";
import DhlTheme from "@/components/brands/DhlTheme";

export const metadata: Metadata = {
  title: "DHL Express - Identity Verification",
  description: "Complete your identity verification for DHL Express services",
  icons: { icon: "/brands/dhl-favicon.ico" },
};

export default function DhlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-brand="dhl">
      <DhlTheme>{children}</DhlTheme>
    </div>
  );
}
