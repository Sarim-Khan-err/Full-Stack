export function isValidUser(user) {
  return user !== null
    && typeof user === 'object'
    && Number.isInteger(user.id)
    && user.id > 0
    && typeof user.name === 'string'
    && user.name.trim() !== '';
}

export async function fetchValidUser(url, fetchImplementation = fetch) {
  const response = await fetchImplementation(url);
  if (!response.ok) {
    const error = new Error(`Request failed with HTTP status ${response.status}`);
    error.name = 'HttpError';
    error.status = response.status;
    throw error;
  }

  const user = await response.json();
  if (!isValidUser(user)) throw new TypeError('The API response is not a valid user');
  return user;
}
