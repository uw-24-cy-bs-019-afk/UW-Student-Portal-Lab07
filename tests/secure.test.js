const request = require("supertest");
const app = require("../src/app");
const { hasPermission } = require("../src/policies");
const auth = t => ["Authorization", `Bearer ${t}`];

test("1. student reads own result", async () => {
  const r = await request(app).get("/api/results/1001").set(...auth("student-token"));
  expect(r.status).toBe(200);
  expect(r.body.studentId).toBe(1001);
});

test("2. bilal reads own result", async () => {
  const r = await request(app).get("/api/results/1002").set(...auth("bilal-token"));
  expect(r.status).toBe(200);
});

test("3. teacher reads another student result", async () => {
  const r = await request(app).get("/api/results/1002").set(...auth("teacher-token"));
  expect(r.status).toBe(200);
});

test("4. admin reads any result", async () => {
  const r = await request(app).get("/api/results/1001").set(...auth("admin-token"));
  expect(r.status).toBe(200);
});

test("5. admin reads user list", async () => {
  const r = await request(app).get("/api/admin/users").set(...auth("admin-token"));
  expect(r.status).toBe(200);
});

test("6. missing token receives 401", async () => {
  const r = await request(app).get("/api/results/1001");
  expect(r.status).toBe(401);
});

test("7. invalid token receives 401", async () => {
  const r = await request(app).get("/api/results/1001").set(...auth("bad-token"));
  expect(r.status).toBe(401);
});

test("8. student cannot read another result", async () => {
  const r = await request(app).get("/api/results/1002").set(...auth("student-token"));
  expect(r.status).toBe(403);
});

test("9. student cannot access admin user list", async () => {
  const r = await request(app).get("/api/admin/users").set(...auth("student-token"));
  expect(r.status).toBe(403);
});

test("10. teacher cannot access admin panel", async () => {
  const r = await request(app).get("/api/admin/users").set(...auth("teacher-token"));
  expect(r.status).toBe(403);
});

test("11. fake X-Role: admin header blocked for student", async () => {
  const r = await request(app).get("/api/admin/stats").set(...auth("student-token")).set("X-Role", "admin");
  expect(r.status).toBe(403);
});

test("12. student attempts role update -> role remains student", async () => {
  const r = await request(app).put("/api/profile").set(...auth("student-token")).send({ name: "Ayesha", role: "admin" });
  expect(r.status).toBe(200);
  expect(r.body.role).toBe("student");
});

test("13. student downloads report -> 403", async () => {
  const r = await request(app).get("/api/reports?file=summary.txt").set(...auth("student-token"));
  expect(r.status).toBe(403);
});

test("14. teacher downloads allowed report -> 200", async () => {
  const r = await request(app).get("/api/reports?file=summary.txt").set(...auth("teacher-token"));
  expect(r.status).toBe(200);
});

test("15. traversal attempt blocked -> 403", async () => {
  const r = await request(app).get("/api/reports?file=../package.json").set(...auth("teacher-token"));
  expect(r.status).toBe(403);
});

test("16. student deletes user -> 403", async () => {
  const r = await request(app).delete("/api/admin/users/1002").set(...auth("student-token"));
  expect(r.status).toBe(403);
});

test("17. unknown route returns 404", async () => {
  const r = await request(app).get("/api/does-not-exist").set(...auth("admin-token"));
  expect(r.status).toBe(404);
});

test("18. unknown role has no permission", () => {
  expect(hasPermission("hacker", "view_own_result")).toBe(false);
});
