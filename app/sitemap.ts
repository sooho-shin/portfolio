import type { MetadataRoute } from "next";
import { projects } from "@/config/projects";
import { siteProfile } from "@/config/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/about", "/work"].map(path => ({
    url: `${siteProfile.siteUrl}${path}`,
    lastModified: now,
  }));

  const projectRoutes = projects.map(project => ({
    url: `${siteProfile.siteUrl}/work/${project.slug}`,
    lastModified: now,
  }));

  return [...routes, ...projectRoutes];
}
