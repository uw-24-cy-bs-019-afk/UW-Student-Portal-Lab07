const request = require("supertest");
const vulnApp = require("../src/vulnerable-app");
const auth = t => ["Authorization", `Bearer ${t}`];

test("V2: IDOR succeeds on vulnerable app", async () => {
  const r = await request(vulnApp).get("/api/results/1002").set(...auth("student-token"));
  expect(r.status).toBe(200);
  expect(r.body.studentId).toBe(1002);
});

test("V3: Missing function-level check succeeds on vulnerable app", async () => {
  const r = await request(vulnApp).get("/api/admin/users").set(...auth("student-token"));
  expect(r.status).toBe(200);
});

test("V4: Role tampering succeeds on vulnerable app", async () => {
  const r = await request(vulnApp).get("/api/admin/stats").set("X-Role", "admin");
  expect(r.status).toBe(200);
});

test("V5: Mass assignment succeeds on vulnerable app", async () => {
  const r = await request(vulnApp).put("/api/profile").set(...auth("student-token")).send({ role: "admin" });
  expect(r.body.role).toBe("admin");
});