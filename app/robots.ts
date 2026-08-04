import type { MetadataRoute } from "next";

/**
 * Gera o robots.txt automaticamente.
 * Futuramente será expandido para bloquear /admin.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
  };
}
