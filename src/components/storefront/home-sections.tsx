import { Link } from "@tanstack/react-router";
import { ArrowRight, Banknote, Headphones, MapPin, Quote, Truck } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { formatRelative } from "@/lib/format";
import { useCategories, useReviews } from "@/lib/queries";
import { StarRating } from "./star-rating";
import { localized } from "@/lib/i18n";

/**
 * Category strip.
 *
 * Real links to real category pages, built from the categories table rather than
 * derived from whatever text happens to be on products. A category with no
 * published products is not rendered, because an empty category page is a dead
 * end and makes a small shop look broken.
 */
export function CategoryStrip() {
  const { t, locale } = useI18n();
  const { data: categories } = useCategories();

  // A strip with a single category only repeats the product grid above it.
  const visible = (categories ?? []).filter((category) => category.product_count > 0);
  if (visible.length < 2) return null;

  return (
    <section className="container-page py-10">
      <h2 className="mb-5 font-display text-xl font-semibold sm:text-2xl">
        {t("home.categories")}
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((category) => (
          <Link
            key={category.id}
            to="/category/$slug"
            params={{ slug: category.slug }}
            className="group flex items-center justify-between gap-3 rounded-[16px] border border-outline bg-surface transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-outline-hi hover:shadow-sm"
          >
            {category.image_url && (
              <span className="size-16 shrink-0 overflow-hidden rounded-s-[16px] bg-surface-high">
                <img
                  src={category.image_url}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover"
                />
              </span>
            )}
            <span className="min-w-0 flex-1 px-4 py-3.5">
              <span className="block truncate text-sm font-medium">
                {localized(locale, category.name, category.name_fr)}
              </span>
              <span className="font-mono text-xs text-on-surface-muted">
                {category.product_count} {t("nav.products")}
              </span>
            </span>
            <ArrowRight
              size={16}
              className="me-4 shrink-0 text-on-surface-muted transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Promo band. Berry, per the reference's "sale/secondary action" colour, so it
 * reads as a time-limited offer rather than as another primary button.
 */
export function PromoBand({ threshold }: { threshold: number }) {
  const { t, locale } = useI18n();
  if (threshold <= 0) return null;

  const formatted = new Intl.NumberFormat("en-US").format(threshold);

  return (
    <section className="container-page py-6">
      <div className="promo-bar">
        <span className="p-text">
          {t("home.promo.title")} -{" "}
          <span dir="ltr" className="font-mono">
            {formatted}
          </span>{" "}
          {locale === "ar" ? "دج" : "DA"}
        </span>
        <span className="p-text opacity-90">{t("home.promo.body")}</span>
        <a href="#catalogue" className="promo-cta">
          {t("home.promo.cta")}
        </a>
      </div>
    </section>
  );
}

/** Review wall, from the store's own approved reviews. */
export function ReviewWall() {
  const { t, locale } = useI18n();
  const { data: reviews } = useReviews();
  const top = (reviews ?? []).slice(0, 3);

  if (top.length === 0) return null;

  return (
    <section className="section-alt border-y border-outline py-14">
      <div className="container-page">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="font-display text-xl font-semibold sm:text-2xl">
            {t("home.reviews.title")}
          </h2>
          <p className="mt-2 max-w-lg text-sm text-on-surface-muted">{t("home.reviews.body")}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {top.map((review) => (
            <figure key={review.id} className="review-card">
              <Quote size={18} className="mb-3 text-outline-hi" aria-hidden="true" />
              <StarRating value={review.rating} className="mb-3" />
              <blockquote className="review-body">{review.comment}</blockquote>
              <figcaption className="mt-4 flex items-center gap-2.5">
                <span className="review-ava" aria-hidden="true">
                  {review.customer_name.trim().charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-medium">{review.customer_name}</span>
                  <span className="text-xs text-on-surface-muted">
                    {formatRelative(review.created_at, locale)}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * "How to order": the four real steps of a SHOPORA order, from picking a model
 * to paying the courier. It answers the first-time buyer's real question
 * (do I pay now? do I need an account?) without inventing any promise.
 */
export function HowToOrder() {
  const { t } = useI18n();
  const steps = [
    ["how.step1.title", "how.step1.body"],
    ["how.step2.title", "how.step2.body"],
    ["how.step3.title", "how.step3.body"],
    ["how.step4.title", "how.step4.body"],
  ] as const;

  return (
    <section className="container-page py-12" aria-labelledby="how-title">
      <h2 id="how-title" className="mb-6 font-display text-xl font-semibold sm:text-2xl">
        {t("how.title")}
      </h2>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([title, body], index) => (
          <li
            key={title}
            className="flex items-start gap-3 rounded-[16px] border border-outline bg-surface p-4"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-on-surface font-bold text-bg">
              {index + 1}
            </span>
            <span>
              <span className="block text-sm font-semibold">{t(title)}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-on-surface-muted">
                {t(body)}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * "Shop with confidence": the four reasons a first-time buyer can order without
 * risk, each one true of this shop. The wilaya count comes from the owner's
 * delivery list, so it follows the settings.
 */
export function ConfidenceSection({ wilayaCount }: { wilayaCount: number }) {
  const { t } = useI18n();
  const items = [
    { icon: Banknote, title: t("trust2.cod"), body: t("trust2.codBody") },
    { icon: Truck, title: t("trust2.choice"), body: t("trust2.choiceBody") },
    {
      icon: MapPin,
      title: t("trust2.wilayas", { count: wilayaCount }),
      body: t("trust2.wilayasBody"),
    },
    { icon: Headphones, title: t("trust2.support"), body: t("trust2.supportBody") },
  ];

  return (
    <section className="container-page py-10" aria-labelledby="trust-title">
      <div className="mb-6 text-center">
        <h2 id="trust-title" className="font-display text-xl font-bold sm:text-2xl">
          {t("trust2.title")}
        </h2>
        <p className="mt-1.5 text-sm text-on-surface-muted">{t("trust2.body")}</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex flex-col items-center gap-2 rounded-[18px] border border-outline bg-surface p-4 text-center"
          >
            <span className="grid size-11 place-items-center rounded-full bg-brand/15 text-brand">
              <item.icon size={20} aria-hidden="true" />
            </span>
            <span className="text-sm font-bold">{item.title}</span>
            <span className="text-xs leading-relaxed text-on-surface-muted">{item.body}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
