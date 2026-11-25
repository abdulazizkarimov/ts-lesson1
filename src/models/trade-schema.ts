import { z } from "zod";
import { SIDES } from "./trade.js";

export const TradeSchema = z.object({
    id: z.string(),
    symbol: z.string(),
    side: z.enum(SIDES),
    quantity: z.number(),
    price: z.number(),
    commissionPercent: z.number().optional(),
    note: z.string().optional(),
    canceledAt: z.string().nullable(),
});

export type ParsedTrade = z.infer<typeof TradeSchema>;
