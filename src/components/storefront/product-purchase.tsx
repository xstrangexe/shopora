import { useEffect, useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { formatDzd } from "@/lib/format";
import { useStoreSettings, type CatalogueVariant } from "@/lib/queries";
import { waLink } from "@/lib/whatsapp";
import { saleOf } from "@/lib/sale";

/**
 * The parts of a product page that actually sell something: stock and the
 * WhatsApp paths.
 *
 * Split out of `product-detail.tsx` when that file passed the 250-line limit.
 * The seam is real rather than arithmetic: everything here is an action, and
 * everything left there is presentation.
 */

export function variantLabel(variant: CatalogueVariant): string {
  const parts = [variant.size, variant.color_name].filter(Boolean);
  return parts.length > 0 ? parts.join(" / ") : "—";
}

export function StockLine({
  selected,
  fromPrice,
  hasStock,
}: {
  selected: CatalogueVariant | null;
  /** Shown until a model is picked, so the price is never missing from the page. */
  fromPrice: number;
  hasStock: boolean;
}) {
  const { t, locale } = useI18n();
  const low = selected !== null && selected.stock > 0 && selected.stock <= 3;
  const sale = selected ? saleOf(selected) : null;

  return (
    <div className="flex flex-col gap-2">
      {!selected && (
        <p className="text-2xl font-bold" dir="ltr">
          {formatDzd(fromPrice, locale)}
        </p>
      )}
      {selected && (
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1" dir="ltr">
          <span className="text-2xl font-bold">{formatDzd(selected.price, locale)}</span>
          {sale && (
            <>
              <span className="text-base text-on-surface-muted line-through">
                {formatDzd(sale.was, locale)}
              </span>
              <span className="rounded-full bg-positive/12 px-2 py-0.5 font-mono text-xs font-semibold text-positive">
                −{sale.percent}%
              </span>
            </>
          )}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {hasStock ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-positive/12 px-3 py-1 text-positive">
            <Check size={14} aria-hidden="true" />
            {t("store.inStock")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-error/12 px-3 py-1 text-error">
            {t("store.outOfStock")}
          </span>
        )}
        {low && selected && (
          <span className="text-xs text-tertiary">
            {t("store.lowStock", { count: selected.stock })}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * A WhatsApp link with the product and the page address already in the
 * message, or null when the shop has no usable number. A buyer who is unsure
 * will not fill in a form; they will send a message, and carrying the product,
 * the model and the link into it turns that hesitation into an order.
 */
function useWhatsappHref(intro: string, name: string, selected: CatalogueVariant | null) {
  const { locale } = useI18n();
  const { data: settings } = useStoreSettings();

  // Read from state rather than `window` during render so the server and the
  // first client render agree. An empty value on first paint is filtered out of
  // the message below.
  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => setPageUrl(window.location.href), []);

  return waLink(
    settings?.whatsapp,
    [
      intro,
      `${name}${selected ? ` — ${variantLabel(selected)}` : ""}`,
      selected ? formatDzd(selected.price, locale) : "",
      pageUrl,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

/**
 * Under the form: the WhatsApp path. The gold "order now" button that used to sit
 * above the form is gone: it only scrolled a few centimetres, and the bar
 * pinned to the screen already does that. There is no cart: the form on this
 * page is the whole purchase.
 */
export function OrderActions({
  name,
  selected,
}: {
  name: string;
  selected: CatalogueVariant | null;
}) {
  const { t } = useI18n();
  const waHref = useWhatsappHref(t("store.waOrderIntro"), name, selected);
  if (!waHref) return null;

  return (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-ghost btn-lg btn-block"
    >
      <MessageCircle size={18} aria-hidden="true" />
      {t("store.orderViaWhatsapp")}
    </a>
  );
}

/**
 * Under the model buttons: "your phone is not listed? message us". A buyer whose
 * iPhone is not in the list would otherwise leave; this keeps them, and the
 * message says which case they were looking at.
 */
export function ModelHelp({ name }: { name: string }) {
  const { t } = useI18n();
  const waHref = useWhatsappHref(t("store.waModelAsk"), name, null);
  if (!waHref) return null;

  return (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      className="-mt-2 inline-flex min-h-11 w-fit items-center gap-1.5 text-sm font-medium text-gold-ink"
    >
      <MessageCircle size={15} aria-hidden="true" />
      {t("store.modelHelp")}
    </a>
  );
}
