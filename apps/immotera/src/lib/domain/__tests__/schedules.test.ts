import { describe, expect, it } from "vitest";
import { generateMonthlySchedules } from "../schedules";

describe("rent schedules", () => {
  it("generates immutable monthly periods", () => {
    const schedules = generateMonthlySchedules({ startDate: new Date("2026-01-15T00:00:00Z"), endDate: new Date("2026-03-31T00:00:00Z"), dueDay: 31, rent: 500_000, charges: 25_000 });
    expect(schedules).toHaveLength(3);
    expect(schedules[1]?.dueDate.toISOString().slice(0, 10)).toBe("2026-02-28");
    expect(schedules[0]?.balance).toBe(525_000);
  });
});
