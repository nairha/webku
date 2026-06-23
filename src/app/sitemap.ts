import { getPosts } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";

const locales = ["en", "id", "zh"];

export default async function sitemap() {
  // 1. Static Routes
  const activeRoutes = Object.keys(routesConfig).filter(
    (route) => routesConfig[route as keyof typeof routesConfig],
  );

  const routes = activeRoutes.flatMap((route) => {
    return locales.map((lang) => ({
      url: `${baseURL}/${lang}${route !== "/" ? route : ""}`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [
            l,
            `${baseURL}/${l}${route !== "/" ? route : ""}`,
          ])
        ),
      },
    }));
  });

  // 2. Blog Posts
  const allBlogSlugs = Array.from(new Set(locales.flatMap(l => getPosts(l).map(p => p.slug))));

  const blogs = allBlogSlugs.flatMap((slug) => {
    return locales.map((lang) => {
      const posts = getPosts(lang);
      const post = posts.find(p => p.slug === slug);
      if (!post) return null;

      return {
        url: `${baseURL}/${lang}/blog/${slug}`,
        lastModified: post.metadata.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales
              .filter(l => getPosts(l).some(p => p.slug === slug))
              .map((l) => [
                l,
                `${baseURL}/${l}/blog/${slug}`,
              ])
          ),
        },
      };
    }).filter(Boolean);
  });

  // 3. Proyek / Works
  const allWorkSlugs = Array.from(new Set(locales.flatMap(l => getPosts(l, ["src", "content", "proyek"]).map(p => p.slug))));

  const works = allWorkSlugs.flatMap((slug) => {
    return locales.map((lang) => {
      const posts = getPosts(lang, ["src", "content", "proyek"]);
      const post = posts.find(p => p.slug === slug);
      if (!post) return null;

      return {
        url: `${baseURL}/${lang}/proyek/${slug}`,
        lastModified: post.metadata.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales
              .filter(l => getPosts(l, ["src", "content", "proyek"]).some(p => p.slug === slug))
              .map((l) => [
                l,
                `${baseURL}/${l}/proyek/${slug}`,
              ])
          ),
        },
      };
    }).filter(Boolean);
  });

  return [
    ...routes,
    ...blogs,
    ...works,
  ];
}
