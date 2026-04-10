import type { Metadata } from "next";
import DpdTheme from "@/components/brands/DpdTheme";

export const metadata: Metadata = {
  title: "DPD - Courier Verification",
  description: "Complete your identity verification for DPD courier services",
  icons: { icon: "/brands/dpd-favicon.ico" },
};

export default function DpdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-brand="dpd">
      <DpdTheme>{children}</DpdTheme>
    </div>
  );
}
