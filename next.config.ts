import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/dogum-haritasi", destination: "/birth-chart", permanent: true },
      { source: "/unlular-hangi-gurc", destination: "/dergi/hangi-unlu-hangi-burc", permanent: true },
    ];
  },
};

export default nextConfig;
