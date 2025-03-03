import type { NextConfig } from "next";

const api_url = process.env.API_URL;
console.log(`API URL: ${api_url}`);

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${api_url}/:path*`
      }
    ]
  }
};

export default nextConfig;
