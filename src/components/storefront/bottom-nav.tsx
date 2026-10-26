import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Search, Truck } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";

/**
 * Bottom tab bar.
 *
 * The reference system's "Phone Feelings" directive: under 1024px the storefront
 * behaves like an app and primary navigation moves into the thumb zone, because
 * a shop that buries its catalogue behind a hamburger loses mobile orders. Hidden
 * at 1024px and above by the `.bottom-nav` rule in styles.css. There is no cart
 * tab: SHOPORA orders straight from the product page.
 */
export function BottomNav() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const tabs = [
    { key: "home", to: "/", label: t("nav.home"), icon: Home },
    { key: "shop", to: "/catalogue", label: t("nav.shop"), icon: LayoutGrid },
    { key: "search", to: "/search", label: t("nav.search"), icon: Search },
    { key: "track", to: "/track", label: t("nav.trackOrder"), icon: Truck },
  ] as const;

  // The owner reaches the dashboard from the footer. A buyer's tab bar is for
  // buying, and a "Dashboard" tab there reads as a broken link.
  const shopPaths = ["/catalogue", "/category", "/product"];

  return (
    <nav className="bottom-nav" aria-label={t("nav.shop")}>
      {tabs.map((tab) => {
        const active =
          tab.key === "home"
            ? pathname === "/"
            : tab.key === "shop"
              ? shopPaths.some((path) => pathname.startsWith(path))
              : pathname.startsWith(tab.to);
        return (
          <Link key={tab.key} to={tab.to} className={cn("bn-item", active && "active")}>
            <tab.icon aria-hidden="true" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
