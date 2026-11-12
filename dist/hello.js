"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function greet(name) {
    return `Hello ${name}!`;
}
const price = 105.5;
const quantity = 3; // type inferred as number, like 'var' in C#
console.log(greet("Abdul Aziz"));
console.log(`Total: ${price * quantity}`);
