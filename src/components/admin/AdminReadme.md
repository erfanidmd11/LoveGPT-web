# 📘 LoveGPT Super Admin Panel — Developer Guide

This guide outlines the Super Admin Panel structure, routing, and logic for the LoveGPT platform.

---

## 🔐 Access & Authentication

- **Login:** `/admin/login`
  - Uses Firebase Auth with email/password.
  - Validates against `SUPER_ADMINS` in `config/admins.ts`.
  - On success: stores `admin_logged_in` in `localStorage`.

- **Access Control:**
  - All admin pages validate:
    - Firebase Auth session
    - `admin_logged_in` local flag
    - Email in `SUPER_ADMINS`

---

## 🧭 Routing Map

| Path | Component | Description |
|------|-----------|-------------|
| `/admin/login` | `AdminLogin` | Super admin login |
| `/admin` | `AdminDashboard` | Main admin hub |
| `/admin/waitlist` | `WaitlistAdminPanel` | Approve or reject waitlist entries |
| `/admin/applications` | `AdminApplications` | Invite application management |
| `/admin/users/edit` | `AdminUserEditor` | Edit user phone numbers |
| `/admin/referrals` | `AdminReferrals` (TBD) | Referral tracking |
| `/admin/badges` | `AdminBadges` (TBD) | Badge rewards & status |

---

## 🧩 Key Components

- `AdminNavBar`
  - Ensures super admin access.
  - Provides navigation to all admin tools.

- `AdminHeader`
  - Tab-style top navigation bar.

- `AdminLogin`
  - Authenticates super admin using Firebase.

- `WaitlistAdminPanel`
  - Reads `waitlistRequests` from Firestore.
  - Supports status updates and logging.

- `AdminApplications`
  - Manages invite requests (`inviteApplications`).
  - Sends invite emails.

- `AdminUserEditor`
  - Finds user by UID.
  - Updates phone number.
  - Logs change to `logs` collection.

---

## 🔐 Environment Variables

```env
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_ADMIN_PASS=supersecurepass
```

---

## 🛠 Future Tools

- `/admin/referrals` → Track invite trees, referral stats.
- `/admin/badges` → View & assign user badges.

---

## 📤 Deployment
All files should be placed in `pages/admin` or `components/admin` accordingly.
Ensure proper Firebase config and env vars are deployed in Vercel.

---

For any new route, wrap logic with `AdminNavBar` to enforce protection.

Built with ❤️ by ARIA for LoveGPT.
