import type { NextConfig } from "next";

const DIA_CHI_BACKEND = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005/api")
  .replace(/\/api\/?$/, "");

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005/api",
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${DIA_CHI_BACKEND}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
