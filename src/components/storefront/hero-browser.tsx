import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n-context";
import { priceRange, productImage, type CatalogueProduct } from "@/lib/queries";
import { formatDzd } from "@/lib/format";
import { localized } from "@/lib/i18n";
import { enter } from "@/lib/hero-scale";

/**
 * A slice of the shop rising in front of the ring: its cream theme, a banner of
 * real cases, and its real phone cases with their prices. No browser chrome or
 * announcement strip: the owner found them useless, and the height they took
 * goes to the ring. The decoration is hidden from screen readers; the cases are
 * real links, because on a phone two of them sit on the first scroll.
 */
export function HeroBrowser({ products }: { products: CatalogueProduct[] }) {
  const { t, locale } = useI18n();
  const items = products.slice(0, 2);

  return (
    <div className="hx-browser hx-a" style={enter(900, 26)}>
      <div className="hx-page">
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
