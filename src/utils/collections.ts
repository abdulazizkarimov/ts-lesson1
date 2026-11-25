export function sumBy<T>(items: readonly T[], selector: (item: T) => number): number {
    return items.reduce((sum, item) => sum + selector(item), 0);
}

export function maxBy<T>(items: readonly T[], selector: (item: T) => number): T | undefined {
    let bestIndex = -1;
    let bestValue = -Infinity;

    for (const [index, item] of items.entries()) {
        const value = selector(item);
        if (Number.isNaN(value)) {
            continue;
        }
        if (bestIndex === -1 || value > bestValue) {
            bestIndex = index;
            bestValue = value;
        }
    }

    return bestIndex === -1 ? undefined : items[bestIndex];
}
