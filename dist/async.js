"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ===== 1. Constants & data =====
const PRICES = { AAPL: 150, MSFT: 400, TSLA: 250 };
// ===== 2. Generic utilities =====
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// `catch` gives `unknown`, because anything can be thrown, not only Error objects.
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
async function withTimeout(promise, ms) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Timed out after ${ms} ms`)), ms);
    });
    try {
        return await Promise.race([promise, timeout]);
    }
    finally {
        clearTimeout(timer); // stop the timer if the real promise won the race
    }
}
// ===== 3. Simulated API =====
async function fetchPrice(symbol) {
    await sleep(500); // pretend this is a network call
    const price = PRICES[symbol];
    if (price === undefined) {
        throw new Error(`Unknown symbol: ${symbol}`);
    }
    return price;
}
async function placeOrder(symbol) {
    await sleep(300);
    console.log(`Order placed: ${symbol}`);
}
// ===== 4. Demos (one per topic) =====
async function demoAwaitBasics() {
    const price = await fetchPrice("AAPL");
    console.log(`AAPL: ${price}`);
    await placeOrder("AAPL");
    console.log("Checking the order book...");
}
async function demoTryCatch() {
    try {
        const price = await fetchPrice("GOOG");
        console.log(price);
    }
    catch (error) {
        console.log(`Failed: ${errorMessage(error)}`);
    }
}
async function demoSequentialVsParallel() {
    const symbols = ["AAPL", "MSFT", "TSLA"];
    const sequentialStart = Date.now();
    const sequential = [];
    for (const symbol of symbols) {
        sequential.push(await fetchPrice(symbol)); // waits for each one before starting the next
    }
    console.log(`Sequential: ${Date.now() - sequentialStart} ms → ${sequential.join(", ")}`);
    const parallelStart = Date.now();
    const parallel = await Promise.all(symbols.map((symbol) => fetchPrice(symbol))); // all start at once
    console.log(`Promise.all: ${Date.now() - parallelStart} ms → ${parallel.join(", ")}`);
    // Async callback per item; Promise.all waits until every callback has finished.
    await Promise.all(symbols.map(async (symbol) => {
        const price = await fetchPrice(symbol);
        console.log(price);
    }));
    console.log("Done");
}
async function demoAllVsAllSettled() {
    const mixed = ["AAPL", "GOOG", "TSLA"];
    // Promise.all rejects as soon as one promise fails.
    try {
        const prices = await Promise.all(mixed.map((symbol) => fetchPrice(symbol)));
        console.log(prices);
    }
    catch (error) {
        console.log(`Promise.all rejected: ${errorMessage(error)}`);
    }
    // Promise.allSettled always resolves and reports each result separately.
    const results = await Promise.allSettled(mixed.map((symbol) => fetchPrice(symbol)));
    results.forEach((result, index) => {
        const symbol = mixed[index];
        if (result.status === "fulfilled") {
            console.log(`${symbol}: ${result.value}`);
        }
        else {
            console.log(`${symbol}: failed (${errorMessage(result.reason)})`);
        }
    });
}
async function demoWithTimeout() {
    console.log("\n--- withTimeout ---");
    for (const ms of [1000, 100]) {
        const start = Date.now();
        try {
            const price = await withTimeout(fetchPrice("AAPL"), ms);
            console.log(`withTimeout(fetchPrice("AAPL"), ${ms}): ${price} after ${Date.now() - start} ms`);
        }
        catch (error) {
            console.log(`withTimeout(fetchPrice("AAPL"), ${ms}): ${errorMessage(error)} (after ${Date.now() - start} ms)`);
        }
    }
}
// ===== 5. Entry point =====
async function main() {
    await demoAwaitBasics();
    await demoTryCatch();
    await demoSequentialVsParallel();
    await demoAllVsAllSettled();
    await demoWithTimeout();
}
main();
