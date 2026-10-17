import { fetchValidUser } from './task1-user-fetch.js';
import { fetchValidUserAndPosts } from './task2-promise-all-validation.js';

const responses = {
  '/users/1': { status: 200, body: { id: 1, name: 'M Sarim Khan', email: 'sarim@example.com' } },
  '/users/2': { status: 200, body: { id: 0, name: '' } },
  '/users/1/posts': { status: 200, body: [
    { userId: 1, id: 1, title: 'First post', body: 'Post text' },
    { userId: 1, id: 2, title: 'Second post', body: 'More text' },
  ] },
  '/users/1/bad-posts': { status: 200, body: [{ userId: 2, id: 3, title: '', body: 'Wrong user' }] },
  '/missing': { status: 404, body: { message: 'Not found' } },
};

async function fakeFetch(url) {
  const route = responses[url];
  if (!route) throw new Error(`No fake response configured for ${url}`);
  return {
    ok: route.status >= 200 && route.status < 300,
    status: route.status,
    async json() { return route.body; },
  };
}

async function showCase(label, operation) {
  try {
    console.log(`${label}:`, await operation());
  } catch (error) {
    console.log(`${label}: ${error.name} - ${error.message}`);
  }
}

await showCase('Task 1 success', () => fetchValidUser('/users/1', fakeFetch));
await showCase('Task 1 invalid user', () => fetchValidUser('/users/2', fakeFetch));
await showCase('Task 1 HTTP failure', () => fetchValidUser('/missing', fakeFetch));
await showCase('Task 2 both valid', () => fetchValidUserAndPosts('/users/1', '/users/1/posts', fakeFetch));
await showCase('Task 2 invalid second response', () => fetchValidUserAndPosts('/users/1', '/users/1/bad-posts', fakeFetch));
await showCase('Task 2 one HTTP failure', () => fetchValidUserAndPosts('/users/1', '/missing', fakeFetch));

// Real API usage when online:
// const user = await fetchValidUser('https://jsonplaceholder.typicode.com/users/1');
// const profile = await fetchValidUserAndPosts(
//   'https://jsonplaceholder.typicode.com/users/1',
//   'https://jsonplaceholder.typicode.com/users/1/posts',
// );
