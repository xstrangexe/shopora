import { describe, expect, it } from "vitest";
import type { CatalogueProduct } from "./queries";
import {
  availableModels,
  modelLabel,
  modelRange,
  parseModel,
  productsForModel,
} from "./phone-models";

function product(id: string, sizes: [string | null, number][]): CatalogueProduct {
  return {
    id,
    slug: id,
    name: id,
    product_variants: sizes.map(([size, stock], i) => ({
      id: `${id}-${i}`,
      size,
      color_name: null,
      price: 2500,
      stock,
    })),
  } as unknown as CatalogueProduct;
}

describe("parseModel", () => {
  it("reads every way the shop writes a model", () => {
    expect(parseModel("15 PRO MAX")).toEqual({ number: 15, type: "pro max" });
    expect(parseModel("iPhone 13 Pro Max")).toEqual({ number: 13, type: "pro max" });
    expect(parseModel("14 PRO")).toEqual({ number: 14, type: "pro" });
    expect(parseModel("17")).toEqual({ number: 17, type: "base" });
    expect(parseModel("16 plus")).toEqual({ number: 16, type: "plus" });
  });

  it("ignores sizes that are not phone models", () => {
    expect(parseModel("XL")).toBeNull();
    expect(parseModel(null)).toBeNull();
  });
});

describe("model finder", () => {
  const snake = product("snake", [
    ["15 PRO MAX", 3],
    ["16 PRO MAX", 0],
    ["13 PRO MAX", 2],
  ]);
  const magsafe = product("magsafe", [
    ["15", 5],
    ["15 PRO", 1],
    ["15 PRO MAX", 4],
  ]);
  const box = product("aurabox", [[null, 9]]);

  it("lists models that are in stock, in reading order", () => {
    expect(availableModels([snake, magsafe, box]).map(modelLabel)).toEqual([
      "iPhone 13 Pro Max",
      "iPhone 15",
      "iPhone 15 Pro",
      "iPhone 15 Pro Max",
    ]);
  });

  it("finds the products that fit one model, and skips sold-out variants", () => {
    expect(
      productsForModel([snake, magsafe, box], { number: 15, type: "pro max" }).map((p) => p.id),
    ).toEqual(["snake", "magsafe"]);
    expect(productsForModel([snake, magsafe], { number: 16, type: "pro max" })).toEqual([]);
  });

  it("describes a product's model range", () => {
    expect(modelRange(snake)).toBe("13 Pro Max → 15 Pro Max");
    expect(modelRange(box)).toBeNull();
  });
});
