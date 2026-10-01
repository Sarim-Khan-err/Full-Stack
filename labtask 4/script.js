"use strict";

// Task 1: primitive variables, a nested object, and a selected-field biography.
// Replace these sample values with your own details before submitting.
var name = "Sarim Khan";                 // string
var age = 21;                            // number (sample age)
var isStudent = true;                    // boolean
var favoriteSubject = "Web Development"; // string
var contactNumber;                       // undefined
var address = {
  city: "Karachi",
  country: "Pakistan",
  postalCode: "",
};
var degreeProgram = {
  title: "BS Computer Science",
  institution: "University",
  currentSemester: 4,
};
var biography = {
  name: name,
  age: age,
  isStudent: isStudent,
  favoriteSubject: favoriteSubject,
  contactNumber: contactNumber,
  address: address,
  degreeProgram: degreeProgram,
};

var biographyText =
  "Name: " + biography.name + "\n" +
  "Age: " + biography.age + "\n" +
  "Student: " + biography.isStudent + "\n" +
  "Favorite subject: " + biography.favoriteSubject + "\n" +
  "Address: " + biography.address.city + ", " + biography.address.country + "\n" +
  "Degree: " + biography.degreeProgram.title + " at " + biography.degreeProgram.institution +
  " (semester " + biography.degreeProgram.currentSemester + ")";
console.log("Task 1 — Biography\n" + biographyText);

// Task 2: find the next prime after a given prime using let and loops.
function isPrime(number) {
  if (number < 2) return false;
  for (let divisor = 2; divisor * divisor <= number; divisor++) {
    if (number % divisor === 0) return false;
  }
  return true;
}

function nextPrimeAfter(givenPrime) {
  if (!isPrime(givenPrime)) {
    throw new TypeError("Task 2 expects a prime number as its input.");
  }
  let candidate = givenPrime + 1;
  while (!isPrime(candidate)) candidate++;
  return candidate;
}

var startingPrime = 11;
var nextPrime = nextPrimeAfter(startingPrime);
console.log("Task 2 — Prime after " + startingPrime + ": " + nextPrime);

// Task 3: format exactly ten integer digits as (XXX) XXX-XXXX.
function formatPhoneNumber(digits) {
  if (!Array.isArray(digits) || digits.length !== 10 ||
      !digits.every(function (digit) {
        return Number.isInteger(digit) && digit >= 0 && digit <= 9;
      })) {
    throw new TypeError("Provide an array of exactly 10 integers, each from 0 to 9.");
  }
  return "(" + digits.slice(0, 3).join("") + ") " +
    digits.slice(3, 6).join("") + "-" + digits.slice(6).join("");
}

var phoneDigits = [2, 1, 2, 5, 5, 5, 0, 1, 2, 3];
var formattedPhone = formatPhoneNumber(phoneDigits);
console.log("Task 3 — Phone number: " + formattedPhone);

// Task 4: no arguments -> 0, one argument -> number, many -> array.
function roundMe() {
  var values = Array.prototype.slice.call(arguments).map(function (value) {
    return Math.round(value);
  });
  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];
  return values;
}

var roundExamples = [roundMe(), roundMe(4.7), roundMe(4.7, 4.4)];
console.log("Task 4 — roundMe(): " + JSON.stringify(roundExamples));

// Task 5: custom helpers, each supporting zero, one, or many arguments.
function applyMathMethod(method, values) {
  var results = Array.prototype.slice.call(values).map(function (value) {
    return method(value);
  });
  if (results.length === 0) return 0;
  if (results.length === 1) return results[0];
  return results;
}

function abs() {
  return applyMathMethod(function (value) { return value < 0 ? -value : value; }, arguments);
}

function ceil() {
  return applyMathMethod(function (value) {
    var integer = value - (value % 1);
    return value % 1 > 0 ? integer + 1 : integer;
  }, arguments);
}

function floor() {
  return applyMathMethod(function (value) {
    var integer = value - (value % 1);
    return value % 1 < 0 ? integer - 1 : integer;
  }, arguments);
}

var mathExamples = {
  abs: abs(-4.7, 4.4),
  ceil: ceil(4.1, -4.7),
  floor: floor(4.7, -4.4),
};
console.log("Task 5 — Math helpers: " + JSON.stringify(mathExamples));

// Task 6: sum positive multiples of x OR y below z; overlaps count once.
function sumMultiples(x, y, z) {
  if (!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(z) ||
      x <= 0 || y <= 0 || z < 0) {
    throw new TypeError("x and y must be positive integers, and z a non-negative integer.");
  }
  var sum = 0;
  for (let value = 1; value < z; value++) {
    if (value % x === 0 || value % y === 0) sum += value;
  }
  return sum;
}

var multiplesSum = sumMultiples(3, 5, 10);
console.log("Task 6 — Sum of multiples of 3 or 5 below 10: " + multiplesSum);

// Show the same results on the page so the examples are visible without a console.
document.getElementById("bio-output").textContent = biographyText;
document.getElementById("prime-output").textContent =
  "Given prime: " + startingPrime + "\nNext prime: " + nextPrime;
document.getElementById("phone-output").textContent =
  "Input: [" + phoneDigits.join(", ") + "]\nOutput: " + formattedPhone;
document.getElementById("round-output").textContent =
  "roundMe() → " + roundMe() + "\nroundMe(4.7) → " + roundMe(4.7) +
  "\nroundMe(4.7, 4.4) → " + JSON.stringify(roundMe(4.7, 4.4));
document.getElementById("math-output").textContent =
  "abs(-4.7, 4.4) → " + JSON.stringify(abs(-4.7, 4.4)) +
  "\nceil(4.1, -4.7) → " + JSON.stringify(ceil(4.1, -4.7)) +
  "\nfloor(4.7, -4.4) → " + JSON.stringify(floor(4.7, -4.4));
document.getElementById("sum-output").textContent =
  "sumMultiples(3, 5, 10) → " + multiplesSum;
