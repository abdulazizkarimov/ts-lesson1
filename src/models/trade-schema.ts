import { z } from "zod";
import { SIDES, type Trade } from "./trade.js";

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

export function isTrade(x: unknown): x is Trade {
    return TradeSchema.safeParse(x).success;
}

export function assertIsTrade(x: unknown): asserts x is Trade {
    if (!isTrade(x)) {
        throw new Error(`Not a valid trade: ${JSON.stringify(x)}`);
    }
}
