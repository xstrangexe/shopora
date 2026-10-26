/**
 * Advertising pixels: Meta (Facebook / Instagram) and TikTok.
 *
 * These are the pixels the shop used on YouCan, so ad campaigns keep their
 * audiences and conversion history after the move. Pixel IDs are public by
 * design (they appear in every page's source), so they live here rather than in
 * an environment variable.
 *
 * Every helper is a no-op on the server and when a blocker removed the scripts,
 * so a failed pixel can never break browsing or checkout. Values are in dinar.
 */

const META_PIXEL_ID = "1395282168919236";
const TIKTOK_PIXEL_IDS = ["DAGL2DRC77U250DBO4B0", "DARD13RC77U3N3HEQBU0"];
const CURRENCY = "DZD";

export type PixelItem = { id: string; name: string; price: number; quantity: number };

type Fbq = (...args: unknown[]) => void;
type Ttq = {
  page: () => void;
  track: (event: string, data?: Record<string, unknown>, options?: Record<string, unknown>) => void;
};

function fbq(): Fbq | null {
  return typeof window === "undefined" ? null : ((window as { fbq?: Fbq }).fbq ?? null);
}

function ttq(): Ttq | null {
  return typeof window === "undefined" ? null : ((window as { ttq?: Ttq }).ttq ?? null);
}

function safely(run: () => void) {
  try {
    run();
  } catch {
    // A pixel must never interrupt the buyer.
  }
}

const total = (items: PixelItem[]) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);

function metaData(items: PixelItem[], value: number) {
  return {
    content_ids: items.map((i) => i.id),
    content_type: "product",
    contents: items.map((i) => ({ id: i.id, quantity: i.quantity, item_price: i.price })),
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
    value,
    currency: CURRENCY,
  };
}

function tiktokData(items: PixelItem[], value: number) {
  return {
    contents: items.map((i) => ({
      content_id: i.id,
      content_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
    content_type: "product",
    value,
    currency: CURRENCY,
  };
}

export function trackPageView() {
  safely(() => fbq()?.("track", "PageView"));
  safely(() => ttq()?.page());
}

// A page can mount twice for one visit (loader data arriving), so the same
// event with the same key within a few seconds is the same event.
const recent = new Map<string, number>();

function firstTime(key: string): boolean {
  const now = Date.now();
  const seen = recent.get(key);
  recent.set(key, now);
  return seen === undefined || now - seen > 5000;
}

export function trackViewContent(item: PixelItem) {
  if (!firstTime(`view:${item.id}`)) return;
  const items = [item];
  safely(() =>
    fbq()?.("track", "ViewContent", { ...metaData(items, item.price), content_name: item.name }),
  );
  safely(() => ttq()?.track("ViewContent", tiktokData(items, item.price)));
}

export function trackAddToCart(item: PixelItem) {
  const items = [item];
  safely(() => fbq()?.("track", "AddToCart", metaData(items, total(items))));
  safely(() => ttq()?.track("AddToCart", tiktokData(items, total(items))));
}

export function trackInitiateCheckout(items: PixelItem[]) {
  if (!firstTime(`checkout:${total(items)}`)) return;
  safely(() => fbq()?.("track", "InitiateCheckout", metaData(items, total(items))));
  safely(() => ttq()?.track("InitiateCheckout", tiktokData(items, total(items))));
}

/** The order token doubles as the event ID, so a retried event is counted once. */
export function trackPurchase(items: PixelItem[], value: number, orderToken: string) {
  safely(() => fbq()?.("track", "Purchase", metaData(items, value), { eventID: orderToken }));
  safely(() => ttq()?.track("CompletePayment", tiktokData(items, value), { event_id: orderToken }));
}

/**
 * The vendors' standard loader snippets, inlined in <head> by `__root.tsx`.
 * They only define the queues and load the libraries; page views are sent by
 * `PixelPageViews` on every route change, the first one included.
 *
 * The router re-runs head scripts on client navigation. Without the guard the
 * TikTok snippet would replace the loaded library's methods with fresh queues
 * that nothing reads, silently dropping every later event.
 */
export const pixelBootstrapScript =
  `if(!window.__pixelsLoaded){window.__pixelsLoaded=1;` +
  `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');` +
  `fbq('init','${META_PIXEL_ID}');` +
  `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=r+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};` +
  TIKTOK_PIXEL_IDS.map((id) => `ttq.load('${id}');`).join("") +
  `}(window,document,'ttq');}`;
