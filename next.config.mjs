/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@stripe/crypto": false,
      "@farcaster/mini-app-solana": false,
      "@solana-program/memo": false,
    };
    return config;
  },
};

export default nextConfig;
