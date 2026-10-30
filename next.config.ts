import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseHostname = supabaseUrl
  ? new URL(supabaseUrl).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
          },
        ]
      : [],
  },

  outputFileTracingIncludes: {
    "/**": [
      "./node_modules/.pnpm/@img+sharp-libvips-*/node_modules/@img/**/*.so*",
    ],
  },

  // 🟢 AGREGADO: Permite que el JavaScript se descargue en la IP de tu celular
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.68.107:3000",
    "192.168.68.107",
    "192.168.68.102",
    "192.168.68.103",
    "192.168.0.9",
    "*.trycloudflare.com",
  ],

  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;