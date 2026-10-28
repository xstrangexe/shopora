import { describe, expect, it } from "vitest";
import type { CatalogueVariant } from "./queries";
import {
  colourOptions,
  findVariant,
  imagesForColour,
  coloursForModel,
  initialChoice,
  modelOptions,
  sizeAfterColourChange,
  sizeOptions,
} from "./variant-options";

let seq = 0;
function v(color: string | null, size: string | null, stock: number, urls: string[] = []) {
  seq += 1;
  return {
    id: `v${seq}`,
    size,
    color_name: color,
    color_hex: color ? "#000000" : null,
    sku: null,
    price: 2500,
    stock,
    is_active: true,
    sort_order: seq,
    variant_images: urls.map((url, i) => ({ id: `${url}-${seq}`, url, alt: null, sort_order: i })),
  } satisfies CatalogueVariant;
}

const polo = [
  v("Noir", "XL", 2, ["noir-1", "noir-2"]),
  v("Noir", "S", 0, ["noir-1", "noir-2"]),
  v("Noir", "M", 5, ["noir-1", "noir-2"]),
  v("Blanc", "M", 0, ["blanc-1"]),
  v("Blanc", "L", 3, ["blanc-1"]),
];

describe("fixed model list", () => {
  it("keeps every model and marks the ones the colour lacks", () => {
    expect(modelOptions(polo, "Blanc").map((s) => [s.name, s.inStock])).toEqual([
      ["S", false],
      ["M", false],
      ["L", true],
      ["XL", false],
    ]);
  });

  it("marks the colours a model does not come in", () => {
    const marked = coloursForModel(colourOptions(polo), polo, "L");
    expect(marked.map((c) => [c.name, c.inStock])).toEqual([
      ["Noir", false],
      ["Blanc", true],
    ]);
  });
});

describe("variant options", () => {
  it("lists each colour once, in stock if any size is", () => {
    expect(colourOptions(polo).map((c) => [c.name, c.inStock])).toEqual([
      ["Noir", true],
      ["Blanc", true],
    ]);
  });

  it("orders sizes the way people read them, per colour", () => {
    expect(sizeOptions(polo, "Noir").map((s) => s.name)).toEqual(["S", "M", "XL"]);
    expect(sizeOptions(polo, "Noir").find((s) => s.name === "S")?.inStock).toBe(false);
  });

  it("opens on a buyable colour but leaves the size for the buyer to pick", () => {
    expect(initialChoice(polo)).toEqual({ colour: "Noir", size: null });
  });

  it("picks the size itself when there is only one", () => {
    expect(initialChoice([v("Noir", "M", 2)])).toEqual({ colour: "Noir", size: "M" });
  });

  it("keeps the size across a colour change only when it is in stock there", () => {
    expect(sizeAfterColourChange(polo, "Blanc", "L")).toBe("L");
    expect(sizeAfterColourChange(polo, "Blanc", "M")).toBeNull();
    expect(sizeAfterColourChange(polo, "Noir", "L")).toBeNull();
  });

  it("finds the exact variant", () => {
    expect(findVariant(polo, "Blanc", "L")?.stock).toBe(3);
    expect(findVariant(polo, "Blanc", "XL")).toBeNull();
  });

  it("shows one colour's photos, without duplicates", () => {
    expect(imagesForColour(polo, "Noir")).toEqual(["noir-1", "noir-2"]);
    expect(imagesForColour(polo, null)).toEqual(["noir-1", "noir-2", "blanc-1"]);
  });

  it("handles products with sizes only", () => {
    const sizesOnly = [v(null, "L", 1), v(null, "M", 1)];
    expect(colourOptions(sizesOnly)).toEqual([]);
    expect(sizeOptions(sizesOnly, null).map((s) => s.name)).toEqual(["M", "L"]);
  });
});
