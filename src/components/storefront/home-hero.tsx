import { Link } from "@tanstack/react-router";
import { ArrowLeft, Banknote, RefreshCw, Truck, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import type { CatalogueProduct, StoreSettings } from "@/lib/queries";
import { priceRange, productImage } from "@/lib/queries";
import { formatDzd } from "@/lib/format";
import { localized } from "@/lib/i18n";

/**
 * Home hero, after the brand's YouCan page: centred, a delivery pill,
 * the tagline, the owner's one-line description and a gold "shop now", then a
 * swipeable row of real product photos with their prices. The row is the shop
 * window: an ad visitor sees products and prices on the first screen.
 *
 * The owner's tagline and description are Arabic, so French and English readers
 * get the interface headline instead of untranslated text.
 */
export function HomeHero({
  settings,
  products,
}: {
  settings: StoreSettings | null;
  products: CatalogueProduct[];
}) {
  const { t, locale } = useI18n();
  const shots = products
    .map((product) => ({ product, image: productImage(product), range: priceRange(product) }))
    .filter((s) => s.image !== null)
    .slice(0, 8);
  const tagline = locale === "ar" ? settings?.tagline?.trim() : settings?.tagline_fr?.trim();
  const description =
    locale === "ar" ? settings?.description?.trim() : settings?.description_fr?.trim();

  return (
    <section className="relative overflow-hidden">
      {/* A soft gold light behind the headline; the only decoration on the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(201,169,110,0.16),transparent_70%)]"
      />
      <div className="container-page relative flex flex-col items-center pt-7 pb-4 text-center sm:pt-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-surface px-3.5 py-1.5 text-xs font-medium">
          <Zap size={14} className="text-brand" aria-hidden="true" />
          {t("home2.pill")}
        </span>
        <h1 className="mt-4 max-w-2xl font-display text-[clamp(30px,8.5vw,58px)] font-bold leading-[1.15]">
          {tagline || t("home.hero.title")}
        </h1>
        {description && (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-on-surface-muted sm:text-base">
            {description}
          </p>
        )}
        <a href="#catalogue" className="btn btn-gold btn-lg mt-5 !min-h-12 !px-9 !text-base">
          {t("home2.shop")}
          <ArrowLeft size={18} className="ltr:rotate-180" aria-hidden="true" />
        </a>
      </div>

      {shots.length > 0 && (
        <div className="container-page pb-6">
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {shots.map(({ product, image, range }, index) => (
              <Link
                key={product.id}
                to="/product/$slug"
                params={{ slug: product.slug }}
                className="group relative block w-[44%] shrink-0 snap-start overflow-hidden rounded-[18px] border border-outline bg-surface sm:w-[30%] lg:w-auto"
              >
                <img
                  src={image as string}
                  alt=""
                  width={320}
                  height={400}
                  loading={index < 2 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out-soft group-hover:scale-[1.04]"
                />
                <span className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pt-10 pb-3 text-start text-white">
                  <span className="line-clamp-1 text-xs font-medium">
                    {localized(locale, product.name, product.name_fr)}
                  </span>
                  {range && (
                    <span className="text-sm font-bold text-brand" dir="ltr">
                      {formatDzd(range.min, locale)}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Three facts the shop keeps, in one card under the hero, as on YouCan: cash on
 * delivery, 1 to 7 days, and the owner's exchange window.
 */
export function TrustBar({ returnsDays }: { returnsDays: number }) {
  const { t } = useI18n();
  const items = [
    { icon: Banknote, title: t("home2.trust.cod"), body: t("home2.trust.codBody") },
    { icon: Truck, title: t("home2.trust.delivery"), body: t("home2.trust.deliveryBody") },
    {
      icon: RefreshCw,
      title: t("home2.trust.exchange"),
      body: t("home2.trust.exchangeBody", { days: returnsDays }),
    },
  ];

  return (
    <section className="container-page pb-4">
      <ul className="grid grid-cols-3 divide-x divide-outline overflow-hidden rounded-[18px] border border-outline bg-surface rtl:divide-x-reverse">
        {items.map((item) => (
          <li key={item.title} className="flex flex-col items-center gap-1 px-2 py-3.5 text-center">
            <item.icon size={18} className="text-brand" aria-hidden="true" />
            <span className="text-[12.5px] font-bold leading-tight sm:text-sm">{item.title}</span>
            <span className="text-[11px] leading-tight text-on-surface-muted sm:text-xs">
              {item.body}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
