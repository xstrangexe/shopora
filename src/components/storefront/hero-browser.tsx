import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n-context";
import { priceRange, productImage, type CatalogueProduct } from "@/lib/queries";
import { formatDzd } from "@/lib/format";
import { localized } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site-url";
import { enter } from "@/lib/hero-scale";

/**
 * The shop seen in a browser window, in front of the ring: its cream theme,
 * a banner of real cases, and its real phone cases with their prices. The
 * window itself is decoration and hidden from screen readers; the cases are
 * real links, because on a phone two of them sit on the first scroll.
 */
export function HeroBrowser({ products }: { products: CatalogueProduct[] }) {
  const { t, locale } = useI18n();
  const host = new URL(absoluteUrl("/")).host;
  const items = products.slice(0, 2);

  return (
    <div className="hx-browser hx-a" style={enter(900, 26)}>
      <div className="hx-bar" aria-hidden="true">
        <span className="hx-dots" dir="ltr">
          <i style={{ background: "#ee5c62" }} />
          <i style={{ background: "#f6b719" }} />
          <i style={{ background: "#12c02f" }} />
        </span>
        <span className="hx-omni" dir="ltr">
          <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="#fff" strokeWidth="2.4">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.8-3.8" />
          </svg>
          {host}
        </span>
      </div>
      <div className="hx-page">
        <div className="hx-ann" aria-hidden="true">
          {t("home2.pill")}
        </div>
        <div className="hx-shophead" aria-hidden="true">
          SHOPORA
        </div>
        <div className="hx-banner" aria-hidden="true">
          <img src="/hero/banner.webp" alt="" decoding="async" />
          <div className="hx-banner-scrim" />
          {/* Not the headline again: what the shop is, in a few words. */}
          <div className="hx-banner-copy">
            <strong>{t("hx.banner")}</strong>
            <span>{t("home2.trust.cod")}</span>
          </div>
        </div>
        <div className="hx-sec" aria-hidden="true">
          {t("hx.new")}
        </div>
        <div className="hx-grid">
          {items.map((product) => {
            const image = productImage(product);
            const range = priceRange(product);
            return (
              <Link key={product.id} to="/product/$slug" params={{ slug: product.slug }}>
                <figure>
                  {image ? <img src={image} alt="" decoding="async" /> : <div className="hx-ph" />}
                  <figcaption>
                    {localized(locale, product.name, product.name_fr)}
                    {range && (
                      <b>
                        <span dir="ltr">{formatDzd(range.min, locale)}</span>
                      </b>
                    )}
                  </figcaption>
                </figure>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
