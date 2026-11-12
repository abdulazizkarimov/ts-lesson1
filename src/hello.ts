function greet(name: string): string {
    return `Hello ${name}!`;
}

const price: number = 105.5;
const quantity = 3; // type inferred as number, like 'var' in C#

console.log(greet("Abdul Aziz"));
console.log(`Total: ${price * quantity}`);
