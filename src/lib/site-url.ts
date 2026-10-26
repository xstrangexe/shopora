/**
 * The shop's public address, for canonical links and share previews.
 *
 * Read from `VITE_SITE_URL` (set in Vercel, and in `.env` for local and
 * Cloudflare builds) so the backup copy on Cloudflare points search engines and
 * Facebook at the main address instead of competing with it. Empty when unset,
 * in which case links stay relative and nothing breaks.
 */
const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/+$/, "");

/** "/product/x" becomes "https://shop.example/product/x"; absolute URLs pass through. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
