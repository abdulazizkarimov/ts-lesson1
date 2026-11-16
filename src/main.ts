import { SIDES } from "./models/index.js";
import type { Trade } from "./models/index.js";
import * as calc from "./calculations.js"
import { validateTrade } from "./validation.js";
import { createTrades } from "./data/trades.js";
import { fetchPrice } from "./api.js";

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

async function main(): Promise<void> {
    const trades: Trade[] = createTrades();

    console.log("--- Validation ---");
    for (const trade of trades) {
        const errors = validateTrade(trade);
        if (errors.length > 0) {
            console.log(`${trade.id} -> INVALID:\n- ${errors.join("\n- ")}`);
            continue;
        }
        console.log(`${trade.id} -> VALID: Trade value: ${calc.tradeValue(trade).toFixed(2)}`);
    }

    const validTrades = trades.filter((trade) => validateTrade(trade).length === 0);

    console.log("\n--- Side variants of T1 ---");
    for (const side of SIDES) {
        const variant: Trade = { ...trades[0], side };
        console.log(`   ${side.toUpperCase()}: ${calc.tradeValue(variant).toFixed(2)}`);
    }

    console.log("\n--- Effective commission ---");
    for (const trade of validTrades) {
        console.log(`   ${trade.id}: ${calc.effectiveCommission(trade)}%`);
    }

    console.log("\n--- Live prices ---");
    const symbols = [...new Set(validTrades.map((trade) => trade.symbol)), "GOOG"];
    const results = await Promise.allSettled(symbols.map((symbol) => fetchPrice(symbol)));
    results.forEach((result, index) => {
        const symbol = symbols[index];
        console.log(
            result.status === "fulfilled"
                ? `   ${symbol}: ${result.value}`
                : `   ${symbol}: failed (${errorMessage(result.reason)})`
        );
    });
}

const aaplPrice = await fetchPrice("AAPL");
console.log(`AAPL (top-level await): ${aaplPrice}\n`);

main().catch((error: unknown) => {
    console.error(`Unexpected error: ${errorMessage(error)}`);
});
