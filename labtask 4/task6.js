"use strict";

function sumMultiples(x, y, z) {
  if (!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(z) ||
      x <= 0 || y <= 0 || z < 0) {
    throw new TypeError("x and y must be positive integers; z must be a non-negative integer.");
  }

  var sum = 0;
  for (let number = 1; number < z; number++) {
    if (number % x === 0 || number % y === 0) sum += number;
  }
  return sum;
}

console.log("Sum of multiples of 3 or 5 below 10:", sumMultiples(3, 5, 10));
