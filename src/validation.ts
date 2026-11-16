import type { Trade } from "./models/index.js";

export function validateTrade(trade: Trade): string[] {
    const errors: string[] = [];

    if (trade.symbol.trim() === "") {
        errors.push("Symbol must not be empty");
    }

    if (!(trade.quantity > 0)) {
        errors.push(`Quantity must be greater than 0 (got ${trade.quantity})`);
    } else if (!Number.isInteger(trade.quantity)) {
        errors.push(`Quantity must be a whole number (got ${trade.quantity})`);
    }

    if (!(trade.price > 0)) {
        errors.push(`Price must be greater than 0 (got ${trade.price})`);
    }

    return errors;
}
