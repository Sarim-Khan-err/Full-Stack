"use strict";

var name = "Sarim Khan";
var age = 21;
var isStudent = true;
var favoriteSubject = "Web Development";
var contactNumber;
var address = {
  city: "Karachi",
  country: "Pakistan",
  postalCode: "",
};
var degreeProgram = {
  title: "BS Computer Science",
  institution: "University",
  currentSemester: 4,
};

var biography = {
  name: name,
  age: age,
  isStudent: isStudent,
  favoriteSubject: favoriteSubject,
  contactNumber: contactNumber,
  address: address,
  degreeProgram: degreeProgram,
};

console.log("Biography");
console.log("Name: " + biography.name);
console.log("Age: " + biography.age);
console.log("Student: " + biography.isStudent);
console.log("Favorite subject: " + biography.favoriteSubject);
console.log("Address: " + biography.address.city + ", " + biography.address.country);
console.log("Degree: " + biography.degreeProgram.title + " at " + biography.degreeProgram.institution);
