export const SIDES = ["buy", "sell"] as const;
export type Side = (typeof SIDES)[number];

export interface Trade {
    readonly id: string;
    symbol: string;
    side: Side;
    quantity: number;
    price: number;
    commissionPercent?: number;
    note?: string;
    canceledAt: string | null;
}

export type NewTrade = Omit<Trade, "id">;

export type TradeSummary = Pick<Trade, "id" | "symbol" | "side">;

function isSide(x: unknown): x is Side {
    return SIDES.some((side) => side === x);
}

export function isTrade(x: unknown): x is Trade {
    if (typeof x !== "object" || x === null) {
        return false;
    }
    const t = x as Record<string, unknown>;

    return (
        typeof t.id === "string" &&
        typeof t.symbol === "string" &&
        isSide(t.side) &&
        typeof t.quantity === "number" &&
        typeof t.price === "number" &&
        (t.commissionPercent === undefined || typeof t.commissionPercent === "number") &&
        (t.note === undefined || typeof t.note === "string") &&
        (t.canceledAt === null || typeof t.canceledAt === "string")
    );
}

export function assertIsTrade(x: unknown): asserts x is Trade {
    if (!isTrade(x)) {
        throw new Error(`Not a valid trade: ${JSON.stringify(x)}`);
    }
}
