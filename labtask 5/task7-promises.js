const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function service(name, value, { delay = 15, fail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) reject(new Error(`${name} service failed`));
      else resolve(value);
    }, delay);
  });
}
function getStudent(id) {
  return service('Student', { id, name: 'Ali', completedCourses: ['CS301'], registeredCourses: [] });
}
function getCourse(code) {
  return service('Course', { code, prerequisite: 'CS301', seats: 3 });
}
function checkPrerequisites(student, course) {
  return service('Prerequisites', { student, course }, { fail: !student.completedCourses.includes(course.prerequisite) });
}
function checkSeats(state) {
  return service('Seats', state, { fail: state.course.seats <= 0 });
}
function registerStudent(state) {
  if (state.student.registeredCourses.includes(state.course.code)) return Promise.reject(new Error('Student already registered'));
  return service('Registration', { ...state, confirmation: { studentId: state.student.id, course: state.course.code, status: 'REGISTERED' } });
}
function sendEmail(confirmation) { return service('Email', { service: 'Email', confirmation }, { delay: 20 }); }
function sendSMS(confirmation) { return service('SMS', { service: 'SMS', confirmation }, { delay: 10, fail: true }); }
function writeAuditLog(confirmation) { return service('Audit log', { service: 'Audit', confirmation }, { delay: 25 }); }

function registerWithPromiseChain(studentId, courseCode) {
  return getStudent(studentId)
    .then((student) => ({ student, courseCode }))
    .then((state) => getCourse(state.courseCode).then((course) => ({ student: state.student, course })))
    .then((state) => checkPrerequisites(state.student, state.course))
    .then((state) => checkSeats(state))
    .then((state) => registerStudent(state));
}

function serviceReport(confirmation) {
  const jobs = [sendEmail(confirmation), sendSMS(confirmation), writeAuditLog(confirmation)];
  return Promise.allSettled(jobs).then((results) => results.map((result, index) => ({
    service: ['Email', 'SMS', 'Audit'][index],
    status: result.status,
  })));
}

function getCourseFromServer(serverName, code) {
  return service(serverName, { code, source: serverName }, { delay: serverName === 'Server A' ? 5 : 25, fail: serverName === 'Server A' });
}

function convertSettlementToValue(promise) {
  return promise.then(
    (value) => ({ status: 'fulfilled', value }),
    (error) => ({ status: 'rejected', reason: error.message }),
  );
}

export function runPromiseDemo() {
  return registerWithPromiseChain(101, 'CS401')
    .then((state) => {
      console.log('Registration confirmation:', state.confirmation);
      return serviceReport(state.confirmation).then((report) => ({ confirmation: state.confirmation, report }));
    })
    .then(({ report }) => {
      console.log('Independent service statuses (allSettled):', report);
      const serverA = convertSettlementToValue(getCourseFromServer('Server A', 'CS401'));
      const serverB = convertSettlementToValue(getCourseFromServer('Server B', 'CS401'));
      return Promise.race([serverA, serverB]).then((firstSettled) => {
        console.log('Promise.race first settled (can be a failure):', firstSettled);
        return Promise.any([getCourseFromServer('Server A', 'CS401'), getCourseFromServer('Server B', 'CS401')]);
      });
    })
    .then((firstSuccessfulCourse) => {
      console.log('First successful server (Promise.any):', firstSuccessfulCourse);
      return pause(0);
    })
    .catch((error) => console.log('Promise workflow error:', error.message))
    .finally(() => console.log('Promise registration flow finished.'));
}
