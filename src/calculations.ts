import type { Trade } from "./models/index.js";

export function tradeValue(trade: Trade): number {
    const subtotal = trade.quantity * trade.price;
    const commission = (subtotal * (trade.commissionPercent ?? 0)) / 100;

    switch (trade.side) {
        case "buy":
            return subtotal + commission;
        case "sell":
            return subtotal - commission;
        default: {
            const unhandled: never = trade.side;
            throw new Error(`Unhandled side: ${unhandled}`);
        }
    }
}

export function effectiveCommission(trade: Trade): number {
    return trade.commissionPercent ?? 0.25;
}
