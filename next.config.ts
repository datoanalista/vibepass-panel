import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para GitHub Pages
  output: 'export',
  trailingSlash: true,
  basePath: '/vibepass-panel',
  images: {
    unoptimized: true,
  },
  // Configuración base
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
