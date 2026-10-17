import Student from './Student.js';
import { calculateAverage, calculateGPA, calculateGrade as getGrade } from './gradeUtils.js';

export function processTranscriptJSON(rawData) {
  let incoming;
  try {
    incoming = JSON.parse(rawData);
  } catch (error) {
    throw new SyntaxError(`Transcript JSON is malformed: ${error.message}`);
  }
  if (!Array.isArray(incoming)) throw new TypeError('Transcript JSON must contain an array of students');

  const seenIds = new Set();
  const students = incoming.map((record, index) => {
    if (!record || typeof record !== 'object' || Array.isArray(record)) throw new TypeError(`Student at index ${index} must be an object`);
    if (record.id === undefined || record.id === null || String(record.id).trim() === '') throw new TypeError(`Student at index ${index} is missing an ID`);
    if (seenIds.has(record.id)) throw new Error(`Duplicate student ID: ${record.id}`);
    seenIds.add(record.id);
    if (typeof record.name !== 'string' || record.name.trim() === '') throw new TypeError(`Student ${record.id} is missing a name`);
    if (!Array.isArray(record.courses) || record.courses.length === 0) throw new TypeError(`Student ${record.id} must have at least one course`);

    const courses = record.courses.map((course, courseIndex) => {
      if (!course || typeof course.code !== 'string' || course.code.trim() === '') throw new TypeError(`Student ${record.id} course ${courseIndex} is missing a course code`);
      if (!Number.isFinite(course.marks)) throw new TypeError(`Marks for ${course.code} must be a number`);
      const grade = getGrade(course.marks);
      return { code: course.code.trim(), marks: course.marks, ...grade };
    });
    const student = new Student({ id: record.id, name: record.name.trim(), courses });
    const marks = courses.map((course) => course.marks);
    return { ...student.toReport(), average: calculateAverage(marks), gpa: calculateGPA(marks) };
  });

  const report = { generatedAt: new Date().toISOString(), studentCount: students.length, students };
  return { report, json: JSON.stringify(report, null, 2) };
}

export function runTranscriptDemo() {
  const rawData = `[
    {"id":101,"name":"Ali","courses":[{"code":"CS301","marks":81},{"code":"CS302","marks":74}]},
    {"id":102,"name":"Sara","courses":[{"code":"CS301","marks":92}]}
  ]`;
  try {
    const { report, json } = processTranscriptJSON(rawData);
    console.log('Transcript report:', report);
    console.log('JSON output:', json);
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
  } finally {
    console.log('Transcript processing finished.');
  }

  const invalidExamples = [
    ['malformed JSON', '{bad json'],
    ['missing ID', '[{"name":"No ID","courses":[{"code":"CS301","marks":80}]}]'],
    ['duplicate ID', '[{"id":1,"name":"A","courses":[{"code":"CS301","marks":80}]},{"id":1,"name":"B","courses":[{"code":"CS302","marks":70}]}]'],
    ['out-of-range marks', '[{"id":2,"name":"Bad","courses":[{"code":"CS301","marks":101}]}]'],
    ['missing course code', '[{"id":3,"name":"Bad","courses":[{"marks":70}]}]'],
  ];
  invalidExamples.forEach(([label, raw]) => {
    try { processTranscriptJSON(raw); }
    catch (error) { console.log(`${label}: ${error.name}`); }
  });
}
