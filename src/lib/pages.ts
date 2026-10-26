/**
 * The shop's information pages (about, FAQ, delivery, payment, returns, terms,
 * privacy, contact), carried over from the YouCan shop.
 *
 * Each page is a text file in `src/content/pages`: the first line is the title,
 * and the body uses three conventions, `## ` for a heading, `• ` for a list item,
 * anything else is a paragraph. They are Arabic only, like the YouCan originals.
 * Slugs match the YouCan URLs (/pages/<slug>) so old links keep working once the
 * domain points here.
 */

const files = import.meta.glob("../content/pages/*.txt", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

/** Footer order. */
const ORDER = [
  "about-us",
  "faq",
  "shipping-delivery",
  "how-to-pay",
  "return-policy",
  "terms-and-conditions",
  "confidentiality",
  "contact-us",
];

export type InfoPage = { slug: string; title: string; body: string };

const PAGES: InfoPage[] = ORDER.flatMap((slug) => {
  const raw = files[`../content/pages/${slug}.txt`];
  if (!raw) return [];
  const [title, ...rest] = raw.trim().split("\n");
  return [{ slug, title: title.trim(), body: rest.join("\n").trim() }];
});

export function infoPages(): InfoPage[] {
  return PAGES;
}

export function infoPage(slug: string): InfoPage | null {
  return PAGES.find((page) => page.slug === slug) ?? null;
}

export type Block =
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "paragraph"; text: string };

/** Splits a page body into headings, lists and paragraphs. */
export function pageBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  for (const line of body
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)) {
    if (line.startsWith("## ")) {
      blocks.push({ kind: "heading", text: line.slice(3) });
    } else if (line.startsWith("• ")) {
      const last = blocks.at(-1);
      if (last?.kind === "list") last.items.push(line.slice(2));
      else blocks.push({ kind: "list", items: [line.slice(2)] });
    } else {
      blocks.push({ kind: "paragraph", text: line });
    }
  }
  return blocks;
}
