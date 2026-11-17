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