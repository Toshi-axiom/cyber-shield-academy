import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { phases } from "@/data/curriculum";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = ["/", "/courses", "/dashboard"];
        phases.forEach((p) => {
          paths.push(`/quiz/${p.id}`);
          p.modules.forEach((m) => paths.push(`/lesson/${p.id}/${m.id}`));
        });
        const urls = paths
          .map((path) => `  <url>\n    <loc>${BASE_URL}${path}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
