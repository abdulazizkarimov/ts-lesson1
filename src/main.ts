import { SIDES, assertIsTrade, type Trade, type TradeSummary } from "./models/index.js";
import * as calc from "./calculations.js";
import { validateTrade } from "./business-rules.js";
import { createTrade, createTrades } from "./data/trades.js";
import { fetchPrice, fetchTrade } from "./api.js";
import writeLine from "./logger.js"; // default import: the name is chosen here, not in logger.ts
import { loadTrades, loadTradesWithZod } from "./load-trades.js";
import { maxBy, sumBy } from "./utils/collections.js";

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

async function main(): Promise<void> {
    const aaplPrice = await fetchPrice("AAPL");
    console.log(`AAPL (top-level await): ${aaplPrice}\n`);
    
    // Resolved relative to this file, so it works from any folder.
    const fileTrades = await loadTrades(new URL("../trades.json", import.meta.url));
    console.log(`Loaded ${fileTrades.length} trades from trades.json: ${fileTrades.map((trade) => trade.id).join(", ")}\n`);

    const zodTrades = await loadTradesWithZod(new URL("../trades.json", import.meta.url));
    console.log(`Zod loaded ${zodTrades.length} trades: ${zodTrades.map((t) => t.id).join(", ")}\n`);

    writeLine("Trade report started");
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

    console.log("\n--- Collection helpers ---");
    const totalQuantity = sumBy(validTrades, (trade) => trade.quantity);
    console.log(`   Total quantity of valid trades: ${totalQuantity}`);

    const largest = maxBy(validTrades, calc.tradeValue);
    console.log(
        largest
            ? `   Highest trade value: ${largest.id} -> ${calc.tradeValue(largest).toFixed(2)}`
            : "   Highest trade value: (no trades)"
    );

    const noTrades: Trade[] = [];
    const largestOfNone = maxBy(noTrades, calc.tradeValue);
    console.log(`   maxBy on an empty array: ${largestOfNone}`);

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

    console.log("\n--- Fetch trades (ApiResult) ---");
    for (const id of ["T1", "T3", "T9"]) {
        const result = await fetchTrade(id);
        if (!result.ok) {
            console.log(`   ${id}: Failed (${result.status}): ${result.error}`);
            continue;
        }
        // Narrowed to { ok: true; data: Trade } here.
        console.log(`   ${id}: Trade value: ${calc.tradeValue(result.data).toFixed(2)}`);
    }

    console.log("\n--- assertIsTrade ---");
    const notATrade: unknown = { id: "X" };
    try {
        assertIsTrade(notATrade);
        // Only reached if the assertion passes; notATrade is a Trade here.
        console.log(`   Valid trade: ${notATrade.symbol}`);
    } catch (error) {
        console.log(`   ${errorMessage(error)}`);
    }

    console.log("\n--- Test data builder (createTrade) ---");
    const freeSell = createTrade({ id: "B1", side: "sell", commissionPercent: 0 });
    const canceled = createTrade({ id: "B2", canceledAt: "2026-11-20" });
    for (const trade of [freeSell, canceled]) {
        console.log(`   ${trade.id}: ${trade.side} ${trade.quantity} ${trade.symbol} @ ${trade.price}, commission ${trade.commissionPercent ?? "none"}, canceled ${trade.canceledAt ?? "no"} -> value ${calc.tradeValue(trade).toFixed(2)}`);
    }

    console.log("\n--- Trade summaries (Pick) ---");
    const summaries: TradeSummary[] = validTrades.map(({ id, symbol, side }) => ({ id, symbol, side }));
    console.table(summaries);
}

main().catch((error: unknown) => {
    console.error(`Unexpected error: ${errorMessage(error)}`);
    process.exitCode = 1;
});
