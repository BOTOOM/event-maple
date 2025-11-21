import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilitar React Compiler (ahora en la raíz en versiones recientes o requiere plugin)
  // Nota: Si falla en raíz, revertir y asegurar instalación del plugin
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    // Habilitar View Transition API
    viewTransition: true,
  },
};

export default nextConfig;