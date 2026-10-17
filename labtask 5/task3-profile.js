const sum = (...numbers) => numbers.reduce((total, number) => total + number, 0);

export function updateStudent(student, update = {}) {
  const { address: oldAddress = {}, contact: oldContact = {}, ...oldFields } = student;
  const { address: changedAddress = {}, contact: changedContact = {}, ...changedFields } = update;

  return {
    ...oldFields,
    ...changedFields,
    address: { ...oldAddress, ...changedAddress },
    contact: { ...oldContact, ...changedContact },
  };
}

export function runProfileDemo() {
  const student = {
    id: 101,
    name: 'Ali',
    marks: 0,
    scholarship: false,
    address: { city: 'Islamabad', sector: 'F-10' },
    contact: { email: 'ali@university.edu' },
  };
  const update = {
    name: 'Ali Khan',
    marks: 0,
    scholarship: false,
    nickname: '',
    address: { city: 'Rawalpindi' },
    contact: { phone: '03001234567' },
  };
  const updated = updateStudent(student, update);
  const { name: studentName = 'Unknown', marks = 0, scholarship: hasScholarship = false, address: { city: homeCity = 'Unknown' } = {} } = updated;
  const [mainSkill, ...otherSkills] = ['JavaScript', 'Node.js', 'Modules'];
  const { email: optionalEmail = 'not provided' } = {};
  const { id, ...publicProfile } = updated;
  const contactPhone = updated.contact?.phone ?? 'not provided';
  const summary = { studentName, marks, hasScholarship, homeCity, mainSkill, otherSkills, optionalEmail, publicProfile, contactPhone, total: sum(...[10, 20, 30]) };

  console.log('Updated profile:', updated);
  console.log('Feature examples:', summary);
  console.log('Original remains unchanged:', student.name === 'Ali' && student.address.city === 'Islamabad');
  console.log('Reference checks:', {
    studentObjectDifferent: student !== updated,
    addressDifferent: student.address !== updated.address,
    contactDifferent: student.contact !== updated.contact,
  });
  console.log('Falsy values preserved:', updated.marks === 0 && updated.scholarship === false && updated.nickname === '');
}
