import type { Metadata } from "next";
import AmazonTheme from "@/components/brands/AmazonTheme";

export const metadata: Metadata = {
  title: "Amazon - Seller Verification",
  description: "Complete your identity verification for Amazon Seller Central",
  icons: { icon: "/brands/amazon-favicon.ico" },
};

export default function AmazonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-brand="amazon">
      <AmazonTheme>{children}</AmazonTheme>
    </div>
  );
}
