const users = [
  { id: 1001, name: "Ayesha Khan", role: "student" },
  { id: 1002, name: "Bilal Ahmed", role: "student" },
  { id: 2001, name: "Dr. Sana Malik", role: "teacher" },
  { id: 9001, name: "Admin", role: "admin" }
];

const results = [
  { studentId: 1001, course: "SSD", marks: 85 },
  { studentId: 1002, course: "SSD", marks: 54 }
];

const tokens = {
  "student-token": 1001,
  "bilal-token": 1002,
  "teacher-token": 2001,
  "admin-token": 9001
};

module.exports = { users, results, tokens };