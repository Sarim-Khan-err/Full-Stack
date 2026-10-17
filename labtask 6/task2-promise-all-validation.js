import { isValidUser } from './task1-user-fetch.js';

function isValidPosts(posts, userId) {
  return Array.isArray(posts)
    && posts.every((post) => post !== null
      && typeof post === 'object'
      && Number.isInteger(post.id)
      && post.id > 0
      && post.userId === userId
      && typeof post.title === 'string'
      && post.title.trim() !== ''
      && typeof post.body === 'string');
}

async function fetchJSON(url, fetchImplementation) {
  const response = await fetchImplementation(url);
  if (!response.ok) {
    const error = new Error(`Request failed with HTTP status ${response.status} at ${url}`);
    error.name = 'HttpError';
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function fetchValidUserAndPosts(userUrl, postsUrl, fetchImplementation = fetch) {
  const [user, posts] = await Promise.all([
    fetchJSON(userUrl, fetchImplementation),
    fetchJSON(postsUrl, fetchImplementation),
  ]);

  if (!isValidUser(user)) throw new TypeError('The user details are invalid');
  if (!isValidPosts(posts, user.id)) throw new TypeError('The post details are invalid');
  return { user, posts };
}
