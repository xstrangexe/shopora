import { useState } from "react";
import { Banknote, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { formatDzd } from "@/lib/format";
import { useDeliveryZones } from "@/lib/delivery";
import { useStoreSettings } from "@/lib/queries";
import { splitDescription } from "@/lib/description";

/**
 * Why to buy, between the price and the order form.
 *
 * The owner's description is a short pitch followed by ticked selling points.
 * Clamped to five lines, the points were the part that got cut, so a buyer from
 * an ad reached the form without reading what the case does. Here the pitch is
 * one paragraph and every point is a line of the list. A description with no
 * ticked lines keeps the old behaviour: five lines and a "more" toggle.
 */
export function ProductBenefits({ text }: { text: string }) {
  const { intro, points } = splitDescription(text);
  if (points.length === 0) return <ClampedDescription text={text} />;

  return (
    <div className="flex flex-col gap-3">
      {intro.length > 0 && (
        <p className="pd-description text-on-surface" dir="auto">
          {intro.join(" ")}
        </p>
      )}
      <ul className="pd-points">
        {points.map((point) => (
          <li key={point}>
            <span className="pd-point-tick" aria-hidden="true">
              <Check size={13} strokeWidth={3} />
            </span>
            <span dir="auto">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClampedDescription({ text }: { text: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const long = text.split("\n").length > 5 || text.length > 260;

  return (
    <div className="flex flex-col items-start gap-1">
      <p
        className={`pd-description whitespace-pre-line text-on-surface-muted ${
          long && !open ? "line-clamp-5" : ""
        }`}
      >
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="min-h-10 text-sm font-semibold text-gold-ink"
        >
          {open ? t("store.readLess") : t("store.readMore")}
        </button>
      )}
    </div>
  );
}

/**
 * Under the price: cash on delivery, and the cheapest delivery in the owner's
 * own price list. A buyer's first question after the price is what delivery
 * adds; answering it here means the form's total is not a surprise. The figure
 * is left out until the list has loaded, and when delivery can be free.
 */
export function PriceFacts() {
  const { t, locale } = useI18n();
  const { data: zones = [] } = useDeliveryZones();
  const { data: settings } = useStoreSettings();
  const fees = zones.flatMap((zone) =>
    zone.stopdesk_fee === null ? [zone.fee] : [zone.fee, zone.stopdesk_fee],
  );
  const from = fees.length > 0 ? Math.min(...fees) : null;
  const showFrom = from !== null && from > 0 && !(settings?.free_shipping_threshold ?? 0);

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-on-surface-muted">
      <Banknote size={16} className="shrink-0 text-gold-ink" aria-hidden="true" />
      <span>{t("home2.trust.cod")}</span>
      {showFrom && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            {t("store.deliveryFrom")} {formatDzd(from, locale)}
          </span>
        </>
      )}
    </p>
  );
}
