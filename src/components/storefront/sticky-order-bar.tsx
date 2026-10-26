import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { formatDzd } from "@/lib/format";
import { ORDER_FORM_ID } from "./express-order-form";

/**
 * Phone-only bar pinned to the bottom of a product page: "order now — price".
 *
 * It only scrolls to the express form; it never creates a cart or submits an
 * order. It hides while the form is on screen, so it never covers the fields
 * the buyer is filling in, and it is hidden from 1024px up (`lg:hidden`).
 */
export function StickyOrderBar({ price, onOrder }: { price: number; onOrder: () => void }) {
  const { t, locale } = useI18n();
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById(ORDER_FORM_ID);
    if (!form || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), {
      threshold: 0.05,
    });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  if (formVisible) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-outline bg-nav-bg/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={onOrder}
        className="btn btn-gold btn-lg btn-block !min-h-13 !text-base"
      >
        <ShoppingBag size={19} aria-hidden="true" />
        {t("express.ctaPrice", { price: formatDzd(price, locale) })}
      </button>
    </div>
  );
}
