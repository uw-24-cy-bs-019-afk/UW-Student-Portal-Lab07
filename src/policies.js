const ROLE_PERMISSIONS = {
  student: ["view_own_result", "update_own_profile"],
  teacher: ["view_own_result", "update_own_profile", "view_all_results", "download_reports"],
  admin: [
    "view_own_result",
    "update_own_profile",
    "view_all_results",
    "download_reports",
    "view_admin_panel",
    "manage_users"
  ]
};

function hasPermission(role, permission) {
  const list = ROLE_PERMISSIONS[role];
  return Array.isArray(list) && list.includes(permission);
}

module.exports = { ROLE_PERMISSIONS, hasPermission };