import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🟢 AGREGADO: Permite que el JavaScript se descargue en la IP de tu celular
  allowedDevOrigins: [
  "localhost:3000",
  "127.0.0.1:3000",
  "192.168.68.107:3000",
  "192.168.68.107",
],

  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;