import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    WS_URL: process.env.WS_URL,
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
