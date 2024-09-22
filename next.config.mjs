/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: "incremental",
  },
  serverExternalPackages: ["@node-rs/argon2", "mongoose"],
};

export default nextConfig;
