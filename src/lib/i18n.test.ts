import { describe, expect, it } from "vitest";
import { localeBootstrapScript } from "./i18n";

/** Run the inline script against a fake document and return what it set on <html>. */
function runBootstrap(cookie: string, stored: string | null, html: Record<string, string>) {
  const document = {
    cookie,
    documentElement: { setAttribute: (k: string, v: string) => (html[k] = v) },
  };
  const sessionStorage = { getItem: () => stored };
  new Function("document", "sessionStorage", localeBootstrapScript)(document, sessionStorage);
  return html;
}

describe("localeBootstrapScript", () => {
  it("leaves the server's Arabic alone on a new visit with nothing stored", () => {
    const html = runBootstrap("", null, { lang: "ar", dir: "rtl" });
    expect(html).toEqual({ lang: "ar", dir: "rtl" });
  });

  it("ignores the old year-long cookie", () => {
    const html = runBootstrap("openstore-locale=fr", null, { lang: "ar", dir: "rtl" });
    expect(html).toEqual({ lang: "ar", dir: "rtl" });
  });

  it("prefers the cookie over the stored choice", () => {
    const html = runBootstrap("a=1; shopora-locale=fr", "ar", {});
    expect(html).toEqual({ lang: "fr", dir: "ltr" });
  });

  it("falls back to the stored choice, and sets rtl for Arabic", () => {
    expect(runBootstrap("", "ar", {})).toEqual({ lang: "ar", dir: "rtl" });
  });
});
