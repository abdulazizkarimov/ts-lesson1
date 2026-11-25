export function parseArray<T>(
    data: unknown,
    guard: (x: unknown) => x is T,
    label: string,
): T[] {
    if (!Array.isArray(data)) {
        throw new Error(`Expected an array of ${label} items, got ${typeof data}`);
    }
    const items: unknown[] = data;

    if (!items.every(guard)) {
        const badIndex = items.findIndex((item) => !guard(item));
        throw new Error(`Invalid ${label} at index ${badIndex}: ${JSON.stringify(items[badIndex])}`);
    }
    return items;
}
