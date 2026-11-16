import type { Trade } from "../models/index.js";

export function createTrades(): Trade[] {
    return [
        { id: "T1", symbol: "AAPL", side: "buy", quantity: 10, price: 150, commissionPercent: 1, note: "Opening position", canceledAt: null },
        { id: "T2", symbol: "AAPL", side: "sell", quantity: 10, price: 160, commissionPercent: 1, canceledAt: null },
        { id: "T3", symbol: "MSFT", side: "buy", quantity: 5, price: 400, canceledAt: "2026-11-10" }, // no commission
        { id: "T4", symbol: "", side: "sell", quantity: 2.5, price: -10, canceledAt: null }, // invalid
        { id: "T5", symbol: "TSLA", side: "sell", quantity: 3, price: 250, commissionPercent: 0.5, note: "Partial take-profit", canceledAt: null },
    ];
}
