const express = require("express");
const path = require("path");
const { users, results, tokens } = require("./data");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) {
    const userId = tokens[header.slice(7)];
    const found = users.find(u => u.id === userId);
    if (found) req.user = { ...found };
  }
  next();
});

app.get("/api/public-results/:id", (req, res) => {
  res.json(results.find(r => r.studentId === Number(req.params.id)));
});

app.get("/api/results/:id", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Login required" });
  res.json(results.find(r => r.studentId === Number(req.params.id)));
});

app.get("/api/admin/users", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Login required" });
  res.json(users);
});

app.get("/api/admin/stats", (req, res) => {
  if (req.headers["x-role"] === "admin") {
    return res.json({ totalUsers: users.length });
  }
  res.status(403).json({ message: "Access denied" });
});

app.put("/api/profile", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Login required" });
  Object.assign(req.user, req.body);
  res.json(req.user);
});

app.get("/api/reports", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "reports", req.query.file || ""));
});

app.delete("/api/admin/users/:id", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Login required" });
  res.json({ deleted: Number(req.params.id) });
});

module.exports = app;