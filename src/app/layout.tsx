import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FactoryCare Admin",
  description: "Hệ thống quản lý sự cố và bảo trì thiết bị.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
