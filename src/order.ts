function calculateOrderTotal(price: number, quantity: number, commissionPercent: number): number {
    const subtotal: number = price * quantity;
    const commission = subtotal * (commissionPercent / 100);
    return subtotal + commission;
}

const cases: [number, number, number][] = [
    [100, 3, 5],
    [19.99, 2, 10],
    [250, 1, 0],
    [10897.33, 12, 7.5],
];

for (const [price, quantity, commissionPercent] of cases) {
    const total = calculateOrderTotal(price, quantity, commissionPercent);
    console.log(`Price: ${price}, Quantity: ${quantity}, Commission: ${commissionPercent}% -> Total: ${total.toFixed(2)}`);
}

console.log(0.1 + 0.2);