/**
 * Locale handling.
 *
 * Arabic is the default and the reference dictionary. `TranslationKey` is
 * derived from it, so every other locale is forced by the compiler to cover the
 * same keys — a missing translation becomes a build failure, not a blank label.
 *
 * SHOPORA opens in Arabic on every new visit, whatever the phone's language. A
 * buyer who switches to French or English keeps that choice for the rest of the
 * visit only: it lives in a session cookie (mirrored in `sessionStorage`), so the
 * server renders the chosen language from the first byte, and the next visit
 * starts in Arabic again.
 */

import { ar } from "./locales/ar";
import { fr } from "./locales/fr";
import { en } from "./locales/en";

export type Locale = "ar" | "fr" | "en";

export const LOCALES: readonly Locale[] = ["ar", "fr", "en"];
export const DEFAULT_LOCALE: Locale = "ar";

export type TranslationKey = keyof typeof ar;

const LOCALE_DIR: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  fr: "ltr",
  en: "ltr",
};

const HTML_LANG: Record<Locale, string> = { ar: "ar", fr: "fr", en: "en" };

/** Endonym, so the switcher reads correctly whichever locale you are in. */
export const LOCALE_LABEL: Record<Locale, string> = {
  ar: "العربية",
  fr: "Français",
  en: "English",
};

const DICTS: Record<Locale, Record<TranslationKey, string>> = { ar, fr, en };

// Renamed from "openstore-locale" so year-long choices saved by the old
// behaviour no longer apply: everyone starts again in Arabic.
const STORAGE_KEY = "shopora-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Replace `{name}` placeholders. Unknown placeholders are left untouched. */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = vars[key];
    return value === undefined ? match : String(value);
  });
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  const dict = DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
  const template = dict[key] ?? DICTS[DEFAULT_LOCALE][key] ?? key;
  return interpolate(template, vars);
}

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  return isLocale(raw) ? raw : null;
}

export function persistLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, locale);
  // The cookie is what lets the server render the next page in this language,
  // instead of rendering Arabic and switching after load. No max-age: it ends
  // with the visit, so the next visit opens in Arabic.
  document.cookie = `${STORAGE_KEY}=${locale}; path=/; samesite=lax`;
}

export function hasLocaleCookie(): boolean {
  return typeof document !== "undefined" && document.cookie.includes(`${STORAGE_KEY}=`);
}

/** Apply `lang` and `dir` to `<html>`. Called on every locale change. */
export function applyLocaleToDocument(locale: Locale): void {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.setAttribute("lang", HTML_LANG[locale]);
  html.setAttribute("dir", LOCALE_DIR[locale]);
}

/**
 * Inline script so the first paint is already in the right direction. The cookie
 * is the server's own decision, so it wins; the choice stored for this visit is
 * the fallback. With neither it leaves `<html>` alone: the server already
 * rendered Arabic, right to left.
 */
export const localeBootstrapScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${STORAGE_KEY}=(ar|fr|en)/);var l=m?m[1]:sessionStorage.getItem("${STORAGE_KEY}");if(l==="ar"||l==="fr"||l==="en"){document.documentElement.setAttribute("lang",l);document.documentElement.setAttribute("dir",l==="ar"?"rtl":"ltr");}}catch(e){}})();`;

/**
 * Pick the owner's text for a locale. Catalogue rows carry Arabic and a Latin
 * (French) version; English readers get the Latin one too, which they can read,
 * rather than Arabic they mostly cannot. Falls back to Arabic when no Latin text
 * was written.
 */
export function localized(locale: Locale, arabic: string, latin: string | null | undefined) {
  return locale !== "ar" && latin ? latin : arabic;
}
