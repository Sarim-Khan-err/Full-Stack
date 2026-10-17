const SUPPORTED_PROGRAMS = new Set(['BSCS', 'BSSE', 'BSAI']);

function readText(value, label, errors) {
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${label} is missing`);
    return null;
  }
  return value.trim();
}

function readNumber(value, label, errors) {
  if (value === null || value === undefined || String(value).trim() === '') {
    errors.push(`${label} is missing`);
    return null;
  }
  const number = Number(value);
  if (!Number.isFinite(number)) {
    errors.push(`${label} is not a valid number`);
    return null;
  }
  return number;
}

function readBoolean(value, label, errors) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  errors.push(`${label} must be true or false`);
  return null;
}

export function processApplicants(applicants) {
  if (!Array.isArray(applicants)) throw new TypeError('Applicants must be an array');

  const processed = applicants.map((applicant) => {
    const errors = [];
    const id = readText(applicant?.id, 'ID', errors);
    const name = readText(applicant?.name, 'Name', errors);
    const age = readNumber(applicant?.age, 'Age', errors);
    const matricMarks = readNumber(applicant?.matricMarks, 'Matric marks', errors);
    const intermediateMarks = readNumber(applicant?.intermediateMarks, 'Intermediate marks', errors);
    const entryTest = readNumber(applicant?.entryTest, 'Entry test marks', errors);
    const program = readText(applicant?.program, 'Program', errors);
    const feePaid = readBoolean(applicant?.feePaid, 'Fee paid', errors);

    if (age !== null && (age < 17 || age > 30)) errors.push('Age must be between 17 and 30');
    for (const [label, marks] of [['Matric', matricMarks], ['Intermediate', intermediateMarks], ['Entry test', entryTest]]) {
      if (marks !== null && (marks < 0 || marks > 100)) errors.push(`${label} marks must be between 0 and 100`);
    }
    if (program !== null && !SUPPORTED_PROGRAMS.has(program)) errors.push(`Unsupported program: ${program}`);

    const valid = errors.length === 0;
    const merit = valid ? matricMarks * 0.2 + intermediateMarks * 0.3 + entryTest * 0.5 : null;
    const eligible = valid && merit >= 70 && entryTest >= 60 && intermediateMarks >= 60;
    let status = 'INVALID DATA';
    if (valid) {
      if (!eligible || !feePaid) status = 'REJECTED';
      else if (merit >= 80) status = 'SELECTED';
      else status = 'WAITING';
    }
    return { id, name, age, matricMarks, intermediateMarks, entryTest, program, feePaid, valid, merit, eligible, status, errors };
  });

  const validApplicants = processed.filter((applicant) => applicant.valid);
  const merits = validApplicants.map((applicant) => applicant.merit);
  const totalsByProgram = validApplicants.reduce((counts, applicant) => {
    counts[applicant.program] = (counts[applicant.program] ?? 0) + 1;
    return counts;
  }, {});
  const totalMerit = merits.reduce((sum, merit) => sum + merit, 0);
  const highest = validApplicants.reduce((best, applicant) => best === null || applicant.merit > best.merit ? applicant : best, null);
  const lowest = validApplicants.reduce((best, applicant) => best === null || applicant.merit < best.merit ? applicant : best, null);

  return {
    applicants: processed,
    summary: {
      validApplicants: validApplicants.length,
      invalidApplicants: processed.length - validApplicants.length,
      highestMeritApplicant: highest ? { name: highest.name, merit: highest.merit } : null,
      lowestMerit: lowest ? lowest.merit : null,
      averageMerit: merits.length ? Number((totalMerit / merits.length).toFixed(2)) : null,
      applicantsByProgram: totalsByProgram,
    },
  };
}

export function runAdmissionDemo() {
  const applicants = [
    { id: 'A101', name: 'Sara Khan', age: '19', matricMarks: '91', intermediateMarks: '87', entryTest: '78', program: 'BSCS', feePaid: 'true' },
    { id: 'A102', name: 'Ahmed Ali', age: 'twenty', matricMarks: '88', intermediateMarks: '', entryTest: '72', program: 'BSSE', feePaid: 'false' },
    { id: 'A103', name: 'Hassan', age: '18', matricMarks: '76', intermediateMarks: '83', entryTest: '91', program: 'BSAI', feePaid: 'true' },
    { id: 'A104', name: 'Noor', age: '17', matricMarks: '70', intermediateMarks: '70', entryTest: '70', program: 'BSCS', feePaid: 'true' },
    { id: 'A105', name: 'Boundary', age: '30', matricMarks: '100', intermediateMarks: '100', entryTest: '100', program: 'BSCS', feePaid: 'true' },
    { id: 'A106', name: 'Bad Marks', age: '19', matricMarks: '105', intermediateMarks: '80', entryTest: '70', program: 'BSSE', feePaid: 'true' },
    { id: 'A107', name: 'Unpaid', age: '19', matricMarks: '90', intermediateMarks: '90', entryTest: '90', program: 'BSSE', feePaid: 'false' },
    { id: 'A108', name: 'Over-age', age: '31', matricMarks: '80', intermediateMarks: '80', entryTest: '80', program: 'BSCS', feePaid: 'true' },
    { id: 'A109', name: 'Unknown program', age: '20', matricMarks: '80', intermediateMarks: '80', entryTest: '80', program: 'MBA', feePaid: 'true' },
  ];
  const result = processApplicants(applicants);
  console.table(result.applicants.map(({ id, name, merit, status }) => ({ id, name, merit: merit === null ? '-' : merit.toFixed(2), status })));
  console.log('Summary:', result.summary);
  console.log('Source records unchanged:', applicants[1].age === 'twenty');
}
