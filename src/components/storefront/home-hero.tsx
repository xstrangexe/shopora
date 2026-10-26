import { useEffect, useRef } from "react";
import { Banknote, RefreshCw, Truck } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import type { CatalogueProduct, StoreSettings } from "@/lib/queries";
import { availableModels } from "@/lib/phone-models";
import { HERO_SCALE_SCRIPT, applyHeroScale, enter } from "@/lib/hero-scale";
import { HeroRing } from "./hero-ring";
import { HeroBrowser } from "./hero-browser";

/**
 * Home hero: a black stage under the black header, the delivery badge, the
 * tagline, the owner's description and a gold "shop now"; behind them a 3D ring
 * of the shop's own phone-case pictures turning slowly, and in front of the ring
 * the shop itself in a browser window. Everything below it stays cream.
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
  const section = useRef<HTMLElement>(null);
  const tagline =
    (locale === "ar" ? settings?.tagline?.trim() : settings?.tagline_fr?.trim()) ||
    t("home.hero.title");
  const description =
    locale === "ar" ? settings?.description?.trim() : settings?.description_fr?.trim();
  // Phone cases only: the shop is about cases, so the preview leaves out the rest.
  const cases = products.filter((p) => availableModels([p]).length > 0);

  useEffect(() => {
    const el = section.current;
    const resize = () => applyHeroScale(el);
    resize();
    stars(el);
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <section ref={section} className="hx" suppressHydrationWarning>
        <div className="hx-stars" data-n="150" data-blur="0" />
        <div className="hx-stars" data-n="18" data-blur="1.2" />
        <div className="hx-canvas" suppressHydrationWarning>
          <div className="hx-row" style={{ top: 70 }}>
            <span className="hx-badge hx-a" style={enter(270, 11, 0.985)}>
              <i aria-hidden="true">
                <svg viewBox="5 1 14 22" preserveAspectRatio="none">
                  <path
                    d="M13.9 1.6 5.5 13.6a.7.7 0 0 0 .6 1.1h4.2l-1 7.7a.7.7 0 0 0 1.25.55l8.3-12.1a.7.7 0 0 0-.6-1.1h-4.2l1-7.7a.7.7 0 0 0-1.25-.55Z"
                    fill="rgba(150,115,55,.72)"
                    stroke="rgba(255,236,190,.6)"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </i>
              {t("home2.pill")}
            </span>
          </div>
          <div className="hx-row" style={{ top: 124 }}>
            <h1 className="hx-h1 font-display">{tagline}</h1>
          </div>
          {description && (
            <div className="hx-row" style={{ top: 212 }}>
              <p className="hx-sub hx-a" style={enter(690, 10)}>
                {description}
              </p>
            </div>
          )}
          <div className="hx-row hx-cta" style={{ top: 296 }}>
            <a href="#catalogue" className="hx-btn hx-a" style={enter(830, 13, 0.985)}>
              <span>{t("home2.shop")}</span>
            </a>
          </div>
          <div className="hx-show">
            <HeroRing />
            <HeroBrowser products={cases} tagline={tagline} />
          </div>
        </div>
      </section>
      {/* Scales the canvas before the first paint, not after hydration. The
          server and browser bundles print the function differently, and the
          script has already run by hydration, so its text is not compared. */}
      <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: HERO_SCALE_SCRIPT }} />
    </>
  );
}

/** Two starfields, each one 1px dot whose box-shadow list is every star. */
function stars(section: HTMLElement | null) {
  if (!section) return;
  const w = section.clientWidth;
  const h = Math.max(section.clientHeight, 640);
  section.querySelectorAll<HTMLElement>(".hx-stars").forEach((el) => {
    const n = Number(el.dataset.n);
    const blur = Number(el.dataset.blur);
    const [lo, hi] = blur > 0 ? [0.35, 0.7] : [0.05, 0.3];
    el.style.boxShadow = Array.from({ length: n }, () => {
      const alpha = (lo + Math.random() * (hi - lo)).toFixed(2);
      return `${Math.round(Math.random() * w)}px ${Math.round(Math.random() * h)}px ${blur}px 0 rgba(255,246,228,${alpha})`;
    }).join(",");
  });
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
