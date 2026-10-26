import { Link, createFileRoute } from "@tanstack/react-router";
import { StoreLayout } from "@/components/storefront/store-layout";
import { ProductGrid } from "@/components/storefront/product-card";
import { HomeHero, TrustBar } from "@/components/storefront/home-hero";
import {
  CategoryStrip,
  ConfidenceSection,
  HowToOrder,
  PromoBand,
  ReviewWall,
} from "@/components/storefront/home-sections";
import { ModelFinder } from "@/components/storefront/home-finder";
import { ProductSpotlight } from "@/components/storefront/home-spotlight";
import { WILAYAS } from "@/lib/wilayas";
import { ErrorState, NoProducts, ProductSkeleton } from "@/components/ui/feedback";
import { SetupCheck } from "@/components/setup-check";
import { supabaseConfigProblem } from "@/lib/supabase/client";
import { reviewsQuery, storeSettingsQuery } from "@/lib/queries";
import { EMPTY_FILTERS, cataloguePageQuery, useCataloguePage } from "@/lib/catalogue";
import { useI18n } from "@/lib/i18n-context";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    // Prefetch both so SSR emits the store name and the catalogue instead of an
    // empty shell. Failures are swallowed: a missing database must render the
    // setup guidance, not a 500.
    const settings = await context.queryClient
      .ensureQueryData(storeSettingsQuery())
      .catch(() => null);
    await Promise.all([
      // Reviews feed the testimonial wall below the fold. Fetching them during
      // SSR avoids a visible pop-in and lets crawlers see the social proof.
      context.queryClient.ensureQueryData(reviewsQuery()).catch(() => null),
      // The product grid is the page. Without this the server HTML ships an
      // empty grid and the buyer waits for the browser to fill it in.
      context.queryClient.ensureQueryData(cataloguePageQuery(EMPTY_FILTERS, 1)).catch(() => null),
    ]);
    return { settings };
  },
  head: ({ loaderData, match }) => {
    const s = loaderData?.settings;
    const ar = match.context.locale === "ar";
    const name = s?.name?.trim();
    const tagline = (ar ? s?.tagline : s?.tagline_fr)?.trim();
    const title = name ? `${name}${tagline ? ` — ${tagline}` : ""}` : "SHOPORA";
    const description =
      (ar ? s?.description : s?.description_fr)?.trim() ||
      (ar
        ? "تسوق أونلاين مع الدفع عند الاستلام والتوصيل إلى 58 ولاية."
        : "Shop online, pay cash on delivery.");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: absoluteUrl("/") },
        { property: "og:image", content: absoluteUrl(s?.logo_url || "/brand/shopora-logo.png") },
      ],
      links: [{ rel: "canonical", href: absoluteUrl("/") }],
    };
  },
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const { settings } = Route.useLoaderData();
  const catalogue = useCataloguePage(EMPTY_FILTERS, 1);
  const configProblem = supabaseConfigProblem();

  // A shop that has not been connected to a database yet must see the setup
  // instructions, not an error boundary. This is the first screen a new owner
  // ever loads, so it has to be the most forgiving one.
  if (configProblem) {
    return (
      <main className="container-page flex min-h-dvh flex-col items-center justify-center gap-6 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">{settings?.name ?? "SHOPORA"}</h1>
        <SetupCheck />
      </main>
    );
  }

  const list = catalogue.data?.products ?? [];
  const catalogueTotal = catalogue.data?.total ?? 0;
  const wilayaCount = settings?.delivery_wilayas?.length || WILAYAS.length;

  // Black and gold from top to bottom, like the brand's YouCan page: hero and
  // product row, trust strip, model finder, best sellers, product of the week,
  // how to order, and why it is safe to order.
  return (
    <StoreLayout dark>
      <HomeHero settings={settings} products={list} />
      <TrustBar returnsDays={settings?.returns_days ?? 7} />
      <ModelFinder products={list} />

      <section id="catalogue" className="container-page scroll-mt-20 py-8 sm:py-12">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-xl font-bold sm:text-2xl">{t("best.title")}</h2>
          {catalogueTotal > 0 && (
            <Link
              to="/catalogue"
              className="inline-flex min-h-9 items-center text-sm text-brand hover:underline"
            >
              {t("best.more")} ({catalogueTotal})
            </Link>
          )}
        </div>

        {catalogue.isPending ? (
          <div className="product-grid">
            {Array.from({ length: 6 }, (_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : catalogue.isError ? (
          <div className="mx-auto flex max-w-xl flex-col gap-4">
            <ErrorState
              message={catalogue.error.message}
              onRetry={() => void catalogue.refetch()}
            />
            <SetupCheck />
          </div>
        ) : list.length === 0 ? (
          <NoProducts />
        ) : (
          <ProductGrid products={list} />
        )}
      </section>

      <CategoryStrip />
      <ProductSpotlight products={list} />
      <PromoBand threshold={settings?.free_shipping_threshold ?? 0} />
      <ReviewWall />
      <HowToOrder />
      <ConfidenceSection wilayaCount={wilayaCount} />
    </StoreLayout>
  );
}
