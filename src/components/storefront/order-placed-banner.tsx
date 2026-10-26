import { Link } from "@tanstack/react-router";
import { CheckCircle2, PhoneCall, Truck, Banknote } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

/**
 * Success header on the order page, shown once the database has accepted an
 * express order. The short number is the start of the order's tracking token,
 * which is what the owner sees in the dashboard and what the buyer can quote on
 * the confirmation call.
 */
export function OrderPlacedBanner({ token, phone }: { token: string; phone: string }) {
  const { t } = useI18n();
  const steps = [
    { icon: PhoneCall, text: t("placed.step1", { phone }) },
    { icon: Truck, text: t("placed.step2") },
    { icon: Banknote, text: t("placed.step3") },
  ];

  return (
    <section className="flex flex-col gap-5 rounded-[20px] border border-positive/30 bg-surface p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <CheckCircle2 size={32} className="shrink-0 text-positive" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-semibold">{t("placed.title")}</h1>
          <p className="text-sm text-on-surface-muted">
            {t("placed.number")}:{" "}
            <span className="font-mono font-semibold text-on-surface" dir="ltr">
              {token.slice(0, 8).toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">{t("placed.next")}</h2>
        <ol className="flex flex-col gap-2.5">
          {steps.map((step, index) => (
            <li key={index} className="flex items-center gap-3 text-sm">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/15 text-on-surface">
                <step.icon size={17} aria-hidden="true" />
              </span>
              {step.text}
            </li>
          ))}
        </ol>
      </div>

      <p className="text-xs text-on-surface-muted">{t("placed.keep")}</p>
      <Link to="/catalogue" className="btn btn-secondary btn-lg">
        {t("placed.continue")}
      </Link>
    </section>
  );
}
