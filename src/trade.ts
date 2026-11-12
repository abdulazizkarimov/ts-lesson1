type Side = "buy" | "sell";

interface Trade {
    readonly id: string;
    symbol: string;
    side: Side;
    quantity: number;
    price: number;
    commissionPercent?: number;
}

function tradeValue(trade: Trade): number {
    const subtotal = trade.quantity * trade.price;
    const commission = (subtotal * (trade.commissionPercent ?? 0)) / 100;

    switch (trade.side) {
        case "buy":
            return subtotal + commission;
        case "sell":
            return subtotal - commission;
        default: {
            const unhandled: never = trade.side;
            throw new Error(`Unhandled side: ${unhandled}`);
        }
    }
}

function validateTrade(trade: Trade): string[] {
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

function printPosition(item: { symbol: string; quantity: number }): void {
    console.log(`Position: ${item.quantity} x ${item.symbol}`);
}

const trades: Trade[] = [
  { id: "T1", symbol: "AAPL", side: "buy", quantity: 10, price: 150, commissionPercent: 1 },
  { id: "T2", symbol: "AAPL", side: "sell", quantity: 10, price: 160, commissionPercent: 1 },
  { id: "T3", symbol: "MSFT", side: "buy", quantity: 5, price: 400 }, // no commission
  { id: "T4", symbol: "", side: "sell", quantity: 2.5, price: -10 }, // invalid
  { id: "T5", symbol: "TSLA", side: "sell", quantity: 3, price: 250, commissionPercent: 0.5 },
];

for (const t of trades) {
  const errors = validateTrade(t);

  if (errors.length > 0) {
    console.log(`${t.id} -> INVALID:\n- ${errors.join("\n- ")}`);
    continue;
  }
  
  console.log(`${t.id} -> VALID: Trade value: ${tradeValue(t).toFixed(2)}`);
}

printPosition(trades[0]);