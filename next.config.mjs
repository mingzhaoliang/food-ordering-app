/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
    ppr: "incremental",
  },
  serverExternalPackages: ["@node-rs/argon2", "mongoose"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      }
    ]
  },
};

export default nextConfig;
