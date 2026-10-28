/**
 * The product photo shown on the thank-you page.
 *
 * The tracking data has no images, but the order form has the photo of the case
 * the buyer just ordered. It is kept for this browser tab under the order's
 * token, so the thank-you page can show it without changing the database, and
 * a reload still finds it. Storage can be blocked (private mode); the page then
 * simply shows no photo.
 */
const KEY = "shopora:order-photo";

export function rememberOrderPhoto(token: string, url: string | null | undefined): void {
  if (!url) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ token, url }));
  } catch {
    // No storage: the thank-you page shows the order without a photo.
  }
}

export function orderPhoto(token: string): string | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as {
      token?: string;
      url?: string;
    } | null;
    return saved?.token === token && saved.url ? saved.url : null;
  } catch {
    return null;
  }
}
