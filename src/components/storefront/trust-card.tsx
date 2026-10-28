import { Banknote, RefreshCw, Truck } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { useStoreSettings } from "@/lib/queries";
import { WILAYAS } from "@/lib/wilayas";

/**
 * Three facts the shop keeps, in one card: cash on delivery, how many wilayas in
 * 1 to 3 days (from the owner's delivery list) and the exchange window. Used
 * under the home hero and under the price on a product page, so a buyer sees
 * them where they decide, not only in the form below.
 */
export function TrustCard({
  returnsDays,
  wilayaCount,
}: {
  returnsDays?: number;
  wilayaCount?: number;
}) {
  const { t } = useI18n();
  const { data: settings } = useStoreSettings();
  const days = returnsDays ?? settings?.returns_days ?? 7;
  const count = wilayaCount ?? (settings?.delivery_wilayas?.length || WILAYAS.length);
  const items = [
    { icon: Banknote, title: t("home2.trust.cod"), body: t("home2.trust.codBody") },
    {
      icon: Truck,
      title: t("trust2.wilayas", { count }),
      body: t("home2.trust.deliveryBody"),
    },
    {
      icon: RefreshCw,
      title: t("home2.trust.exchange"),
      body: t("home2.trust.exchangeBody", { days }),
    },
  ];

  return (
    <ul className="grid grid-cols-3 divide-x divide-outline overflow-hidden rounded-[18px] border border-outline bg-surface rtl:divide-x-reverse">
      {items.map((item) => (
        <li key={item.title} className="flex flex-col items-center gap-1 px-2 py-3.5 text-center">
          <item.icon size={18} className="text-gold-ink" aria-hidden="true" />
          <span className="text-[13px] font-bold leading-tight sm:text-sm">{item.title}</span>
          <span className="text-xs leading-tight text-on-surface-muted">{item.body}</span>
        </li>
      ))}
    </ul>
  );
}
