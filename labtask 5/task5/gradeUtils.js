const RULES = [
  { minimum: 85, grade: 'A', points: 4.0 },
  { minimum: 80, grade: 'A-', points: 3.7 },
  { minimum: 75, grade: 'B+', points: 3.3 },
  { minimum: 70, grade: 'B', points: 3.0 },
  { minimum: 65, grade: 'B-', points: 2.7 },
  { minimum: 60, grade: 'C+', points: 2.3 },
  { minimum: 50, grade: 'C', points: 2.0 },
  { minimum: 0, grade: 'F', points: 0 },
];

export function calculateGrade(marks) {
  if (!Number.isFinite(marks)) throw new TypeError('Marks must be a number');
  if (marks < 0 || marks > 100) throw new RangeError('Marks must be between 0 and 100');
  const rule = RULES.find((item) => marks >= item.minimum);
  return { grade: rule.grade, gradePoints: rule.points };
}

export function calculateAverage(marks) {
  if (!Array.isArray(marks) || marks.length === 0) throw new RangeError('At least one mark is required');
  const total = marks.reduce((sum, mark) => sum + mark, 0);
  return Number((total / marks.length).toFixed(2));
}

export function calculateGPA(marks) {
  const points = marks.map((mark) => calculateGrade(mark).gradePoints);
  return Number((points.reduce((sum, point) => sum + point, 0) / points.length).toFixed(2));
}
