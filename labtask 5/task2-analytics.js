const GRADE_RULES = [
  { minimum: 85, grade: 'A', points: 4.0 },
  { minimum: 80, grade: 'A-', points: 3.7 },
  { minimum: 75, grade: 'B+', points: 3.3 },
  { minimum: 70, grade: 'B', points: 3.0 },
  { minimum: 65, grade: 'B-', points: 2.7 },
  { minimum: 60, grade: 'C+', points: 2.3 },
  { minimum: 50, grade: 'C', points: 2.0 },
  { minimum: 0, grade: 'F', points: 0 },
];

export function gradeResult(marks) {
  if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
    return { grade: 'INVALID', status: 'INVALID DATA', gradePoints: null };
  }
  const rule = GRADE_RULES.find((item) => marks >= item.minimum);
  return { grade: rule.grade, status: marks >= 50 ? 'PASS' : 'FAIL', gradePoints: rule.points };
}

export function analyzeResults(results) {
  const processed = results.map((student) => ({ ...student, ...gradeResult(student.marks) }));
  const ranked = [...processed].sort((a, b) => b.marks - a.marks || a.name.localeCompare(b.name));

  const departments = processed.reduce((stats, student) => {
    const department = stats[student.department] ?? { students: 0, totalMarks: 0, highest: null, passed: 0 };
    department.students += 1;
    if (Number.isFinite(student.marks)) department.totalMarks += student.marks;
    department.highest = department.highest === null ? student.marks : Math.max(department.highest, student.marks);
    if (student.status === 'PASS') department.passed += 1;
    stats[student.department] = department;
    return stats;
  }, {});
  Object.values(departments).forEach((stats) => {
    stats.average = stats.students ? Number((stats.totalMarks / stats.students).toFixed(2)) : null;
    delete stats.totalMarks;
  });

  const totalMarks = processed.reduce((sum, student) => sum + (Number.isFinite(student.marks) ? student.marks : 0), 0);
  const average = processed.length ? totalMarks / processed.length : 0;
  const firstAbove85 = processed.find((student) => student.marks > 85) ?? null;
  const firstFailedIndex = processed.findIndex((student) => student.status === 'FAIL');
  const atLeastOneFailed = processed.some((student) => student.status === 'FAIL');
  const allMarksValid = processed.every((student) => Number.isFinite(student.marks) && student.marks >= 0 && student.marks <= 100);
  const aboveAverage = processed.filter((student) => student.marks > average);
  const topThreeNames = ranked.slice(0, 3).map((student) => student.name);

  return { processed, ranked, departments, queries: { firstAbove85, firstFailedIndex, atLeastOneFailed, allMarksValid, average: Number(average.toFixed(2)), aboveAverage, topThreeNames } };
}

export function runAnalyticsDemo() {
  const results = [
    { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 82 },
    { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 91 },
    { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
    { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73 },
    { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
    { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 },
    { id: 7, name: 'DS Boundary', department: 'DS', course: 'FSWD', marks: 100 },
  ];
  const report = analyzeResults(results);
  console.table(report.processed.map(({ name, marks, grade, status, gradePoints }) => ({ name, marks, grade, status, gradePoints })));
  console.log('Ranked:', report.ranked.map(({ name, marks }) => `${name} (${marks})`));
  console.log('Department statistics:', report.departments);
  console.log('Queries:', { ...report.queries, firstAbove85: report.queries.firstAbove85?.name, aboveAverage: report.queries.aboveAverage.map((student) => student.name) });
  console.log('Original order preserved:', results[0].name === 'Ali');
  console.log('Grade boundaries:', [100, 85, 84, 80, 79, 75, 74, 70, 69, 65, 64, 60, 59, 50, 49, 0, 101].map((marks) => ({ marks, ...gradeResult(marks) })));
  console.log('Invalid-range boundary check:', analyzeResults([{ name: 'Out of range', department: 'DS', marks: 101 }]).queries.allMarksValid);
}
