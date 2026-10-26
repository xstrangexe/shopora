import { Banknote, Lock, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { formatDzd } from "@/lib/format";

/**
 * The money part of the express order form: what is being ordered, what it
 * costs with delivery, and the button that places it. The total is the amount
 * the courier collects, so it is the largest number on the form.
 *
 * The figures are a preview. `place_order()` recomputes price and delivery fee
 * from the database, and the confirmation page shows the stored amounts.
 */
export function ExpressOrderSummary({
  productName,
  variantLabel,
  quantity,
  unitPrice,
  deliveryFee,
  error,
  submitting,
}: {
  productName: string;
  variantLabel: string | null;
  quantity: number;
  unitPrice: number;
  /** Null until a wilaya is chosen. */
  deliveryFee: number | null;
  error: string | null;
  submitting: boolean;
}) {
  const { t, locale } = useI18n();
  const subtotal = unitPrice * quantity;
  const total = subtotal + (deliveryFee ?? 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[14px] border border-outline bg-surface-mid p-4">
        <h3 className="mb-3 text-sm font-semibold">{t("express.summary")}</h3>
        <p className="mb-3 text-sm">
          <span className="font-medium">{productName}</span>
          {variantLabel && <span className="text-on-surface-muted"> — {variantLabel}</span>}
          <span className="text-on-surface-muted" dir="ltr">
            {" "}
            × {quantity}
          </span>
        </p>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-on-surface-muted">{t("express.subtotal")}</dt>
            <dd className="font-semibold" dir="ltr">
              {formatDzd(subtotal, locale)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-on-surface-muted">{t("express.delivery")}</dt>
            <dd
              className={deliveryFee === null ? "text-on-surface-muted" : "font-semibold"}
              dir="ltr"
            >
              {deliveryFee === null ? t("express.deliveryPending") : formatDzd(deliveryFee, locale)}
            </dd>
          </div>
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-outline pt-3">
            <dt className="font-semibold">{t("express.total")}</dt>
            <dd className="text-xl font-bold" dir="ltr">
              {formatDzd(total, locale)}
            </dd>
          </div>
        </dl>
      </div>

      <p className="flex items-center gap-2.5 rounded-[12px] bg-brand/15 px-4 py-3 text-sm font-medium">
        <Banknote size={18} className="shrink-0" aria-hidden="true" />
        {t("express.cod")}
      </p>

      {error && (
        <p
          className="rounded-[12px] bg-error/10 px-4 py-3 text-sm font-medium text-error"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-gold btn-lg btn-block !min-h-14 !text-base"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            {t("express.submitting")}
          </>
        ) : (
          <>
            {t("express.submit")}
            {deliveryFee !== null && (
              <span dir="ltr" className="font-bold">
                · {formatDzd(total, locale)}
              </span>
            )}
          </>
        )}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-on-surface-muted">
        <Lock size={12} aria-hidden="true" />
        {t("express.privacy")}
      </p>
    </div>
  );
}
