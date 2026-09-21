# 🎓 BITS Pilani – CISIS Department Portal

A role-based web portal for the **CISIS Department, BITS Pilani**. Faculty, HODs and administrators use it to record, manage, analyse and export academic output: publications, sponsored projects, conferences, PhD theses, patents, books, events, invited talks and awards.

![React](https://img.shields.io/badge/React-19.1-61dafb?logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.13-CA4245?logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38bdf8?logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3.8-22b5bf)
![Create React App](https://img.shields.io/badge/CRA-react--scripts_5-09d3ac)

> **Note:** This repository contains the **frontend only** (`department-frontend/`). It talks to a separate REST backend (Node/Express + MongoDB style API under `/api/v1`) that is **not** part of this repo. See [Backend API contract](#-backend-api-contract).

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Roles & Permissions](#-roles--permissions)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Getting Started](#-getting-started)
6. [Environment Variables](#-environment-variables)
7. [Available Scripts](#-available-scripts)
8. [Application Routes](#-application-routes)
9. [Page-by-Page Guide](#-page-by-page-guide)
10. [Data Entry Forms & Fields](#-data-entry-forms--fields)
11. [Bulk Upload (Excel)](#-bulk-upload-excel)
12. [Exports (PDF & Excel)](#-exports-pdf--excel)
13. [Authentication Flow](#-authentication-flow)
14. [Backend API Contract](#-backend-api-contract)
15. [Component Reference](#-component-reference)
16. [Styling & UI](#-styling--ui)
17. [Testing](#-testing)
18. [Deployment](#-deployment)
19. [Known Limitations](#-known-limitations)
20. [Contributing](#-contributing)

---

## ✨ Features

### 🔐 Authentication & Security
- **Email + password login** with JWT (stored in `localStorage`)
- **Google Single Sign-On** (`@react-oauth/google`, One Tap enabled) – only pre-registered emails can sign in
- **Forced password change on first login**
- **Forgot / reset password** via emailed reset link
- **Show/hide password** toggle and browser password-save support
- **Protected routes** – unauthenticated users are redirected to `/login`
- **Role-aware UI** – menus, quick actions and pages adapt to the signed-in role
- **Admin-only System Logs** for auditing login/SSO/registration events

### 📊 Dashboard
- **Personal dashboard** listing every record the user has contributed, grouped by category and year
- **Department-wide tabbed view** for Admin/HOD (Department Administration) with a tab and record count per category
- **Global search** across all fields of a record
- **Year filter** built dynamically from the data
- **Inline edit** (modal per record type) and **delete** (with confirmation modal)
- **Per-category export** to **PDF** and **Excel**
- Detailed record cards showing every populated field (arrays, dates, populated faculty references are formatted automatically)

### 📈 Analytics
- **My Impact Analytics** (faculty) / **Department Analytics** (Admin/HOD)
- KPI cards: Total Records, Total Funding (₹ in Lakhs), Publications, Projects
- **Yearly Output Comparison** bar chart (Publications vs Conferences vs Projects)
- **Record Distribution** donut chart across all categories

### 📝 Data Management (10 record types)
Faculty · Publications · Projects · Conferences · PhD Theses · Patents · Published Books · Department Events · Invited Talks · Faculty Awards

### 📥 Bulk Operations
- Excel (`.xlsx`) bulk upload for 11 record types, with required-column hints shown per uploader

### 👤 Admin Tools
- **Add New Faculty** – creates the public faculty profile *and* the login account in one step
- **Manage Users** – change role (Faculty / HOD / System Admin), suspend or reactivate accounts, revoke login access
- **System Logs** – security event table with **PDF export**

### 🧑‍💻 UX
- Fully responsive (desktop navbar / mobile hamburger menu)
- Toast notifications (`react-hot-toast`)
- Skeleton and spinner loading states
- Empty-state guidance for new users

---

## 👥 Roles & Permissions

| Capability | Faculty | HOD | Admin |
|---|:---:|:---:|:---:|
| Login (password / Google SSO) | ✅ | ✅ | ✅ |
| Add / edit / delete own records | ✅ | ✅ | ✅ |
| Personal dashboard & analytics | ✅ | ✅ | ✅ |
| Department-wide dashboard & analytics (`isAdminOrHOD`) | ❌ | ✅ | ✅ |
| Bulk upload | ✅ | ✅ | ✅ |
| Add New Faculty (`/forms/faculty`) | ❌ | ❌ | ✅ |
| Manage Users (`/manage-users`) | ❌ | ❌ | ✅ |
| System Logs (`/system-logs`) | ❌ | ❌ | ✅ |

> The frontend hides admin-only navigation based on the `role` stored at login. **Authorization is enforced by the backend**; the UI checks are for convenience only.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| UI library | **React 19.1** |
| Routing | **React Router DOM 7.13** |
| Styling | **Tailwind CSS 4.1** (+ PostCSS, Autoprefixer) |
| Charts | **Recharts 3.8** |
| Icons | **lucide-react** |
| Notifications | **react-hot-toast** |
| Select inputs | **react-select** (multi-select for faculty pickers etc.) |
| Auth (SSO) | **@react-oauth/google** |
| Excel read/write | **xlsx (SheetJS)** |
| PDF generation | **jsPDF** + **jspdf-autotable** |
| Tooling | Create React App (`react-scripts` 5), ESLint (`react-app`), Jest + React Testing Library |
| HTTP | Native `fetch` |

---

## 📁 Project Structure

```
department_project/
├── package.json                    # Root manifest (xlsx)
├── readme.md
└── department-frontend/
    ├── package.json
    ├── .env                        # REACT_APP_* variables (see below)
    ├── public/
    │   ├── index.html
    │   ├── manifest.json
    │   ├── robots.txt
    │   ├── favicon.ico
    │   ├── logo192.png / logo512.png
    │   └── 1200px-BITS_Pilani-Logo.svg.png   # Navbar logo
    └── src/
        ├── index.js                # Entry point – wraps <App/> in GoogleOAuthProvider
        ├── index.css               # Tailwind import + base styles
        ├── App.js                  # Route table
        ├── App.css
        ├── config.js               # API_BASE_URL from env
        ├── tailwind.config.js
        ├── reportWebVitals.js
        ├── setupTests.js
        ├── App.test.js
        │
        ├── components/
        │   ├── ProtectedRoute.js           # Token guard for private routes
        │   ├── BulkUploader.js             # Reusable Excel uploader card
        │   ├── FormWrapper.js              # Page shell with "Back to Dashboard"
        │   ├── common/
        │   │   └── ConfirmationModal.jsx   # Reusable confirm/delete dialog
        │   ├── layout/
        │   │   ├── Layout.jsx              # Navbar + Toaster + <Outlet/>
        │   │   └── Navbar.jsx              # Responsive top navigation
        │   └── dashboard/
        │       ├── PublicationEditModal.jsx
        │       ├── ProjectEditModal.jsx
        │       ├── ConferenceEditModal.jsx
        │       ├── PhdThesisEditModal.jsx
        │       ├── PatentEditModal.jsx
        │       ├── PublishedBookEditModal.jsx
        │       ├── DepartmentEventEditModal.jsx
        │       ├── InvitedTalkEditModal.jsx
        │       ├── FacultyAwardEditModal.jsx
        │       ├── CollapsibleSection.jsx  # Alternate card-list dashboard pieces
        │       ├── DataCard.jsx
        │       └── SortToggle.jsx
        │
        └── pages/
            ├── Dashboard.js                # ACTIVE dashboard (search, filter, export, edit, delete)
            ├── Dashboard.jsx               # Alternate dashboard (not resolved by the build)
            ├── FacultyDashboard.js         # Older faculty dashboard (not routed)
            ├── Analytics.jsx               # KPI cards + charts
            ├── QuickActions.jsx            # Shortcut cards to every form
            ├── Home.jsx
            ├── ManageUsers.jsx             # Admin: roles / status / delete
            ├── admin/
            │   └── SystemLogs.jsx          # Admin: security log + PDF export
            ├── auth/
            │   ├── Login.js
            │   ├── ForgotPassword.js
            │   ├── ResetPassword.js
            │   └── ChangePassword.js
            ├── bulk/
            │   └── BulkUpload.js           # 11 uploader sections
            └── forms/
                ├── FacultyForm.js
                ├── PublicationForm.js
                ├── ProjectForm.js
                ├── ConferenceForm.js
                ├── PhdThesisForm.js
                ├── PatentForm.js
                ├── PublishedBookForm.js
                ├── DepartmentEventForm.js
                ├── InvitedTalkForm.js
                └── FacultyAwardForm.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18 and **npm** ≥ 9
- **Git**
- A running instance of the department **backend API**
- A **Google OAuth Client ID** (Web application) if you want Google SSO. Add your dev/prod origins under *Authorized JavaScript origins*.

### Installation

```bash
# 1. Clone
git clone https://github.com/Itzklp/department_project.git
cd department_project

# 2. Install dependencies (the app lives in department-frontend/)
cd department-frontend
npm install

# 3. Configure environment
cp .env.example .env      # or create .env manually – see next section

# 4. Start the dev server
npm start
```

The app opens at **http://localhost:3000**.

> ⚠️ Both the CRA dev server and the fallback API URL default to port `3000`. If your backend also uses `3000`, run the frontend on another port (e.g. `PORT=3001 npm start`; on Windows PowerShell: `$env:PORT=3001; npm start`).

---

## 🔧 Environment Variables

Create `department-frontend/.env`:

```env
# Base URL of the backend API (no trailing slash, include http:// or https://)
REACT_APP_API_BASE_URL=http://localhost:8080

# Google OAuth 2.0 Web Client ID (used by the "Sign in with Google" button)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

| Variable | Required | Description |
|---|:---:|---|
| `REACT_APP_API_BASE_URL` | ✅ | Backend origin. Read in `src/config.js`; falls back to `http://localhost:3000` when unset. |
| `REACT_APP_GOOGLE_CLIENT_ID` | for SSO | Passed to `GoogleOAuthProvider` in `src/index.js`. |

> Variables prefixed with `REACT_APP_` are embedded into the JS bundle at build time. **Never** put secrets in them. Restart `npm start` after editing `.env`.

**Backend requirements:** CORS must allow the frontend origin (e.g. `http://localhost:3000` for development, your production domain otherwise).

---

## 📜 Available Scripts

Run inside `department-frontend/`:

| Command | Description |
|---|---|
| `npm start` | Dev server with hot reload at `http://localhost:3000` |
| `npm run build` | Optimised production build in `build/` |
| `npm test` | Jest + React Testing Library in watch mode |
| `npm test -- --coverage` | Test run with coverage report |
| `npm run eject` | Eject from CRA (irreversible) |

---

## 🧭 Application Routes

### Public
| Path | Component | Purpose |
|---|---|---|
| `/login` | `Login` | Email/password + Google SSO |
| `/forgot-password` | `ForgotPassword` | Request a reset email |
| `/api/v1/auth/resetpassword/:resetToken` | `ResetPassword` | Set a new password from the emailed link |
| `/change-password` | `ChangePassword` | Mandatory change on first login |
| `/` | – | Redirects to `/dashboard` if a token exists, else `/login` |
| `*` | – | Any unknown path redirects to `/login` |

### Protected (wrapped in `ProtectedRoute` → `Layout` with Navbar)
| Path | Component | Access |
|---|---|---|
| `/dashboard` | `Dashboard` | All roles |
| `/analytics` | `Analytics` | All roles |
| `/quick-actions` | `QuickActions` | All roles |
| `/forms/publication` | `PublicationForm` | All roles |
| `/forms/project` | `ProjectForm` | All roles |
| `/forms/conference` | `ConferenceForm` | All roles |
| `/forms/phd-thesis` | `PhdThesisForm` | All roles |
| `/forms/patent` | `PatentForm` | All roles |
| `/forms/published-book` | `PublishedBookForm` | All roles |
| `/forms/department-event` | `DepartmentEventForm` | All roles |
| `/forms/invited-talk` | `InvitedTalkForm` | All roles |
| `/forms/faculty-award` | `FacultyAwardForm` | All roles |
| `/bulk-upload` | `BulkUpload` | All roles (backend-enforced) |
| `/forms/faculty` | `FacultyForm` | Admin (surfaced in Quick Actions) |
| `/manage-users` | `ManageUsers` | Admin (surfaced in Quick Actions) |
| `/system-logs` | `SystemLogs` | Admin (Navbar link) |

---

## 📖 Page-by-Page Guide

### Login (`/login`)
- Google SSO button (`POST /auth/google-login`) and email/password form (`POST /auth/login`).
- On success stores `token`, `role`, `isFirstLogin` in `localStorage`.
- `isFirstLogin === true` → `/change-password`; otherwise → `/dashboard`.
- Inline error banner, loading spinner, "Forgot password?" link. New accounts are created by an admin.

### Forgot / Reset / Change Password
- **Forgot**: submits email to `/auth/forgotpassword`; backend emails a reset link.
- **Reset**: reads `:resetToken` from the URL, validates (min 6 chars + match), `PUT /auth/resetpassword/:token`, then redirects to login.
- **Change**: requires current + new + confirm password (min 6 chars), `PUT /auth/updatepassword`, refreshes the token and clears `isFirstLogin`.

### Dashboard (`/dashboard`)
- Loads `GET /auth/me` then `GET /dashboard/my-dashboard`.
- **Faculty view** – "My Contributions": collapsible categories, records grouped by year, cards showing all populated fields.
- **Elevated view (Admin/HOD)** – "Department Administration": a scrollable tab bar (Publications, Projects, Conferences, PhD Thesis, Patents, Books, Events, Invited Talks, Awards) with counts.
- Search box (matches any field), year dropdown, per-category **Export → PDF / Excel**.
- Edit (opens the matching `*EditModal`) and Delete (opens `ConfirmationModal`, then `DELETE /api/v1/<resource>/:id`).
- Logs the user out if `/auth/me` fails.

### Analytics (`/analytics`)
- Same data source as the dashboard (`/dashboard/my-dashboard`).
- Heading and copy switch between *"My Impact Analytics"* and *"Department Analytics"* based on `isAdminOrHOD`.
- Year is derived from `year`, `dateSanctioned`, `date` or `createdAt` (in that order).
- Funding = sum of `totalINR` across projects, shown in ₹ Lakhs.

### Quick Actions (`/quick-actions`)
Card grid linking to every form plus Bulk Upload. Admins additionally see **Add New Faculty** and **Manage Users** cards.

### Manage Users (`/manage-users`, admin)
Table of users with name/email, role dropdown (`faculty` / `hod` / `admin`), Active/Suspended toggle and a delete action. Deleting a user only revokes login; the public faculty profile and academic records remain.

### System Logs (`/system-logs`, admin)
Timestamped security events with colour-coded badges – `LOGIN_SUCCESS`, `SSO_LOGIN`, `LOGIN_FAILED`, `REGISTER`, `PASSWORD_RESET` – showing email, details and IP. **Export PDF** produces `CISIS_Security_Logs.pdf`.

### Bulk Upload (`/bulk-upload`)
See [Bulk Upload (Excel)](#-bulk-upload-excel).

---

## 📝 Data Entry Forms & Fields

| Form | Key fields |
|---|---|
| **Faculty** *(admin)* | PSRN, first/last name, email, institute email, department, designation (Assistant Professor / Associate Professor / Professor / Sr. Professor / Head of Department / Other), joining date, research areas, courses taught, mobile, chamber no., intercom no., promotion dates (ASTP / ASOP / Professor / Sr. Professor), PhD scholars supervised, PhD DAC memberships, initial password. Comma-separated inputs become arrays. |
| **Publication** | Title, authors (multi-select), year, journal, volume, issue, pages, DOI |
| **Project** | PSRN, title, PI, Co-PI, collaborator, funding agency, scheme, sanctioned date, start date, completion date, status, notable achievements, sanction-letter link, total amount (INR), type (Sponsored / Consultancy), category (Govt / Industry / International) |
| **Conference** | Type (National / International), authors, paper title, conference name, pages, publisher, location, date |
| **PhD Thesis** | Scholar name, student ID, designation, stipend source(s), sponsored project name, mobile / lab / intercom no., thesis title, supervisor, co-supervisor(s), DAC member 1 & 2, year, status (default *Ongoing*), fellowship programme, milestone dates (joining, fellowship start, stipend end, QE attempt 1 & 2, PhD qualified, proposal, proposal approved, pre-submission, thesis submission, viva voce), remarks |
| **Patent** | Authors/inventors, title, application number, filing date, country (default India), status (default Filed) |
| **Published Book** | Title, author, type (default Book), publisher, series, year, link |
| **Department Event** | Title, coordinators, type (default Event), description, date, organised by (default Department) |
| **Invited Talk** | Title, speaker, venue, date, description |
| **Faculty Award** | Faculty name, title, organisation, journal info, year, category (Faculty / Student / Department) |

Forms `POST` to `/api/v1/<resource>` with a Bearer token. Faculty pickers (projects, publications, PhD theses) load from `GET /api/v1/faculty`.

---

## 📥 Bulk Upload (Excel)

Upload `.xlsx` files; the page shows the exact required columns for each type. **Column headers are case-sensitive.**

| Uploader | Endpoint | Required columns |
|---|---|---|
| Faculty | `/api/v1/faculty/bulk-upload` | PSRN, Name of the Faculty, Current Designation, Email ID, DOJ, Mobile No., Chamber No., Intercom No., Research Area, Promoted as ASTP / ASOP / Professor / Sr. Professor w.e.f., Name of Ph.D. Scholars Under Supervision, Name of PhD Students Under DAC Membership |
| Publications | `/api/v1/publication/bulk` | Title, Authors, Year, Journal, Volume, Issue, Pages, DOI |
| Projects | `/api/v1/project/bulk` | PSRN, Principal Investigator (PI), Co-PI, Type of Project (Govt/Industry/International), Type of Project (Consultancy/Sponsored), Project Title, Agency, Collaborator, Scheme, Sanctioned Date, Amount Sanctioned (Rs), Project Start Date, Project End Date, Status |
| Conferences | `/api/v1/conference/upload` | type, authors, title, conferenceName, pages, publisher, location, date |
| PhD Theses | `/api/v1/phdThesis/bulk` | Name, ID No, Desig, Source of Stipend, Mobile No, LAB No., Intercom No., DOJ, Institute Fellowship Started W.E.F, Supervisor, Co-Supervisor(s), Inst Stipend Ended on, Date (1st attempt of QE), Date (2nd attempt of QE (if any)), Qualifying Passed on, Date of Proposal Presentation, DAC Member1, DAC Member2, Proposed Topic of Research, Proposal Approved on, Date of Pre Sumission Seminar, Date of Viva Voce Exam, Remarks (if any) |
| Patents | `/api/v1/patent/bulk` | Authors, Title, Application Number, Filing Date, Country, Status |
| Published Books | `/api/v1/publishedBook/bulk` | Title, Author, Type, Publisher, Series, Year, Link |
| Department Events | `/api/v1/departmentEvent/bulk` | Title, Type, Description, Date, OrganizedBy |
| Invited Talks | `/api/v1/invitedTalk/bulk` | Speaker, Title, Event, Organizer, Location, Date, Mode, Role |
| Department Talks | `/api/v1/departmentTalk/bulk` | Speaker, Designation, Affiliation, Title, Date, Type |
| Faculty Awards | `/api/v1/facultyAward/bulk` | Faculty Name, Title, Organization, Journal Info, Year, Category |

**Tips:** multi-value fields (e.g. authors) may be separated by commas or `&`; use `YYYY-MM-DD` dates; empty optional cells are skipped. The file is sent as `multipart/form-data` under the field name `file`.

---

## 📤 Exports (PDF & Excel)

- **Dashboard → Export** (per category) respects the active search and year filter.
  - **PDF** – landscape A4, branded header ("BITS Pilani – CISIS Department"), generation timestamp, active filters, striped table. File: `CISIS_<category>_Report.pdf`
  - **Excel** – one sheet with human-readable column names. File: `CISIS_<category>_Report.xlsx`
- Category-specific columns are defined in `getExportConfigs()` in `src/pages/Dashboard.js` (e.g. the PhD export includes 26 columns covering all milestone dates).
- **System Logs → Export PDF** – `CISIS_Security_Logs.pdf`.

---

## 🔑 Authentication Flow

```
            ┌──────────────┐
            │   /login     │
            └──────┬───────┘
     email+password │ or Google SSO
                    ▼
         POST /api/v1/auth/login  |  /auth/google-login
                    │
        stores token, role, isFirstLogin in localStorage
                    │
        isFirstLogin? ── yes ──► /change-password ──► /dashboard
                    │ no
                    ▼
               /dashboard
```

- Every protected request sends `Authorization: Bearer <token>`.
- `ProtectedRoute` checks only for the presence of a token; the backend validates it. A failed `/auth/me` call on the dashboard logs the user out.
- **Logout** (Navbar) clears `token`, `role`, `isFirstLogin` and redirects to `/login`.

**`localStorage` keys:** `token`, `role`, `isFirstLogin`.

---

## 🔌 Backend API Contract

All endpoints are prefixed with `REACT_APP_API_BASE_URL` and `/api/v1`. Authenticated calls send `Authorization: Bearer <token>`.

### Auth
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | `{ email, password }` → `{ token, user/role, isFirstLogin }` |
| POST | `/auth/google-login` | `{ credential }` (Google ID token) → same shape |
| GET | `/auth/me` | Current user (`data.role`, …) |
| PUT | `/auth/updatepassword` | `{ currentPassword, newPassword }` → new `token` |
| POST | `/auth/forgotpassword` | Send reset email |
| PUT | `/auth/resetpassword/:resetToken` | `{ password }` |

### Dashboard
| Method | Endpoint | Response |
|---|---|---|
| GET | `/dashboard/my-dashboard` | `{ success, isAdminOrHOD, data: { publications, projects, conferences, phdThesis, patents, books, events, talks, awards } }` |

### Records (create / update / delete)
| Resource | Create | Update / Delete |
|---|---|---|
| Faculty | `POST /faculty` (list: `GET /faculty`) | – |
| Publication | `POST /publication` | `PUT/DELETE /publication/:id` |
| Project | `POST /project/add` | `PUT/DELETE /project/:id` |
| Conference | `POST /conference` | `PUT/DELETE /conference/:id` |
| PhD Thesis | `POST /phdThesis` | `PUT/DELETE /phdThesis/:id` |
| Patent | `POST /patent` | `PUT/DELETE /patent/:id` |
| Published Book | `POST /publishedBook` | `PUT/DELETE /publishedBook/:id` |
| Department Event | `POST /departmentEvent` | `PUT/DELETE /departmentEvent/:id` |
| Invited Talk | `POST /invitedTalk` | `PUT/DELETE /invitedTalk/:id` |
| Faculty Award | `POST /facultyAward` | `PUT/DELETE /facultyAward/:id` |

### Admin
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/users` | List users |
| PATCH | `/admin/users/:id/status` | Toggle `ACTIVE` / suspended |
| PATCH | `/admin/users/:id/role` | `{ role: 'faculty' \| 'hod' \| 'admin' }` |
| DELETE | `/admin/users/:id` | Revoke login |
| GET | `/logs` | Security logs (`timestamp, action, email, ipAddress, details`) |

### Bulk
`POST <endpoint>` with `multipart/form-data` (`file`). See the [table above](#-bulk-upload-excel).

Successful responses are expected to include `success: true`; errors should return `{ message }`.

---

## 🧩 Component Reference

| Component | Description |
|---|---|
| `Layout` | Sticky Navbar, global `Toaster`, and an `<Outlet/>` inside a max-width container |
| `Navbar` | BITS Pilani logo + "CISIS Department"; links to Dashboard, Analytics, Quick Actions, System Logs (admin only) and Logout; mobile hamburger menu |
| `ProtectedRoute` | Redirects to `/login` when no token is present |
| `ConfirmationModal` | Reusable confirm dialog with loading and error states |
| `BulkUploader` | Upload card: file-type validation, required-columns chips, upload result banner |
| `FormWrapper` | Page wrapper with title and "Back to Dashboard" button |
| `*EditModal` (×9) | Per-record edit dialogs launched from the dashboard |
| `CollapsibleSection`, `DataCard`, `SortToggle` | Building blocks for the alternate `Dashboard.jsx` |

---

## 🎨 Styling & UI

- Tailwind CSS v4 via `@import "tailwindcss"` in `src/index.css`; utility-first classes throughout.
- Blue/slate palette aligned with institutional branding.
- Responsive breakpoints (`sm`, `md`, `lg`, `xl`) for grids, navbar and tables; wide tables scroll horizontally.
- Chart palette: `#2563eb #16a34a #9333ea #ea580c #eab308 #0ea5e9 #ec4899 #64748b #14b8a6`.

---

## 🧪 Testing

```bash
cd department-frontend
npm test                 # watch mode
npm test -- --coverage   # coverage
```

Uses Jest and React Testing Library (`@testing-library/react`, `jest-dom`, `user-event`). `src/App.test.js` is still the default CRA smoke test and should be replaced with real tests.

---

## ☁️ Deployment

```bash
cd department-frontend
npm run build
```

Serve the generated `build/` folder from any static host (Vercel, Netlify, Nginx, S3 + CloudFront, GitHub Pages, …).

- Set `REACT_APP_API_BASE_URL` and `REACT_APP_GOOGLE_CLIENT_ID` **before** building.
- Add the production origin to the Google OAuth client's *Authorized JavaScript origins* and to the backend's CORS allow-list.
- Because this is a single-page app using `BrowserRouter`, configure the host to rewrite all paths to `index.html` (e.g. Netlify `_redirects`: `/* /index.html 200`; Vercel `rewrites`; Nginx `try_files $uri /index.html;`).

---

## ⚠️ Known Limitations

- **Bulk upload URL & auth:** `BulkUploader` defaults to `http://localhost:8080` (`apiBasePath` prop) instead of `config.API_BASE_URL`, and does not send the `Authorization` header. Point it at `config.API_BASE_URL` and add the Bearer token before deploying.
- **Duplicate dashboard files:** `Dashboard.js` and `Dashboard.jsx` both exist. CRA resolves `.js` before `.jsx`, so `Dashboard.js` is the live one; `Dashboard.jsx`, `FacultyDashboard.js`, `CollapsibleSection`, `DataCard` and `SortToggle` are currently unused by the routed app.
- **Reset-password route path:** the route is `/api/v1/auth/resetpassword/:resetToken` so it matches the link format emailed by the backend.
- **Client-side guards only:** route protection checks token presence; real authorization must remain on the server.
- **Tests:** only the default CRA smoke test exists.
- `joi` and `http-errors` are listed in `package.json` but not currently imported by the frontend.

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

Please keep changes focused, follow the existing Tailwind/React conventions, and run `npm run build` before submitting to make sure ESLint passes.

---

## 📞 Support

Open an issue at <https://github.com/Itzklp/department_project/issues>, or contact the CISIS Department admin team.

---

**Built with ❤️ using React, Tailwind CSS and Recharts for the CISIS Department, BITS Pilani.**
