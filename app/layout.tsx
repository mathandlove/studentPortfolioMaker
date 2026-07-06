import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Portfolio Maker",
  description: "Helping students make a portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
