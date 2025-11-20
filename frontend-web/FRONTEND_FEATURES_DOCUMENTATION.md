# üìö FRONTEND FEATURES DOCUMENTATION
**ƒê·ªì √Ån Chuy√™n Ng√†nh - H·ªá th·ªëng Qu·∫£n l√Ω Nh√¢n s·ª±**

---

## üìñ M·ª§C L·ª§C

- [Phase 1: Shared Components](#phase-1-shared-components)
- [Phase 2: Shared Services](#phase-2-shared-services)
- [Phase 3: Admin Module](#phase-3-admin-module)
- [Phase 4: Employee Module](#phase-4-employee-module)
- [Phase 5: Accounting Module](#phase-5-accounting-module)
- [Phase 6: Project Manager Module](#phase-6-project-manager-module)
- [Authentication System](#authentication-system)
- [Bug Fixes & Improvements](#bug-fixes--improvements)

---

## üéØ T·ªîNG QUAN

**C√¥ng ngh·ªá:**
- React 18 + Vite
- React Router v6
- Axios
- LocalStorage for auth persistence
- Material Design inspired UI

**C·∫•u tr√∫c:**
```
frontend-web/
‚îú‚îÄ‚îÄ src/
‚îÇ   ‚îú‚îÄ‚îÄ features/           # Feature-based modules
‚îÇ   ‚îÇ   ‚îú‚îÄ‚îÄ auth/          # Authentication
‚îÇ   ‚îÇ   ‚îú‚îÄ‚îÄ admin/         # Admin features
‚îÇ   ‚îÇ   ‚îú‚îÄ‚îÄ employee/      # Employee features
‚îÇ   ‚îÇ   ‚îú‚îÄ‚îÄ accounting/    # Accounting features
‚îÇ   ‚îÇ   ‚îú‚îÄ‚îÄ projects/      # Project Manager features
‚îÇ   ‚îÇ   ‚îî‚îÄ‚îÄ dashboard/     # Role-based dashboards
‚îÇ   ‚îú‚îÄ‚îÄ shared/
‚îÇ   ‚îÇ   ‚îú‚îÄ‚îÄ components/    # Reusable components
‚îÇ   ‚îÇ   ‚îú‚îÄ‚îÄ services/      # API services
‚îÇ   ‚îÇ   ‚îú‚îÄ‚îÄ utils/         # Utilities
‚îÇ   ‚îÇ   ‚îî‚îÄ‚îÄ constants/     # Constants
‚îÇ   ‚îú‚îÄ‚îÄ modules/           # Module exports
‚îÇ   ‚îú‚îÄ‚îÄ routes/            # Routing configuration
‚îÇ   ‚îî‚îÄ‚îÄ layouts/           # Layout components
```

---
## ?? PHASE 1: SHARED COMPONENTS

### 1.1 Feedback Components
- **Modal** - Generic modal dialog
- **Loading** - Loading spinner with variants

### 1.2 Display Components  
- **StatusBadge** - Colored status labels
- **ErrorMessage** - Error display with retry
- **EmptyState** - Empty data placeholder
- **ApprovalCard** - Approval request cards

### 1.3 Layout Components
- **PageLayout** - Consistent page wrapper
- **FilterBar** - Search and filter UI

### 1.4 Form Components
- **FormModal** - Modal with forms
- **FormField** - Universal input field
- **DatePicker** - Date input

### 1.5 Table Components
- **DataTable** - Generic data table
- **Pagination** - Table pagination

### 1.6 Upload Components
- **FileUpload** - File upload with drag & drop

**Total: 14 components**

---
## ?? PHASE 2: SHARED SERVICES

### 2.1 API Service (`api.service.js`)
- Axios instance v?i base configuration
- Request/Response interceptors
- Automatic token refresh on 401
- Error handling

### 2.2 Auth Service (`auth.service.js`)
- `login(credentials)` - User login
- `logout()` - User logout
- `refreshToken()` - Refresh access token
- Token management

### 2.3 Profile Service (`profile.service.js`)
- `getProfile()` - Get user profile
- `updateProfile(data)` - Update profile
- `changePassword(data)` - Change password

### 2.4 Users Service (`users.service.js`)
- `getAll()` - Get all users
- `create(data)` - Create user
- `update(id, data)` - Update user
- `delete(id)` - Delete user
- `activate(id)` / `deactivate(id)` - Toggle status

### 2.5 Role Requests Service (`role-requests.service.js`)
- `getAll()` - Get all role requests
- `getPending()` - Get pending requests
- `approve(id)` - Approve request
- `reject(id, reason)` - Reject request

### 2.6 Payroll Service (`payroll.service.js`)
- `getAll()` - Get all payrolls
- `getByMonth(month, year)` - Get by month
- `calculate(employeeId, month, year)` - Calculate
- `markAsPaid(id)` - Mark as paid

### 2.7 Attendance Service (`attendance.service.js`)
- `getAll()` - Get all records
- `getByMonth(employeeId, year, month)` - Get by month
- `getStatus(employeeId)` - Check-in status
- `checkIn(employeeId, date)` - Check in
- `checkOut(recordId)` - Check out
- `create(data)` / `update(id, data)` / `delete(id)` - CRUD

### 2.8 Leave Service (`leave.service.js`)
- `getAll()` - Get all leaves
- `getByEmployee(employeeId)` - Get by employee
- `getPending()` - Get pending leaves
- `create(data)` - Create leave request
- `approve(id, note)` - Approve leave
- `reject(id, reason)` - Reject leave
- `delete(id)` - Delete leave

### 2.9 Project Service (`project.service.js`)
- `getAll()` - Get all projects
- `getById(id)` - Get project details
- `create(data)` - Create project
- `update(id, data)` - Update project
- `delete(id)` - Delete project
- `addMember(projectId, userId)` - Add member
- `removeMember(projectId, userId)` - Remove member

### 2.10 Issue Service (`issue.service.js`)
- `getAll()` - Get all issues
- `getByProject(projectId)` - Get by project
- `create(data)` - Create issue
- `update(id, data)` - Update issue
- `updateStatus(id, status)` - Update status
- `delete(id)` - Delete issue
- `addComment(issueId, comment)` - Add comment

**Total: 9 services**

---
## ?? PHASE 3: ADMIN MODULE

### 3.1 Users Management Page
**File:** `features/admin/users/pages/UsersManagementPage.jsx`

**Ch?c nang:**
- Xem danh s·ch t?t c? users
- T?o user m?i (username, email, password, role)
- C?p nh?t thÙng tin user
- XÛa user
- Activate/Deactivate user
- Filter theo role, status
- Search by username/email

**UI Components:**
- DataTable v?i columns: Username, Email, Role, Status, Actions
- FormModal cho Create/Edit
- StatusBadge cho tr?ng th·i
- Action buttons: Edit, Delete, Activate/Deactivate

### 3.2 Role Requests Page
**File:** `features/admin/role-requests/pages/RoleRequestsPage.jsx`

**Ch?c nang:**
- Xem danh s·ch don xin d?i role t? HR Manager
- Approve role change request
- Reject role change request v?i l˝ do
- Filter theo status (pending, approved, rejected)
- Xem chi ti?t request: User, Current Role ? New Role, Reason

**UI Components:**
- ApprovalCard list
- Approve/Reject buttons
- Filter dropdown
- Status badges

### 3.3 Audit Logs Page
**File:** `features/admin/audit-logs/pages/AuditLogsPage.jsx`

**Ch?c nang:**
- Xem l?ch s? ho?t d?ng h? th?ng
- Filter theo:
  - Action type (CREATE, UPDATE, DELETE, LOGIN, LOGOUT)
  - Date range
  - User
- Export logs to CSV
- Search by entity/details

**UI Components:**
- DataTable v?i columns: Timestamp, User, Action, Entity, Details
- FilterBar v?i date picker, action dropdown
- Export button
- Pagination

### 3.4 Module Export
**File:** `modules/admin/index.js`
```javascript
export { default as UsersManagementPage } from '@/features/admin/users/pages/UsersManagementPage'
export { default as RoleRequestsPage } from '@/features/admin/role-requests/pages/RoleRequestsPage'
export { default as AuditLogsPage } from '@/features/admin/audit-logs/pages/AuditLogsPage'
```

**Total: 3 pages**

---
## ?? PHASE 4: EMPLOYEE MODULE

### 4.1 Profile Page
**File:** `features/employee/profile/ProfilePage.jsx`

**Ch?c nang:**
- Xem thÙng tin c· nh‚n
- C?p nh?t: H? tÍn, Email, S? di?n tho?i, –?a ch?
- –?i m?t kh?u (old password, new password, confirm)
- Upload avatar (future feature)

**UI:**
- Profile info card
- Edit form modal
- Change password form
- Success/Error notifications

### 4.2 My Payroll Page
**File:** `features/employee/payroll/MyPayrollPage.jsx`

**Ch?c nang:**
- Xem b?ng luong c?a b?n th‚n theo th·ng
- Filter theo th·ng/nam
- Xem chi ti?t: Base Salary, Allowances, Overtime, Deductions, Total
- Export payslip to PDF (future)

**UI:**
- Month/Year selector
- DataTable v?i payroll details
- Summary cards: Total Earned, Total Deductions, Net Salary
- Download button

### 4.3 My Attendance Page
**File:** `features/employee/attendance/MyAttendancePage.jsx`

**Ch?c nang:**
- Xem l?ch s? ch?m cÙng c· nh‚n
- Check-in/Check-out (mock - ch? UI)
- Xem t?ng gi? l‡m vi?c theo ng‡y
- Status: Normal, Late, Early leave
- Filter theo th·ng

**UI:**
- Check-in/Check-out button v?i real-time status
- DataTable: Date, Time In, Time Out, Total Hours, Status
- Monthly summary: Total days, Total hours
- Calendar view (future)

### 4.4 My Leave Page  
**File:** `features/employee/leave/MyLeavePage.jsx`

**Ch?c nang:**
- Xem danh s·ch don ngh? phÈp c?a b?n th‚n
- T?o don ngh? phÈp m?i
  - Lo?i phÈp: PhÈp nam, Ngh? ?m, KhÙng luong, Kh·c
  - T? ng‡y ? –?n ng‡y
  - L˝ do
- XÛa don ch? duy?t
- Xem tr?ng th·i: Pending, Approved, Rejected

**UI:**
- Create leave button
- FormModal cho t?o don m?i
- DataTable: Type, From-To, Days, Status, Actions
- StatusBadge cho m?i don
- Delete button cho pending requests

### 4.5 My Documents Page
**File:** `features/employee/documents/MyDocumentsPage.jsx`

**Ch?c nang:**
- Xem danh s·ch t‡i li?u c· nh‚n
  - H?p d?ng lao d?ng
  - B?ng luong
  - Gi?y t? kh·c
- Download t‡i li?u (mock - alert)
- Xem thÙng tin: TÍn, Lo?i, Ng‡y t?o, KÌch thu?c

**UI:**
- DataTable: Document Name, Type, Date, Size, Actions
- Download button
- Mock data (backend storage chua implement)

### 4.6 Module Export
**File:** `modules/employee/index.js`
```javascript
export { default as ProfilePage } from '@/features/employee/profile/ProfilePage'
export { default as MyPayrollPage } from '@/features/employee/payroll/MyPayrollPage'
export { default as MyAttendancePage } from '@/features/employee/attendance/MyAttendancePage'
export { default as MyLeavePage } from '@/features/employee/leave/MyLeavePage'
export { default as MyDocumentsPage } from '@/features/employee/documents/MyDocumentsPage'
```

**Total: 5 pages**

---
## ?? PHASE 5: ACCOUNTING MODULE

### 5.1 Payroll Management Page
**File:** `features/accounting/payroll/PayrollManagementPage.jsx`

**Ch?c nang:**
- Xem b?ng luong T?T C? nh‚n viÍn
- Filter theo th·ng/nam, phÚng ban, status
- TÌnh luong t? d?ng cho nh‚n viÍn
- –·nh d?u d„ tr? luong
- Export b?ng luong to CSV/Excel
- Xem chi ti?t luong t?ng ngu?i

**UI:**
- Filter bar: Month/Year, Department, Status
- DataTable: Employee ID, Name, Department, Base Salary, Allowances, OT, Deductions, Total, Status, Actions
- Calculate button
- Mark as Paid button
- Export button
- Pagination

**Backend Integration:**
- `GET /api/payroll?thang={month}&nam={year}`
- `POST /api/payroll/calculate`
- `PUT /api/payroll/{id}/mark-paid`

### 5.2 Attendance Management Page
**File:** `features/accounting/attendance/AttendanceManagementPage.jsx`

**Ch?c nang:**
- Qu?n l˝ ch?m cÙng T?T C? nh‚n viÍn
- CRUD attendance records
  - Create: Manual check-in/out cho nh‚n viÍn
  - Update: S?a gi? v‡o/ra
  - Delete: XÛa b?n ghi sai
- Filter theo ng‡y, nh‚n viÍn, phÚng ban
- Export attendance data
- View statistics: Total hours, Late count, Absent count

**UI:**
- Filter bar: Date range, Employee, Department
- DataTable: Employee, Date, Time In, Time Out, Total Hours, Status, Actions
- Add Record button ? FormModal
- Edit/Delete buttons per row
- Export button

**Backend Integration:**
- `GET /api/chamcong?ngay={date}&nhanvienId={id}`
- `POST /api/chamcong` - Create record
- `PUT /api/chamcong/{id}` - Update record
- `DELETE /api/chamcong/{id}` - Delete record

### 5.3 Leave Approvals Page (Step 2)
**File:** `features/accounting/leave-approvals/LeaveApprovalsPage.jsx`

**Ch?c nang:**
- Duy?t don ngh? phÈp BU?C 2 (sau khi HR Manager duy?t bu?c 1)
- Xem danh s·ch don d„ du?c HR duy?t bu?c 1
- Approve/Reject v?i ghi ch˙
- Filter theo lo?i phÈp, tr?ng th·i
- Xem thÙng tin: Employee, Type, From-To, Days, Reason, HR Approver

**UI:**
- ApprovalCard list ho?c DataTable
- Filter: Leave Type, Status
- Approve/Reject buttons v?i note input
- Employee info display
- Leave balance check

**Backend Integration:**
- `GET /api/nghiphep/pending-step-2`
- `POST /api/nghiphep/{id}/approve-step-2`
- `POST /api/nghiphep/{id}/reject-step-2`

### 5.4 Module Export
**File:** `modules/accounting/index.js`
```javascript
export { default as PayrollManagementPage } from '@/features/accounting/payroll/PayrollManagementPage'
export { default as AttendanceManagementPage } from '@/features/accounting/attendance/AttendanceManagementPage'
export { default as LeaveApprovalsPage } from '@/features/accounting/leave-approvals/LeaveApprovalsPage'
```

**Total: 3 pages**

---
## ?? PHASE 6: PROJECT MANAGER MODULE

### 6.1 Projects List Page
**File:** `features/projects/pages/ProjectsListPage.jsx`

**Ch?c nang:**
- Xem danh s·ch T?T C? d? ·n
- T?o d? ·n m?i
  - TÍn d? ·n
  - MÙ t?
  - Ng‡y b?t d?u/k?t th˙c
  - Tr?ng th·i: Planning, Active, On Hold, Completed
  - ThÍm members
- C?p nh?t thÙng tin d? ·n
- XÛa d? ·n
- Filter theo status
- Search by name

**UI:**
- Project cards grid ho?c table view
- Create Project button ? Modal
- Filter bar: Status, Search
- Each card: Name, Status, Progress, Members count, Deadline
- Actions: Edit, Delete, View Details

**Backend Integration:**
- `GET /api/projects`
- `POST /api/projects` - Create
- `PUT /api/projects/{id}` - Update
- `DELETE /api/projects/{id}` - Delete

### 6.2 Issues Page (Tasks Management)
**File:** `features/projects/pages/IssuesPage.jsx`

**Ch?c nang:**
- Qu?n l˝ tasks/issues trong d? ·n
- Filter theo project
- Create issue/task
  - Title
  - Description
  - Assignee
  - Priority: Low, Medium, High, Critical
  - Status: Todo, In Progress, Review, Done
  - Due date
- Update issue status (drag & drop ho?c dropdown)
- Assign/Reassign task
- Add comments to issue
- Delete issue

**UI:**
- Project selector dropdown
- Kanban board view (Todo | In Progress | Review | Done)
- Or DataTable view
- Create Issue button ? Modal
- Filter: Assignee, Priority, Status
- Issue details modal v?i comments

**Backend Integration:**
- `GET /api/issues?projectId={id}`
- `POST /api/issues` - Create
- `PUT /api/issues/{id}` - Update
- `PUT /api/issues/{id}/status` - Update status only
- `POST /api/issues/{id}/comments` - Add comment
- `DELETE /api/issues/{id}` - Delete

### 6.3 Sprints Page
**File:** `features/projects/pages/SprintsPage.jsx`

**Ch?c nang:**
- Qu?n l˝ sprints (Agile/Scrum)
- Create sprint
  - Sprint name
  - Start/End date
  - Goals
  - Project
- Add issues to sprint
- Mark sprint as completed
- View sprint report (velocity, burndown - future)

**UI:**
- Sprint timeline view
- Current sprint highlight
- Sprint cards: Name, Date range, Issues count, Status
- Create Sprint button
- Add issues to sprint modal
- Sprint details page

**Backend Integration:**
- Mock data for now (Backend API chua cÛ)
- Future: `/api/sprints`, `/api/sprints/{id}/issues`

### 6.4 Additional Project Manager Features
**Files:** `features/project/*`

#### TimesheetPage
- PM cÛ th? xem attendance c?a b?n th‚n
- Check-in/Check-out
- Integrated v?i attendance service

#### LeavePage
- PM t?o don ngh? phÈp cho b?n th‚n
- Xem l?ch s? don c?a mÏnh

#### ApprovalsPage
- PM duy?t don ngh? phÈp c?a members trong team (future)
- Hi?n t?i: View only

### 6.5 Module Export
**File:** `modules/project/index.js`
```javascript
export { default as ProjectsListPage } from '@/features/projects/pages/ProjectsListPage'
export { default as IssuesPage } from '@/features/projects/pages/IssuesPage'
export { default as SprintsPage } from '@/features/projects/pages/SprintsPage'
export { default as TimesheetPage } from '@/features/project/timesheet/TimesheetPage'
export { default as LeavePage } from '@/features/project/leave/LeavePage'
export { default as ApprovalsPage } from '@/features/project/approvals/ApprovalsPage'
```

**Total: 6 pages**

---
## ?? AUTHENTICATION SYSTEM

### Auth Context
**File:** `features/auth/context/AuthContext.jsx`

**Ch?c nang:**
- Global auth state management
- User authentication state
- Login/Logout handlers
- Token management
- Session persistence

**Key Features:**
1. **Login Flow**
   - Call backend `/api/auth/login`
   - Parse response: `{ accessToken, refreshToken, tokenType, expiresIn, user: { userId, username, email, role } }`
   - Save to localStorage: `accessToken`, `refreshToken`, `userRole`, `username`, `expiresAt`
   - Set user state
   - Redirect based on role ? Dashboard

2. **Session Restoration (Reload)**
   - On app init, check localStorage for token
   - Validate token expiry
   - Restore user from localStorage (khÙng call API)
   - If token valid ? restore session
   - If token expired ? clear and redirect to login

3. **Auto Logout**
   - Token expired ? clear session
   - User clicks logout ? call API + clear localStorage

4. **Token Refresh**
   - Axios interceptor catch 401
   - Auto refresh token
   - Retry failed request

### Storage Utils
**File:** `shared/utils/storage.utils.js`

**Functions:**
- `getToken()` / `setToken(token)`
- `getRefreshToken()` / `setRefreshToken(token)`
- `getUserRole()` / `setUserRole(role)`
- `getUsername()` / `setUsername(username)`
- `getExpiresAt()` / `setExpiresAt(timestamp)`
- `isTokenValid()` - Check if token not expired
- `removeToken()` - Clear all auth data
- `setAuthData({ accessToken, refreshToken, role, username, expiresAt })`

### Route Guards
**Files:** `routes/PrivateRoute.jsx`, `routes/RoleRoute.jsx`

#### PrivateRoute
- Protect routes that require authentication
- Redirect to `/login` if not authenticated

#### RoleRoute
- Protect routes by role
- Check `user.role` in `allowedRoles`
- Redirect to `/unauthorized` if wrong role
- Redirect to `/login` if not authenticated

### Login Page
**File:** `pages/auth/LoginPage.jsx`

**UI:**
- Username input
- Password input
- Remember me checkbox (future)
- Forgot password link (future)
- Login button

**Flow:**
1. User nh?p credentials
2. Call `login({ username, password })`
3. If success ? redirect to role-based dashboard
4. If error ? show error message

### Role-Based Routing
**File:** `routes/index.jsx`

**Routes:**
```javascript
/login ? LoginPage (public)
/unauthorized ? UnauthorizedPage (public)

/admin ? AdminDashboard (role: ADMIN)
/hr ? HrManagerDashboard (role: MANAGER_HR)  
/accounting ? AccountingManagerDashboard (role: MANAGER_ACCOUNTING)
/projects ? ProjectManagerDashboard (role: MANAGER_PROJECT)
/employee ? EmployeeDashboard (role: EMPLOYEE)
```

**Redirect Logic:**
```javascript
ADMIN ? /admin
MANAGER_HR ? /hr
MANAGER_ACCOUNTING ? /accounting
MANAGER_PROJECT ? /projects
EMPLOYEE ? /employee
```

### Test Accounts
```javascript
admin / Admin@123          ? ADMIN
hr / HrManager@123         ? MANAGER_HR
accounting / Accounting@123 ? MANAGER_ACCOUNTING
pm / ProjectManager@123    ? MANAGER_PROJECT
employee / Employee@123    ? EMPLOYEE
```

---
