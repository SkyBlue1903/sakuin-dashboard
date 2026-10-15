import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.233", "localhost:3000"],
  async redirects() {
    return [
      {
        source: "/guides",
        destination: "/guide",
        permanent: true,
      },
      {
        source: "/panduan",
        destination: "/guide",
        permanent: true,
      },
      {
        source: "/admin/guides",
        destination: "/admin/guide",
        permanent: true,
      },
      {
        source: "/admin/panduan",
        destination: "/admin/guide",
        permanent: true,
      },
      {
        source: "/error-404",
        destination: "/404",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
