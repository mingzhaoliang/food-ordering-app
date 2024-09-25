import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
    ppr: "incremental",
  },
  webpack(config, { dir }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(dir, "src/"),
    };

    return config;
  },
  serverExternalPackages: ["@node-rs/argon2", "mongoose"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/my",
        destination: "/my/profile",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
