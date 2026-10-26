import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./i18n";

const COOKIE = "shopora-locale";

/**
 * The visitor's language, readable on the server and in the browser alike, so
 * both render the same page. Without it the server always rendered Arabic and
 * a French or English visitor watched the page mirror itself after load.
 */
export const readLocale = createIsomorphicFn()
  .server((): Locale => {
    const raw = getCookie(COOKIE);
    if (isLocale(raw)) return raw;
    // New visit: SHOPORA always opens in Arabic, whatever the browser's language
    // (many Algerian phones are set to French). French and English stay one tap
    // away in the switcher for the rest of the visit. A session cookie, set in the
    // same response so the browser reads what the server rendered.
    setCookie(COOKIE, DEFAULT_LOCALE, { path: "/", sameSite: "lax" });
    return DEFAULT_LOCALE;
  })
  .client((): Locale => {
    const raw = document.cookie
      .split("; ")
      .find((part) => part.startsWith(`${COOKIE}=`))
      ?.split("=")[1];
    return isLocale(raw) ? raw : DEFAULT_LOCALE;
  });
