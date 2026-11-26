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
