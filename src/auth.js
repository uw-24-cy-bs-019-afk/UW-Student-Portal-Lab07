const { users, tokens } = require("./data");
const { hasPermission } = require("./policies");

function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const userId = tokens[header.slice(7)];
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ message: "Invalid authentication" });
  }
  req.user = user;
  next();
}

function authorize(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

function authorizeOwnerOr(permission) {
  return (req, res, next) => {
    const targetId = Number(req.params.studentId);
    const isOwner = req.user && req.user.id === targetId;
    if (isOwner || hasPermission(req.user && req.user.role, permission)) {
      return next();
    }
    return res.status(403).json({ message: "Access denied" });
  };
}

module.exports = { authenticate, authorize, authorizeOwnerOr };