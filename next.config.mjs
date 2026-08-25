/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "framerusercontent.com" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
    // Converte imagens para WebP/AVIF automaticamente → menor payload
    formats: ["image/avif", "image/webp"],
  },

  // Compressão gzip/brotli nas respostas
  compress: true,

  // Remove powered-by header (segurança + bytes)
  poweredByHeader: false,

  // Headers de cache para assets estáticos
  async headers() {
    return [
      {
        source: "/parceiros/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:file*.{png,jpg,jpeg,webp,avif,svg,ico}",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },

  // Experimental: turbopack em dev para reloads mais rápidos
  experimental: {},
};

export default nextConfig;
