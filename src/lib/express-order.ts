import type { TranslationKey } from "./i18n";

/**
 * Pure helpers for the express order form on the product page.
 *
 * The database is still the authority: `place_order()` re-validates the phone,
 * prices every line from the catalogue and computes the delivery fee. These
 * checks only catch mistakes early, in the buyer's language, before a round trip.
 */

/** Digits and a leading "+" only, so "05 55 12-34-56" and "+213 555..." compare equal. */
function cleanPhone(raw: string): string {
  return raw.replace(/[^\d+]/g, "");
}

/**
 * Same rule as `is_valid_dz_phone()` in schema.sql: a mobile (05/06/07 + 8
 * digits) or a landline (02/03/04 + 7-8 digits), with or without +213.
 */
export function isValidDzPhone(raw: string): boolean {
  const p = cleanPhone(raw);
  return (
    /^0[5-7]\d{8}$/.test(p) ||
    /^\+?213[5-7]\d{8}$/.test(p) ||
    /^0[2-4]\d{7,8}$/.test(p) ||
    /^\+?213[2-4]\d{7,8}$/.test(p)
  );
}

/** "+213 555 12 34 56" becomes "0555123456", the form the shop calls back. */
export function normalisePhone(raw: string): string {
  const p = cleanPhone(raw);
  return /^\+?213/.test(p) ? `0${p.replace(/^\+?213/, "")}` : p;
}

/**
 * The address sent with the order. The form keeps it optional, as the YouCan
 * shop did, because the courier calls before delivering; the database needs at
 * least five characters, so commune and wilaya stand in when it is left empty.
 */
export function orderAddress(typed: string, commune: string, wilaya: string): string {
  const own = typed.trim();
  if (own.length >= 5) return own;
  return [own, commune, wilaya].filter(Boolean).join("، ");
}

/** Maps a refusal from `place_order()` to a sentence the buyer can act on. */
export function orderErrorKey(message: string | null, code?: string): TranslationKey {
  if (code === "phone_blocked") return "checkout.error.phone_blocked";
  if (code === "too_many_pending") return "checkout.error.too_many_pending";
  const text = (message ?? "").toLowerCase();
  if (text.includes("phone")) return "express.phoneInvalid";
  if (text.includes("stock")) return "express.noStock";
  if (text.includes("unavailable") || text.includes("does not exist")) return "express.unavailable";
  return "express.failed";
}
