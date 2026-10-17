const STUDENTS = {
  101: { id: 101, name: 'Ali', completedCourses: ['CS301'], registeredCourses: [] },
  102: { id: 102, name: 'Hina', completedCourses: [], registeredCourses: [] },
  103: { id: 103, name: 'Zoya', completedCourses: ['CS301'], registeredCourses: ['CS401'] },
};
const COURSES = {
  CS401: { code: 'CS401', prerequisites: ['CS301'], seatsAvailable: 2, registeredStudentIds: [] },
  CSFULL: { code: 'CSFULL', prerequisites: ['CS301'], seatsAvailable: 0, registeredStudentIds: [] },
};

// Each stage uses one timer callback and calls the supplied callback exactly once.
function getStudent(id, callback) { setTimeout(runGetStudent, 10, id, callback); }
function runGetStudent(id, callback) {
  const student = STUDENTS[id];
  if (!student) callback(new Error(`Student ${id} does not exist`));
  else callback(null, student);
}
function checkPrerequisites(student, courseCode, callback) { setTimeout(runCheckPrerequisites, 10, student, courseCode, callback); }
function runCheckPrerequisites(student, courseCode, callback) {
  const course = COURSES[courseCode];
  if (!course) callback(new Error(`Course ${courseCode} does not exist`));
  else if (!course.prerequisites.every((code) => student.completedCourses.includes(code))) callback(new Error('Prerequisite not completed'));
  else callback(null, { student, course });
}
function checkSeats(student, course, callback) { setTimeout(runCheckSeats, 10, student, course, callback); }
function runCheckSeats(student, course, callback) {
  if (course.seatsAvailable <= 0) callback(new Error('Course is full'));
  else callback(null, { student, course });
}
function registerStudent(student, course, callback) { setTimeout(runRegisterStudent, 10, student, course, callback); }
function runRegisterStudent(student, course, callback) {
  if (student.registeredCourses.includes(course.code)) {
    callback(new Error('Student already registered'));
    return;
  }
  if (course.registeredStudentIds.includes(student.id)) {
    callback(new Error('Student already registered'));
    return;
  }
  student.registeredCourses.push(course.code);
  course.registeredStudentIds.push(student.id);
  course.seatsAvailable -= 1;
  callback(null, { studentId: student.id, course: course.code, status: 'REGISTERED' });
}

class RegistrationFlow {
  constructor(studentId, courseCode, done) {
    this.studentId = studentId;
    this.courseCode = courseCode;
    this.done = done;
    this.finished = false;
    this.onStudentLoaded = this.onStudentLoaded.bind(this);
    this.onPrerequisitesChecked = this.onPrerequisitesChecked.bind(this);
    this.onSeatsChecked = this.onSeatsChecked.bind(this);
    this.onRegistered = this.onRegistered.bind(this);
  }
  start() { getStudent(this.studentId, this.onStudentLoaded); }
  finish(error, value) {
    if (this.finished) return;
    this.finished = true;
    this.done(error, value);
  }
  onStudentLoaded(error, student) {
    if (error) { this.finish(error); return; }
    this.student = student;
    checkPrerequisites(student, this.courseCode, this.onPrerequisitesChecked);
  }
  onPrerequisitesChecked(error, state) {
    if (error) { this.finish(error); return; }
    this.student = state.student;
    this.course = state.course;
    checkSeats(this.student, this.course, this.onSeatsChecked);
  }
  onSeatsChecked(error, state) {
    if (error) { this.finish(error); return; }
    registerStudent(state.student, state.course, this.onRegistered);
  }
  onRegistered(error, confirmation) { this.finish(error, confirmation); }
}

function registerCourse(studentId, courseCode, callback) {
  new RegistrationFlow(studentId, courseCode, callback).start();
}

class CallbackDemo {
  constructor(done) {
    this.done = done;
    this.cases = [
      { studentId: 101, courseCode: 'CS401', label: 'success' },
      { studentId: 999, courseCode: 'CS401', label: 'missing student' },
      { studentId: 102, courseCode: 'CS401', label: 'missing prerequisite' },
      { studentId: 101, courseCode: 'CSFULL', label: 'full course' },
      { studentId: 103, courseCode: 'CS401', label: 'already registered' },
    ];
    this.index = 0;
    this.onResult = this.onResult.bind(this);
  }
  start() { this.runNext(); }
  runNext() {
    if (this.index >= this.cases.length) { this.done(); return; }
    const item = this.cases[this.index];
    console.log(`Case: ${item.label}`);
    registerCourse(item.studentId, item.courseCode, this.onResult);
  }
  onResult(error, value) {
    if (error) console.log(`Error: ${error.message}`);
    else console.log('Confirmation:', value);
    this.index += 1;
    this.runNext();
  }
}

export function runCallbackDemo(done) { new CallbackDemo(done).start(); }

