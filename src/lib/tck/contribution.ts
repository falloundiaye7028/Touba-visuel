import { z } from "zod";

export const tckContributionSchema = z.object({
  memberCode: z.string().trim().min(3).max(80).transform((value) => value.toUpperCase()),
  amount: z.coerce.number().int().min(100).max(1_000_000_000),
  channel: z.string().trim().min(2).max(80),
  externalReference: z.preprocess(
    (value) => typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().min(2).max(160).optional(),
  ),
});
