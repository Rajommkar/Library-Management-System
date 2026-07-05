import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
      },
    ],
  },
};

export default nextConfig;
