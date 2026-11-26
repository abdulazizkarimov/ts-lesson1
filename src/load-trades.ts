import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { TradeSchema, isTrade, type Trade } from "./models/index.js";
import { parseArray } from "./utils/parsing.js";

function displayPath(path: string | URL): string {
    return path instanceof URL ? fileURLToPath(path) : path;
}

export async function loadTrades(path: string | URL): Promise<Trade[]> {
    const text = await readFile(path, "utf-8");

    try {
        const data: unknown = JSON.parse(text);
        return parseArray(data, isTrade, "trade");
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${displayPath(path)}: ${message}`, { cause: error });
    }
}

export async function loadTradesWithZod(path: string | URL): Promise<Trade[]> {
    const file = displayPath(path);
    const text = await readFile(path, "utf-8");

    let data: unknown;
    try {
        data = JSON.parse(text);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${file}: ${message}`, { cause: error });
    }

    const result = z.array(TradeSchema).safeParse(data);

    if (!result.success) {
        const details = result.error.issues
            .map((issue) => `${issue.path.map(String).join(".") || "(root)"}: ${issue.message}`)
            .join("\n- ");
        throw new Error(`${file}: invalid trades\n- ${details}`, { cause: result.error });
    }

    return result.data;
}
