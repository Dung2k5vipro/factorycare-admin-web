import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin He Thong",
  description: "Frontend Admin cho he thong QLSC va QLTB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
