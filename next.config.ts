import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product and category photos are uploaded in AKOD ECO and served from Cloudinary
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
