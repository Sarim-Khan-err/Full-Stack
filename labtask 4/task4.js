"use strict";

function roundMe() {
  var roundedValues = Array.prototype.slice.call(arguments).map(function (value) {
    return Math.round(value);
  });

  if (roundedValues.length === 0) return 0;
  if (roundedValues.length === 1) return roundedValues[0];
  return roundedValues;
}

console.log("roundMe() ->", roundMe());
console.log("roundMe(4.7) ->", roundMe(4.7));
console.log("roundMe(4.7, 4.4) ->", roundMe(4.7, 4.4));
