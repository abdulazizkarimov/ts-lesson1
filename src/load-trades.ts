import { readFile } from "node:fs/promises";
import { SIDES } from "./models/index.js";
import type { Side, Trade } from "./models/index.js";

function isSide(x: unknown): x is Side {
    return SIDES.some((side) => side === x);
}

export function isTrade(x: unknown): x is Trade {
    if (typeof x !== "object" || x === null) {
        return false;
    }
    const t = x as Record<string, unknown>;

    return (
        typeof t.id === "string" &&
        typeof t.symbol === "string" &&
        isSide(t.side) &&
        typeof t.quantity === "number" &&
        typeof t.price === "number" &&
        (t.commissionPercent === undefined || typeof t.commissionPercent === "number") &&
        (t.note === undefined || typeof t.note === "string") &&
        (t.canceledAt === null || typeof t.canceledAt === "string")
    );
}

export async function loadTrades(path: string): Promise<Trade[]> {
    const text = await readFile(path, "utf-8");
    const data: unknown = JSON.parse(text);

    if (!Array.isArray(data)) {
        throw new Error(`${path}: expected an array of trades, got ${typeof data}`);
    }

    // every() with a type guard narrows the array itself to Trade[].
    if (!data.every(isTrade)) {
        const badIndex = data.findIndex((item) => !isTrade(item));
        throw new Error(`${path}: item at index ${badIndex} is not a valid trade: ${JSON.stringify(data[badIndex])}`);
    }

    return data;
}
