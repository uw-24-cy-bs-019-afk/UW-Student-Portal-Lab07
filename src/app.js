const express = require("express");
const path = require("path");
const fs = require("fs");
const { users, results } = require("./data");
const { authenticate, authorize, authorizeOwnerOr } = require("./auth");

const app = express();
app.use(express.json());

app.get("/api/results/:studentId", authenticate, authorizeOwnerOr("view_all_results"), (req, res) => {
  const record = results.find(r => r.studentId === Number(req.params.studentId));
  if (!record) return res.status(404).json({ message: "Result not found" });
  res.json(record);
});

app.get("/api/admin/users", authenticate, authorize("view_admin_panel"), (req, res) => {
  res.json(users);
});

app.get("/api/admin/stats", authenticate, authorize("view_admin_panel"), (req, res) => {
  res.json({ totalUsers: users.length });
});

app.put("/api/profile", authenticate, authorize("update_own_profile"), (req, res) => {
  if (typeof req.body.name === "string" && req.body.name.trim()) {
    req.user.name = req.body.name.trim();
  }
  res.json({ id: req.user.id, name: req.user.name, role: req.user.role });
});

app.get("/api/reports", authenticate, authorize("download_reports"), (req, res) => {
  const requested = req.query.file || "";
  const reportsDir = path.resolve(__dirname, "..", "reports");
  const resolved = path.resolve(reportsDir, requested);
  if (!resolved.startsWith(reportsDir + path.sep)) {
    return res.status(403).json({ message: "Path traversal blocked" });
  }
  if (!fs.existsSync(resolved)) {
    return res.status(404).json({ message: "File not found" });
  }
  res.sendFile(resolved);
});

app.delete("/api/admin/users/:id", authenticate, authorize("manage_users"), (req, res) => {
  const idx = users.findIndex(u => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "User not found" });
  users.splice(idx, 1);
  res.json({ message: "User deleted" });
});

module.exports = app;