"use strict";
// ===== 1. Types & constants =====
Object.defineProperty(exports, "__esModule", { value: true });
const SIDES = ["buy", "sell"];
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["New"] = "new";
    OrderStatus["Filled"] = "filled";
    OrderStatus["Canceled"] = "canceled";
})(OrderStatus || (OrderStatus = {}));
var Priority;
(function (Priority) {
    Priority[Priority["Low"] = 0] = "Low";
    Priority[Priority["Medium"] = 1] = "Medium";
    Priority[Priority["High"] = 2] = "High";
})(Priority || (Priority = {}));
// ===== 2. Domain logic (pure functions, no console output) =====
function tradeValue(trade) {
    const subtotal = trade.quantity * trade.price;
    const commission = (subtotal * (trade.commissionPercent ?? 0)) / 100;
    switch (trade.side) {
        case "buy":
            return subtotal + commission;
        case "sell":
            return subtotal - commission;
        default: {
            const unhandled = trade.side;
            throw new Error(`Unhandled side: ${unhandled}`);
        }
    }
}
function validateTrade(trade) {
    const errors = [];
    if (trade.symbol.trim() === "") {
        errors.push("Symbol must not be empty");
    }
    if (!(trade.quantity > 0)) {
        errors.push(`Quantity must be greater than 0 (got ${trade.quantity})`);
    }
    else if (!Number.isInteger(trade.quantity)) {
        errors.push(`Quantity must be a whole number (got ${trade.quantity})`);
    }
    if (!(trade.price > 0)) {
        errors.push(`Price must be greater than 0 (got ${trade.price})`);
    }
    return errors;
}
function describeNote(trade) {
    return trade.note?.toUpperCase() ?? "(no note)";
}
// `||` treats 0 as "missing", so a 0% commission wrongly becomes 0.25.
function effectiveCommissionWrong(trade) {
    return trade.commissionPercent || 0.25;
}
// `??` only falls back on null/undefined, so 0 is kept.
function effectiveCommission(trade) {
    return trade.commissionPercent ?? 0.25;
}
// ===== 3. Generic utilities =====
function isSortedAscending(values) {
    return values.every((value, index) => index === 0 || value >= values[index - 1]);
}
// ===== 4. Output helpers =====
function printPosition(item) {
    console.log(`Position: ${item.quantity} x ${item.symbol}`);
}
function printFirstSellPrice(trades, symbol) {
    const sell = trades.find((trade) => trade.side === "sell" && trade.symbol === symbol);
    console.log(sell
        ? `First ${symbol} sell: price ${sell.price} (${sell.id})`
        : `${symbol}: not found`);
}
// ===== 5. Sample data =====
const trades = [
    { id: "T1", symbol: "AAPL", side: "buy", quantity: 10, price: 150, commissionPercent: 1, note: "Opening position", canceledAt: null },
    { id: "T2", symbol: "AAPL", side: "sell", quantity: 10, price: 160, commissionPercent: 1, canceledAt: null },
    { id: "T3", symbol: "MSFT", side: "buy", quantity: 5, price: 400, canceledAt: "2026-11-10" }, // no commission
    { id: "T4", symbol: "", side: "sell", quantity: 2.5, price: -10, canceledAt: null }, // invalid
    { id: "T5", symbol: "TSLA", side: "sell", quantity: 3, price: 250, commissionPercent: 0.5, note: "Partial take-profit", canceledAt: null },
];
const validTrades = trades.filter((trade) => validateTrade(trade).length === 0);
// ===== 6. Demos (one per topic) =====
function demoValidation() {
    for (const trade of trades) {
        const errors = validateTrade(trade);
        if (errors.length > 0) {
            console.log(`${trade.id} -> INVALID:\n- ${errors.join("\n- ")}`);
            continue;
        }
        console.log(`${trade.id} -> VALID: Trade value: ${tradeValue(trade).toFixed(2)}`);
    }
}
function demoStructuralTyping() {
    // A Trade has `symbol` and `quantity`, so it fits printPosition's parameter type.
    printPosition(trades[0]);
}
function demoArrayMethods() {
    const uniqueSymbols = [...new Set(validTrades.map((trade) => trade.symbol))];
    console.log(`Unique symbols: ${JSON.stringify(uniqueSymbols)}`);
    const totalBought = validTrades
        .filter((trade) => trade.side === "buy")
        .reduce((sum, trade) => sum + tradeValue(trade), 0);
    console.log(`Total bought: ${totalBought.toFixed(2)}`);
    printFirstSellPrice(validTrades, "TSLA");
    printFirstSellPrice(validTrades, "GOOG");
    const allAbove100 = validTrades.every((trade) => trade.price > 100);
    const anyWithoutCommission = validTrades.some((trade) => trade.commissionPercent === undefined);
    console.log(`All valid trades priced above 100? ${allAbove100}`);
    console.log(`Any trade without a commission? ${anyWithoutCommission}`);
    const ranked = validTrades.toSorted((a, b) => tradeValue(b) - tradeValue(a));
    console.log("Ranking by trade value:");
    ranked.forEach((trade, index) => {
        console.log(`   ${index + 1}. ${trade.id} -> ${tradeValue(trade).toFixed(2)}`);
    });
    const summaries = validTrades.map((trade) => `${trade.id}: ${trade.side.toUpperCase()} ${trade.quantity} ${trade.symbol} @ ${trade.price}`);
    console.log("Summaries:");
    summaries.forEach((summary) => console.log(`  ${summary}`));
}
function demoSorting() {
    const sortCases = [[1, 2, 2, 5], [3, 1, 2], []];
    for (const values of sortCases) {
        console.log(`isSortedAscending(${JSON.stringify(values)}) -> ${isSortedAscending(values)}`);
    }
    // Default sort compares as strings: [1, 10, 100, 9].
    console.log([10, 9, 1, 100].sort());
}
function demoGrouping() {
    const bySymbol = Object.groupBy(validTrades, (trade) => trade.symbol);
    console.log("Total quantity by symbol:");
    for (const [symbol, group] of Object.entries(bySymbol)) {
        const totalQuantity = (group ?? []).reduce((sum, trade) => sum + trade.quantity, 0);
        console.log(`   ${symbol}: ${totalQuantity}`);
    }
}
function demoOptionalAndNull() {
    trades.forEach((trade) => console.log(`${trade.id}: ${describeNote(trade)}`));
    const activeTrades = trades.filter((trade) => trade.canceledAt === null);
    console.log(`Active trades: ${activeTrades.map((trade) => trade.id).join(", ")}`);
    // JSON.stringify drops undefined properties but keeps null ones.
    console.log(JSON.stringify({ a: undefined, b: null }));
}
function demoEnums() {
    console.log(OrderStatus.Filled);
    console.log(Object.values(OrderStatus));
    console.log(Priority.High);
    // Numeric enums also map values back to names (reverse mapping): Priority[2] is "High".
    // String enums like OrderStatus don't get this.
    console.log(Priority[2]);
}
function demoSideVariants() {
    for (const side of SIDES) {
        const variant = { ...trades[0], side };
        console.log(`   ${side.toUpperCase()}: ${tradeValue(variant).toFixed(2)}`);
    }
}
function demoNullishVsOr() {
    const commissionFree = { ...trades[0], id: "T6", commissionPercent: 0 };
    console.log(effectiveCommissionWrong(commissionFree));
    console.log(effectiveCommission(commissionFree));
}
// ===== 7. Entry point =====
function main() {
    demoValidation();
    demoStructuralTyping();
    demoArrayMethods();
    demoSorting();
    demoGrouping();
    demoOptionalAndNull();
    demoEnums();
    demoSideVariants();
    demoNullishVsOr();
}
main();
