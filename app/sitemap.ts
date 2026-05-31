import type { MetadataRoute } from "next";
import { projects } from "@/config/projects";
import { buildCanonicalUrl, publicRoutes } from "@/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = publicRoutes.map(path => ({
    url: buildCanonicalUrl(path),
    lastModified: now,
  }));

  const projectRoutes = projects.map(project => ({
    url: buildCanonicalUrl(`/work/${project.slug}`),
    lastModified: now,
  }));

  return [...routes, ...projectRoutes];
}
