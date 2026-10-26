import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import type { CatalogueProduct } from "@/lib/queries";
import {
  availableModels,
  modelLabel,
  productsForModel,
  type PhoneModel,
  type PhoneType,
} from "@/lib/phone-models";
import { cn } from "@/lib/utils";
import { ProductGrid } from "./product-card";

const TYPE_LABEL: Record<PhoneType, string> = {
  base: "",
  plus: "Plus",
  pro: "Pro",
  "pro max": "Pro Max",
};

/**
 * "Find the case for your iPhone": the YouCan page's choice assistant, made to
 * work. The buyer taps the number, then the version, and only the cases with a
 * variant in stock for that exact model are shown. Built from the catalogue
 * already loaded for the home page, so it costs no extra request. Hidden when no
 * product has phone models.
 */
export function ModelFinder({ products }: { products: CatalogueProduct[] }) {
  const { t } = useI18n();
  const models = useMemo(() => availableModels(products), [products]);
  const numbers = [...new Set(models.map((m) => m.number))];
  const [number, setNumber] = useState<number | null>(null);
  const [type, setType] = useState<PhoneType | null>(null);

  if (models.length === 0) return null;

  const types = models.filter((m) => m.number === number).map((m) => m.type);
  const chosen: PhoneModel | null = number !== null && type !== null ? { number, type } : null;
  const matches = chosen ? productsForModel(products, chosen) : [];

  const chip = (active: boolean) =>
    cn(
      "min-h-11 rounded-[12px] border px-3 text-sm font-semibold transition-colors",
      active
        ? "border-brand bg-brand text-black"
        : "border-outline bg-surface hover:border-outline-hi",
    );

  return (
    <section className="container-page py-6" aria-labelledby="finder-title">
      <div className="rounded-[22px] border border-outline bg-surface p-4 sm:p-6">
        <span className="text-gold-ink inline-flex items-center gap-1.5 rounded-full border border-brand/50 px-3 py-1 text-xs font-medium">
          <Sparkles size={13} aria-hidden="true" />
          {t("finder.badge")}
        </span>
        <h2 id="finder-title" className="mt-3 font-display text-xl font-bold sm:text-2xl">
          {t("finder.title")}
        </h2>
        <p className="mt-1 text-sm text-on-surface-muted">{t("finder.body")}</p>

        <h3 className="mt-5 text-sm font-semibold">{t("finder.step1")}</h3>
        <div className="mt-2.5 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {numbers.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={n === number}
              className={chip(n === number)}
              onClick={() => {
                setNumber(n);
                const only = models.filter((m) => m.number === n);
                setType(only.length === 1 ? only[0].type : null);
              }}
            >
              <span dir="ltr">{n}</span>
            </button>
          ))}
        </div>

        {number !== null && types.length > 1 && (
          <>
            <h3 className="mt-4 text-sm font-semibold">{t("finder.step2")}</h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {types.map((ty) => (
                <button
                  key={ty}
                  type="button"
                  aria-pressed={ty === type}
                  className={chip(ty === type)}
                  onClick={() => setType(ty)}
                >
                  <span dir="ltr">{`${number} ${TYPE_LABEL[ty]}`.trim()}</span>
                  {ty === "base" && (
                    <span className="ms-1 text-xs opacity-70">({t("finder.base")})</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {chosen && (
          <div className="mt-5" aria-live="polite">
            <h3 className="mb-3 text-sm font-semibold">
              {t("finder.results", { model: modelLabel(chosen) })}
            </h3>
            {matches.length > 0 ? (
              <ProductGrid products={matches} />
            ) : (
              <p className="rounded-[12px] bg-surface-mid px-4 py-3 text-sm text-on-surface-muted">
                {t("finder.none")}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
