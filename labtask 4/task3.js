"use strict";

function formatPhoneNumber(digits) {
  if (!Array.isArray(digits) || digits.length !== 10 ||
      !digits.every(function (digit) {
        return Number.isInteger(digit) && digit >= 0 && digit <= 9;
      })) {
    throw new TypeError("Provide exactly 10 integers between 0 and 9.");
  }

  return "(" + digits.slice(0, 3).join("") + ") " +
    digits.slice(3, 6).join("") + "-" + digits.slice(6).join("");
}

var digits = [2, 1, 2, 5, 5, 5, 0, 1, 2, 3];
console.log(formatPhoneNumber(digits));
