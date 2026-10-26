import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { trackPageView } from "@/lib/pixels";

/**
 * Sends a page view to the ad pixels on every storefront navigation.
 *
 * The app changes pages without reloading, so the pixels' own automatic page
 * view would only ever see the first page. The owner's screens are left out:
 * an ad audience of the shop owner is noise.
 */
export function PixelPageViews() {
  const path = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    if (/^\/(admin|login|setup)(\/|$)/.test(path)) return;
    trackPageView();
  }, [path]);

  return null;
}
