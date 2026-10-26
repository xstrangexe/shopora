import { Link } from "@tanstack/react-router";
import { ArrowLeft, Banknote, RotateCcw, Truck } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import type { CatalogueProduct, StoreSettings } from "@/lib/queries";
import { productImage } from "@/lib/queries";
import { localized } from "@/lib/i18n";

/**
 * Storefront hero: black, compact, product-led.
 *
 * Most buyers land here from an ad on a phone, so the hero is deliberately
 * short: the headline, one line of reassurance and one gold button, so the real
 * product grid starts within the first screen. From tablet width up, a strip of
 * the shop's own product photos sits beside the text.
 *
 * The owner's tagline is written in Arabic, so it is shown only to Arabic
 * readers; French and English readers get the interface headline instead.
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
    .map((product) => ({ product, image: productImage(product) }))
    .filter((shot): shot is { product: CatalogueProduct; image: string } => shot.image !== null)
    .slice(0, 4);
  const tagline = locale === "ar" ? settings?.tagline?.trim() : settings?.tagline_fr?.trim();

  return (
    <section data-theme="dark" className="overflow-hidden bg-bg text-on-surface">
      <div className="container-page flex flex-col gap-5 py-6 sm:py-10 lg:flex-row lg:items-center lg:gap-12 lg:py-16">
        <div className="flex flex-col items-start lg:w-[45%]">
          <h1 className="font-display text-[clamp(26px,6.8vw,52px)] font-semibold leading-[1.15]">
            {tagline || t("home.hero.title")}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-on-surface-muted sm:text-base">
            {t("home.hero.body")}
          </p>
          <a href="#catalogue" className="btn btn-gold btn-lg mt-4 !min-h-12 !px-7 !text-base">
            {t("home.promo.cta")}
            <ArrowLeft size={18} className="ltr:rotate-180" aria-hidden="true" />
          </a>
        </div>

        {shots.length > 0 && (
          <div className="-mx-4 hidden snap-x gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:flex lg:mx-0 lg:grid lg:flex-1 lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {shots.map(({ product, image }, index) => {
              const name = localized(locale, product.name, product.name_fr);
              return (
                <Link
                  key={product.id}
                  to="/product/$slug"
                  params={{ slug: product.slug }}
                  className="group relative block w-[30%] shrink-0 snap-start overflow-hidden rounded-[16px] border border-outline bg-surface sm:w-[24%] lg:w-auto"
                >
                  <img
                    src={image}
                    alt={name}
                    width={300}
                    height={375}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out-soft group-hover:scale-[1.04]"
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Trust strip: three facts the shop actually keeps — cash on delivery, delivery
 * to all 58 wilayas at home or to an office, and the owner's return window.
 * Compact on a phone (three small columns) so it never pushes products down.
 */
export function TrustBar({ returnsDays }: { returnsDays: number }) {
  const { t } = useI18n();
  const items = [
    { icon: Banknote, title: t("home.trust.cod.title") },
    { icon: Truck, title: t("home.trust.delivery.title") },
    { icon: RotateCcw, title: t("home.trust.returns.title", { days: returnsDays }) },
  ];

  return (
    <section className="border-b border-outline bg-surface">
      <ul className="container-page grid grid-cols-3 gap-2 py-3.5">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:justify-center sm:gap-2.5"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/15">
              <item.icon size={17} aria-hidden="true" />
            </span>
            <span className="text-[12px] font-semibold leading-tight sm:text-sm">{item.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
