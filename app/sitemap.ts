import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/repositories/property.repository";

/**
 * Gera o sitemap.xml automaticamente com base nas rotas existentes e nos imóveis cadastrados.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kenesis.com.br";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${baseUrl}/imoveis/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
