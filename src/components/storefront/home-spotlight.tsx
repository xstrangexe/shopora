import { Link } from "@tanstack/react-router";
import { Banknote, Smartphone, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { priceRange, productImage, type CatalogueProduct } from "@/lib/queries";
import { formatDzd } from "@/lib/format";
import { localized } from "@/lib/i18n";
import { modelRange } from "@/lib/phone-models";

/** The YouCan page featured the leather case; it stays the default pick. */
const SPOTLIGHT_SLUG = "iphone-case-cuire";

/**
 * "Product of the week": one real product, large, with what a buyer checks
 * before ordering — price, the phone models it fits, the colours, cash on
 * delivery. Falls back to the first product with colours if the default is gone.
 */
export function ProductSpotlight({ products }: { products: CatalogueProduct[] }) {
  const { t, locale } = useI18n();
  const product =
    products.find((p) => p.slug === SPOTLIGHT_SLUG) ??
    products.find((p) => new Set(p.product_variants.map((v) => v.color_name)).size > 1);
  if (!product) return null;

  const image = productImage(product);
  const range = priceRange(product);
  const models = modelRange(product);
  const colours = [...new Set(product.product_variants.map((v) => v.color_name).filter(Boolean))];
  const name = localized(locale, product.name, product.name_fr);

  return (
    <section className="container-page py-6" aria-labelledby="spot-title">
      <div className="grid overflow-hidden rounded-[22px] border border-outline bg-surface md:grid-cols-2">
        {image && (
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full object-cover md:aspect-auto md:h-full"
          />
        )}
        <div className="flex flex-col gap-4 p-5 sm:p-8">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-bold text-black">
            <Star size={13} aria-hidden="true" />
            {t("spot.badge")}
          </span>
          <h2
            id="spot-title"
            dir="auto"
            className="font-body text-2xl font-bold rtl:text-right sm:text-3xl"
          >
            {name}
          </h2>

          <ul className="flex flex-wrap gap-2 text-xs">
            {models && (
              <li className="inline-flex items-center gap-1.5 rounded-full border border-outline px-3 py-1.5">
                <Smartphone size={13} aria-hidden="true" />
                <span dir="ltr">{models}</span>
              </li>
            )}
            <li className="inline-flex items-center gap-1.5 rounded-full border border-outline px-3 py-1.5">
              <Banknote size={13} aria-hidden="true" />
              {t("spot.cod")}
            </li>
          </ul>

          {colours.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold">{t("spot.colours")}</p>
              <ul className="flex flex-wrap gap-2">
                {colours.map((c) => (
                  <li key={c} className="rounded-full bg-surface-high px-3 py-1 text-xs">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {range && (
            <p className="text-gold-ink text-3xl font-bold rtl:text-right" dir="ltr">
              {formatDzd(range.min, locale)}
            </p>
          )}
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="btn btn-gold btn-lg !min-h-12 w-full sm:w-fit sm:!px-10"
          >
            {t("express.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
