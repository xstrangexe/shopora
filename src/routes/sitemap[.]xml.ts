import { createFileRoute } from "@tanstack/react-router";
import { getSupabase } from "@/lib/supabase/client";
import { infoPages } from "@/lib/pages";

/**
 * /sitemap.xml, built per request from the published catalogue, so a product
 * added in the dashboard is listed without a redeploy. Addresses use the host
 * that was asked, which is right for both the Vercel and the Cloudflare copy.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const supabase = getSupabase();
        const [products, categories] = await Promise.all([
          supabase.from("products").select("slug, updated_at").eq("status", "published"),
          supabase.from("categories").select("slug"),
        ]);

        const urls: { loc: string; lastmod?: string }[] = [
          { loc: "/" },
          { loc: "/catalogue" },
          ...(products.data ?? []).map((p) => ({
            loc: `/product/${encodeURIComponent(p.slug)}`,
            lastmod: p.updated_at?.slice(0, 10),
          })),
          ...(categories.data ?? []).map((c) => ({
            loc: `/category/${encodeURIComponent(c.slug)}`,
          })),
          ...infoPages().map((page) => ({ loc: `/pages/${page.slug}` })),
        ];

        const body =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls
            .map(
              (u) =>
                `  <url><loc>${origin}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`,
            )
            .join("\n") +
          `\n</urlset>\n`;

        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
