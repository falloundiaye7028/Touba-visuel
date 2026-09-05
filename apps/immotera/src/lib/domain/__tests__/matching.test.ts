import { describe, expect, it } from "vitest";
import { matchProperty } from "../matching";

describe("property matching", () => {
  it("scores deterministic criteria", () => {
    const result = matchProperty({ type: "Villa", city: "Dakar", district: "Almadies", rent: 1_500_000, bedrooms: 4, area: 280, amenities: ["Piscine", "Parking"], available: true }, { type: "Villa", areas: ["Almadies"], maxBudget: 1_800_000, bedrooms: 4, minArea: 250, amenities: ["Parking"] });
    expect(result.score).toBe(100);
  });

  it("never recommends an unavailable property", () => {
    expect(matchProperty({ type: "Studio", city: "Dakar", rent: 300_000, available: false }, {}).score).toBe(0);
  });
});
