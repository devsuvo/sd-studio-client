import type { NextConfig } from "next";

const API_URL = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Same-origin proxy to the Express API, so the HttpOnly JWT cookie travels with every request.
  async rewrites() {
    return [{ source: "/backend/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
