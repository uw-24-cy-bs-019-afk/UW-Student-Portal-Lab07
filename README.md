# UW Student Portal - Access Control (Lab 07)

## Introduction
Server-side Role-Based Access Control (RBAC) implementation for the UW Student Portal using Node.js, Express, and Jest.

## Permission Matrix
| Action | Student | Teacher | Admin |
| :--- | :---: | :---: | :---: |
| View own result | Allow | Allow | Allow |
| View any result | Deny | Allow | Allow |
| Update own profile (name) | Allow | Allow | Allow |
| Download report files | Deny | Allow | Allow |
| View admin panel / users | Deny | Deny | Allow |
| Delete / manage users | Deny | Deny | Allow |

## Vulnerabilities (V1–V7) & Fixes
- **V1 (CWE-306):** Missing authentication -> Fixed with `authenticate` middleware (401).
- **V2 (CWE-639):** IDOR -> Fixed with `authorizeOwnerOr` ownership check (403).
- **V3 (CWE-285):** Missing function-level check -> Fixed with `authorize("view_admin_panel")` (403).
- **V4 (CWE-284):** Role tampering (`X-Role`) -> Fixed by trusting server-side user records only.
- **V5 (CWE-915):** Mass assignment -> Fixed by allow-listing `name` field only.
- **V6 (CWE-22):** Path traversal -> Fixed by validating resolved path inside `reports/`.
- **V7 (CWE-284):** Unauthorized delete -> Fixed with `authorize("manage_users")` (403).

## Test Results
All 22 Jest & Supertest automated tests passed (18 secure tests + 4 vulnerable demonstration tests).

## Security Limitations
Hard-coded demo tokens, no password hashing, no token expiry, no HTTPS, no rate limiting, no audit logging, and in-memory data storage.
