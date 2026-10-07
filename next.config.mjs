/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  experimental: { serverComponentsExternalPackages: ["mongoose"] },
};
export default nextConfig;
