"use strict";

function applyToArguments(operation, values) {
  var results = Array.prototype.slice.call(values).map(operation);
  if (results.length === 0) return 0;
  if (results.length === 1) return results[0];
  return results;
}

function abs() {
  return applyToArguments(function (value) {
    return value < 0 ? -value : value;
  }, arguments);
}

function ceil() {
  return applyToArguments(function (value) {
    var integer = value - (value % 1);
    return value % 1 > 0 ? integer + 1 : integer;
  }, arguments);
}

function floor() {
  return applyToArguments(function (value) {
    var integer = value - (value % 1);
    return value % 1 < 0 ? integer - 1 : integer;
  }, arguments);
}

console.log("abs(-4.7, 4.4) ->", abs(-4.7, 4.4));
console.log("ceil(4.1, -4.7) ->", ceil(4.1, -4.7));
console.log("floor(4.7, -4.4) ->", floor(4.7, -4.4));
