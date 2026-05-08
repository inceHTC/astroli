import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/dogum-haritasi", destination: "/birth-chart", permanent: true },
      { source: "/unlular-hangi-gurc", destination: "/unluler", permanent: true },
    ];
  },
};

export default nextConfig;
