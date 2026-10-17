class Person {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  introduce() {
    return `I am ${this.name}. My email is ${this.email}.`;
  }
}

class Student extends Person {
  constructor(name, email, rollNo, marks) {
    super(name, email);
    this.rollNo = rollNo;
    this.marks = marks;
  }
  introduce() {
    return `${super.introduce()} My roll number is ${this.rollNo}.`;
  }
  getResult() {
    return this.marks >= 50 ? 'PASS' : 'FAIL';
  }
}

class FacultyMember extends Person {
  constructor(name, email, employeeId, department) {
    super(name, email);
    this.employeeId = employeeId;
    this.department = department;
  }
  introduce() {
    return `${super.introduce()} I teach in ${this.department}.`;
  }
}

export function runHierarchyDemo() {
  const student = new Student('M Sarim Khan', 'sarim@university.edu', '241851', 87);
  const users = [
    student,
    new Student('Ali Ahmed', 'ali@university.edu', '241852', 46),
    new FacultyMember('Warda Aslam', 'warda@university.edu', 'F104', 'Computer Science'),
    new FacultyMember('Usman Raza', 'usman@university.edu', 'F105', 'Software Engineering'),
  ];

  users.forEach((user) => console.log(user.introduce()));
  console.log('Student result:', student.getResult());
  console.log('instanceof:', student instanceof Student, student instanceof Person, users[2] instanceof FacultyMember);

  const guest = { name: 'Dr. Ahmed', email: 'ahmed@example.com' };
  console.log('call():', Person.prototype.introduce.call(guest));
  const fn = student.introduce;
  try {
    console.log('Detached method:', fn());
  } catch (error) {
    console.log('Detached method error in strict ES modules:', error.name);
  }
  const safeFn = student.introduce.bind(student);
  console.log('bind():', safeFn());
}
