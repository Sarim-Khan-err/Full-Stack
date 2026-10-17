# Lab 5 CampusFlow solution

This is a complete, runnable reference solution for all eight tasks in the attached Lab 5 sheet. It uses plain JavaScript and Node.js built-ins only. No DOM, HTML, React, Express, databases, or external packages are needed.

## Run it

Install Node.js if needed, open a terminal in this folder, then run:

```text
node main.js
```

The code is split by task. Task 5 is intentionally split into `Student.js`, `gradeUtils.js`, `transcriptService.js`, and `main.js` as required. The project uses ES modules through `package.json`.

## Viva notes by task

1. **Admissions:** `Number()` explicitly converts incoming strings. Guard checks run before merit is calculated. Marks and age are range-checked. Grade points use a common 4.0 scale (A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, F=0). The chosen distinction is: eligible applicants with paid fees and merit of 80 or more are selected; eligible applicants with paid fees and merit below 80 wait; unpaid or academically ineligible valid applications are rejected. Invalid input gets `INVALID DATA`. Merit is calculated with the specified 20/30/50 weights. Summary values come from array calculations, not fixed answers.
2. **Array analytics:** `map` adds grade fields, `sort` ranks a copied array, and `reduce` builds department totals. `find`, `findIndex`, `some`, `every`, `filter`, and `slice` answer the requested queries. The original list is unchanged because sorting happens on `[...processed]`.
3. **Safe update:** object spread makes a new student and new nested `address` and `contact` objects. Object destructuring separates nested fields; renamed variables and defaults are shown. `0`, `false`, and `''` are preserved because no truthy/falsy fallback is used. `?.` safely reads an optional phone and `??` supplies a default only for null or undefined.
4. **Classes and `this`:** `extends` and `super` reuse `Person`; each child overrides `introduce()`. The shared array demonstrates runtime polymorphism. ES modules are strict, so a detached method has no student `this` and throws; `bind(student)` supplies the right receiver. `call(guest)` borrows the parent introduction method.
5. **Modules and JSON:** the default import is `Student`; named imports include an aliased `calculateGrade`. JSON parsing errors remain `SyntaxError`; malformed structures use `TypeError`; marks outside 0-100 use `RangeError`; duplicate IDs use `Error`. The report is an ordinary object and is also serialized to JSON.
6. **Callbacks:** every stage uses `setTimeout` and `(error, value)`. The flow advances only after the prior stage succeeds. A failed stage ends the flow. Named class methods hold each request's state; no function returns another function to retain state. More stages make callback code harder to scan because each next step and error path must be connected by hand.
7. **Promises:** each `.then()` returns the next service or state, so data moves along the chain. `Promise.allSettled()` reports every independent email/SMS/audit outcome. `Promise.race()` is demonstrated with each outcome converted into a value, so the earliest result visibly may be a failure. `Promise.any()` then ignores the early failure and returns the first success, which meets the requirement.
8. **Async dashboard:** three independent `getJSON()` calls start together and are joined with `Promise.all()`. The fake fetch covers 200, 404, 500, network failure, invalid JSON, and a slow route. `fetchWithTimeout()` aborts with `AbortController`; `finally` always clears the timer.

## Test coverage included in the demos

- Task 1: valid, invalid numeric, missing field, ages 17/30/31, marks 0/100/105, unsupported program, and selected/waiting/rejected outcomes.
- Task 2: each grade threshold has a boundary example; demo includes an extra department, tie in the top marks, and a 101-mark validity check.
- Task 3: omitted fields, nested merge, unchanged source, distinct references, and valid falsy values.
- Task 5: valid JSON, malformed JSON, missing ID, duplicate ID, out-of-range marks, and missing course code.
- Task 6: success, missing student, missing prerequisite, full course, and already registered.
- Task 7: successful registration, one failed post-registration service, and one server rejection before another server succeeds.
- Task 8: success, 404, 500, network failure, JSON parse failure, concurrent loading, and timeout.

The demo data is deliberately small so the program flow is easy to explain at the board. Change the sample records to practice other cases; the calculations and validation are derived from the input.

