import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/UmAyan",
  assetPrefix: "/UmAyan/",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
