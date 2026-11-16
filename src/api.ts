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
