import { describe, expect, it } from "vitest";
import { splitDescription } from "./description";

describe("splitDescription", () => {
  it("separates the pitch from the ticked selling points", () => {
    const parts = splitDescription(
      "🔥 حوّل آيفونك!\nكوفر ماغسيف فاخر.\n\n✔️ مغناطيس MagSafe\n✔️ زوايا مقوّية\n- الدفع عند الاستلام",
    );
    expect(parts.intro).toEqual(["🔥 حوّل آيفونك!", "كوفر ماغسيف فاخر."]);
    expect(parts.points).toEqual(["مغناطيس MagSafe", "زوايا مقوّية", "الدفع عند الاستلام"]);
  });

  it("keeps a plain description whole, with no points", () => {
    const parts = splitDescription("Une coque simple.\nPour iPhone 13.");
    expect(parts.intro).toEqual(["Une coque simple.", "Pour iPhone 13."]);
    expect(parts.points).toEqual([]);
  });

  it("drops a marker with nothing after it", () => {
    expect(splitDescription("✔️\n✔️ MagSafe").points).toEqual(["MagSafe"]);
  });
});
