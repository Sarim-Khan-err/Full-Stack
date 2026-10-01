"use strict";

function isPrime(number) {
  if (number < 2) return false;
  for (let divisor = 2; divisor * divisor <= number; divisor++) {
    if (number % divisor === 0) return false;
  }
  return true;
}

function nextPrimeAfter(givenPrime) {
  if (!isPrime(givenPrime)) {
    throw new TypeError("Input must be a prime number.");
  }
  let candidate = givenPrime + 1;
  while (!isPrime(candidate)) candidate++;
  return candidate;
}

var givenPrime = 11;
console.log("Prime after " + givenPrime + " is " + nextPrimeAfter(givenPrime));
