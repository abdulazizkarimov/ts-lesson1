import type { ApiResult, Trade } from "./models/index.js";
import { createTrades } from "./data/trades.js";

export const PRICES: Record<string, number> = { AAPL: 150, MSFT: 400, TSLA: 250 };

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPrice(symbol: string): Promise<number> {
    
    await sleep(500); // pretend this is a network call
    
    const price = PRICES[symbol];
    if (price === undefined) {
        throw new Error(`Unknown symbol: ${symbol}`);
    }
    return price;
}

export async function fetchTrade(id: string): Promise<ApiResult<Trade>> {
    await sleep(200); // pretend this is a network call

    const trade = createTrades().find((t) => t.id === id);
    if (trade === undefined) {
        return { ok: false, status: 404, error: `Trade ${id} not found` };
    }
    if (trade.canceledAt !== null) {
        return { ok: false, status: 410, error: `Trade ${id} was canceled` };
    }
    return { ok: true, data: trade };
}
