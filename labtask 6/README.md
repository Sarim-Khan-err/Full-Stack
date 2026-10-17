# Lab Task 6 solution

This small Node.js project solves the two exercises in the Lab Task 6 brief. It uses standard JavaScript and the built-in Fetch API; it has no third-party packages.

## Run

From this folder, run:

```text
node main.js
```

The included fake API makes the examples reproducible without internet access. The real API examples are commented at the bottom of `main.js`.

## Task 1

`fetchValidUser(url)` awaits the fetch response. If `response.ok` is false, it throws an HTTP error. If the HTTP request succeeds, it parses JSON and checks that the object has a positive integer `id` and a non-empty `name`. It returns the user only after both checks pass. Because it is `async`, a thrown error becomes a rejected Promise; the caller handles it with `try/catch`.

## Task 2

`fetchValidUserAndPosts()` starts two independent requests inside `Promise.all()`. It waits until both JSON responses are available, then validates the user and the posts. If either request fails or either result is invalid, the combined async function rejects. If both results are valid, it returns one object containing both.

`Promise.all()` rejects when any input Promise rejects. It does not cancel the other request that is already in progress. Use `Promise.allSettled()` when you need to collect every success and failure instead.

The fake API demonstrates successful data, invalid user data, invalid related data, and an HTTP 404 response.

