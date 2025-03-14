import type { NextConfig } from "next";

const api_url = process.env.API_URL;
console.log(`API URL: ${api_url}`);

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
