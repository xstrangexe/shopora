import type { CatalogueProduct } from "./queries";

/**
 * iPhone models as SHOPORA stores them in the variant "size": "15 PRO MAX",
 * "iPhone 15 Pro Max", "13", "14 PRO". Read into a number and a type so the home
 * page's model finder can show only the cases that fit a buyer's phone.
 */
export type PhoneType = "base" | "plus" | "pro" | "pro max";
export type PhoneModel = { number: number; type: PhoneType };

const TYPE_ORDER: PhoneType[] = ["base", "plus", "pro", "pro max"];

export function parseModel(size: string | null | undefined): PhoneModel | null {
  if (!size) return null;
  const s = size
    .toLowerCase()
    .replace(/iphone/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const m = s.match(/^(\d{1,2})(?:\s*(pro max|pro|plus))?$/);
  if (!m) return null;
  return { number: Number(m[1]), type: (m[2] as PhoneType | undefined) ?? "base" };
}

/** "15 Pro Max", "13" — how the finder labels a model. */
export function modelLabel(model: PhoneModel): string {
  const type = { base: "", plus: " Plus", pro: " Pro", "pro max": " Pro Max" }[model.type];
  return `iPhone ${model.number}${type}`;
}

/** Every model that at least one in-stock variant fits, sorted 11 → 17, base → Pro Max. */
export function availableModels(products: CatalogueProduct[]): PhoneModel[] {
  const seen = new Map<string, PhoneModel>();
  for (const product of products) {
    for (const variant of product.product_variants) {
      if (variant.stock <= 0) continue;
      const model = parseModel(variant.size);
      if (model) seen.set(`${model.number}|${model.type}`, model);
    }
  }
  return [...seen.values()].sort(
    (a, b) => a.number - b.number || TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type),
  );
}

/** Products with an in-stock variant for exactly this model. */
export function productsForModel(
  products: CatalogueProduct[],
  model: PhoneModel,
): CatalogueProduct[] {
  return products.filter((product) =>
    product.product_variants.some((variant) => {
      if (variant.stock <= 0) return false;
      const m = parseModel(variant.size);
      return m !== null && m.number === model.number && m.type === model.type;
    }),
  );
}

/** "11 Pro Max → 17 Pro Max" for a product, or null when it has no phone models. */
export function modelRange(product: CatalogueProduct): string | null {
  const models = availableModels([product]);
  if (models.length === 0) return null;
  const first = modelLabel(models[0]).replace("iPhone ", "");
  const last = modelLabel(models[models.length - 1]).replace("iPhone ", "");
  return first === last ? first : `${first} → ${last}`;
}
