import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Gate - Community Gatekeeper",
  description: "Every applicant gets a fair one-to-one with your community's values. A human makes the call.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
