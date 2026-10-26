import { Field, Input, Select } from "@/components/ui/form";
import { useI18n } from "@/lib/i18n-context";
import { useStoreSettings } from "@/lib/queries";
import { WILAYAS } from "@/lib/wilayas";

/**
 * Wilaya and commune pickers for the express order form.
 *
 * The commune list follows the wilaya (Arabic names, Latin values, since the
 * carrier matches communes by their Latin name). Where the commune file has no
 * entry for a wilaya the buyer types it instead, so a missing commune never
 * blocks an order. Only wilayas the owner delivers to are offered.
 */
export function WilayaCommuneFields({
  wilaya,
  commune,
  communes,
  onWilaya,
  onCommune,
}: {
  wilaya: string;
  commune: string;
  communes: [latin: string, arabic: string][];
  onWilaya: (wilaya: string) => void;
  onCommune: (commune: string) => void;
}) {
  const { t, locale } = useI18n();
  const { data: settings } = useStoreSettings();
  const allowed = settings?.delivery_wilayas ?? [];
  const deliverable =
    allowed.length === 0 ? WILAYAS : WILAYAS.filter((w) => allowed.includes(w.fr));

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label={t("express.wilaya")} required>
        <Select value={wilaya} onChange={(e) => onWilaya(e.target.value)} required>
          <option value="">{t("express.selectWilaya")}</option>
          {deliverable.map((w) => (
            <option key={w.code} value={w.fr}>
              {String(w.code).padStart(2, "0")} — {locale === "ar" ? w.ar : w.fr}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={t("express.commune")} required>
        {communes.length > 0 ? (
          <Select value={commune} onChange={(e) => onCommune(e.target.value)} required>
            <option value="">{t("express.selectCommune")}</option>
            {communes.map(([latin, arabic]) => (
              <option key={latin} value={latin}>
                {locale === "ar" ? arabic : latin}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            value={commune}
            onChange={(e) => onCommune(e.target.value)}
            disabled={!wilaya}
            required
            maxLength={80}
          />
        )}
      </Field>
    </div>
  );
}

/** Quantity, 1 to `max` (the variant's stock, capped at 10 per order). */
export function QuantityStepper({
  quantity,
  max,
  onChange,
}: {
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium">{t("express.quantity")}</span>
      <span className="ci-qty !h-11">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, quantity - 1))}
          aria-label={`${t("express.quantity")} −`}
        >
          −
        </button>
        <span className="q" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, quantity + 1))}
          aria-label={`${t("express.quantity")} +`}
        >
          +
        </button>
      </span>
    </div>
  );
}
