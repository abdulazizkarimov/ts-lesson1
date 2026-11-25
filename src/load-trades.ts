import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { isTrade, type Trade } from "./models/index.js";
import { parseArray } from "./utils/validation.js";

export async function loadTrades(path: string | URL): Promise<Trade[]> {
    const text = await readFile(path, "utf-8");

    try {
        const data: unknown = JSON.parse(text);
        return parseArray(data, isTrade, "trade");
    } catch (error) {
        const file = path instanceof URL ? fileURLToPath(path) : path;
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${file}: ${message}`, { cause: error });
    }
}
