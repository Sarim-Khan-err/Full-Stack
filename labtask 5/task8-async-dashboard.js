const ROUTES = {
  '/users': { status: 200, delay: 25, data: [
    { id: 1, name: 'Ali', department: 'CS' },
    { id: 2, name: 'Sara', department: 'CS' },
    { id: 3, name: 'Usman', department: 'SE' },
    { id: 4, name: 'Hina', department: 'AI' },
  ] },
  '/courses': { status: 200, delay: 10, data: [{ code: 'CS301' }, { code: 'CS401' }, { code: 'SE201' }] },
  '/results': { status: 200, delay: 15, data: [
    { studentId: 1, course: 'CS301', marks: 82 },
    { studentId: 1, course: 'CS401', marks: 88 },
    { studentId: 2, course: 'CS301', marks: 91 },
    { studentId: 3, course: 'SE201', marks: 47 },
    { studentId: 4, course: 'CS301', marks: 73 },
  ] },
  '/not-found': { status: 404, delay: 5, data: { message: 'Not found' } },
  '/server-error': { status: 500, delay: 5, data: { message: 'Server error' } },
  '/network-error': { status: 200, delay: 5, networkError: true },
  '/bad-json': { status: 200, delay: 5, bodyText: '{ invalid JSON' },
  '/slow': { status: 200, delay: 100, data: { message: 'This response is slow' } },
};

export function fakeFetch(url, options = {}) {
  const route = ROUTES[url];
  if (!route) return Promise.reject(Object.assign(new Error(`No fake route for ${url}`), { name: 'NetworkError' }));
  const signal = options.signal;
  return new Promise((resolve, reject) => {
    let settled = false;
    const finishReject = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (signal) signal.removeEventListener('abort', onAbort);
      reject(error);
    };
    const onAbort = () => finishReject(Object.assign(new Error('The request was aborted'), { name: 'AbortError' }));
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      if (signal) signal.removeEventListener('abort', onAbort);
      if (route.networkError) {
        reject(Object.assign(new Error('Network connection failed'), { name: 'NetworkError' }));
        return;
      }
      const bodyText = route.bodyText ?? JSON.stringify(route.data);
      resolve({
        ok: route.status >= 200 && route.status < 300,
        status: route.status,
        bodyText,
        async json() { return JSON.parse(this.bodyText); },
      });
    }, route.delay);
    if (signal) {
      if (signal.aborted) onAbort();
      else signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}

export async function getJSON(url, fetchImplementation) {
  if (typeof fetchImplementation !== 'function') throw new TypeError('A fetch implementation is required');
  const response = await fetchImplementation(url);
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status} for ${url}`);
    error.name = 'HttpError';
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function makeDashboard(users, courses, results) {
  const marksByStudent = results.reduce((grouped, result) => {
    grouped[result.studentId] = grouped[result.studentId] ?? [];
    grouped[result.studentId].push(result.marks);
    return grouped;
  }, {});
  const studentAverages = users.map((user) => {
    const marks = marksByStudent[user.id] ?? [];
    const average = marks.length ? marks.reduce((sum, mark) => sum + mark, 0) / marks.length : 0;
    return { ...user, average: Number(average.toFixed(2)) };
  });
  const allMarks = results.map((result) => result.marks);
  const overallAverage = allMarks.length ? allMarks.reduce((sum, mark) => sum + mark, 0) / allMarks.length : 0;
  const failedStudentIds = new Set(results.filter((result) => result.marks < 50).map((result) => result.studentId));
  const departmentGroups = results.reduce((groups, result) => {
    const user = users.find((item) => item.id === result.studentId);
    if (!user) return groups;
    const group = groups[user.department] ?? { students: new Set(), marks: [] };
    group.students.add(user.id);
    group.marks.push(result.marks);
    groups[user.department] = group;
    return groups;
  }, {});
  const departments = Object.fromEntries(Object.entries(departmentGroups).map(([name, group]) => [name, {
    students: group.students.size,
    average: Number((group.marks.reduce((sum, mark) => sum + mark, 0) / group.marks.length).toFixed(2)),
    passed: group.marks.filter((mark) => mark >= 50).length,
  }]));
  const highestPerformingStudent = studentAverages.reduce((best, user) => best === null || user.average > best.average ? user : best, null);
  return {
    totalStudents: users.length,
    totalCourses: courses.length,
    overallAverageMarks: Number(overallAverage.toFixed(2)),
    highestPerformingStudent,
    failedStudents: failedStudentIds.size,
    departmentStatistics: departments,
  };
}

export async function loadDashboard(fetchImplementation = fakeFetch) {
  // All three requests start before Promise.all waits for any one of them.
  const [users, courses, results] = await Promise.all([
    getJSON('/users', fetchImplementation),
    getJSON('/courses', fetchImplementation),
    getJSON('/results', fetchImplementation),
  ]);
  return makeDashboard(users, courses, results);
}

export async function fetchWithTimeout(url, milliseconds) {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), milliseconds);
  try {
    const response = await fakeFetch(url, { signal: controller.signal });
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status} for ${url}`);
      error.name = 'HttpError';
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
    if (controller.signal.aborted) {
      const timeoutError = new Error(`Request timed out after ${milliseconds} ms`);
      timeoutError.name = 'TimeoutError';
      timeoutError.cause = error;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timerId);
  }
}

function errorType(error) {
  if (error.name === 'HttpError') return `HTTP failure (${error.status})`;
  if (error.name === 'NetworkError') return 'Network failure';
  if (error.name === 'SyntaxError') return 'Invalid JSON';
  if (error.name === 'TimeoutError') return 'Timeout';
  return `${error.name}: ${error.message}`;
}

export async function runDashboardDemo() {
  const startedAt = Date.now();
  console.log('Dashboard:', await loadDashboard());
  console.log(`Concurrent request demo finished in ${Date.now() - startedAt} ms.`);

  for (const url of ['/not-found', '/server-error', '/network-error', '/bad-json']) {
    try { await getJSON(url, fakeFetch); }
    catch (error) { console.log(`${url}: ${errorType(error)}`); }
  }
  try { await fetchWithTimeout('/slow', 20); }
  catch (error) { console.log(`/slow: ${errorType(error)}`); }
  console.log('Timeout timer is cleaned up in finally.');
}

