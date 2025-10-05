# KẾ HOẠCH HỢP NHẤT 4 ĐỒ ÁN - HỆ THỐNG QUẢN LÝ DOANH NGHIỆP

## 📋 TỔNG QUAN DỰ ÁN

### Mô tả
Hợp nhất 4 đồ án thành một hệ thống quản lý doanh nghiệp tích hợp (ERP) với các module:
1. **QLNS** - Quản lý Nhân sự
2. **QuanLyCongViec** - Quản lý Dự án & Công việc
3. **ChatApp** - Giao tiếp nội bộ
4. **CloudStorage** - Lưu trữ File & Tài liệu

### Công nghệ
- **Backend**: Spring Boot 3.5.6 (Java 21), REST API
- **Database**: SQL Server 2019+
- **Frontend Web**: React 18+ (TypeScript)
- **Mobile**: Android (Kotlin, Jetpack Compose)
- **Security**: JWT Authentication, Spring Security
- **Storage**: MinIO / AWS S3 compatible
- **Real-time**: WebSocket (STOMP)

### Team
- **Backend**: Dũng + Trường
- **Frontend Web**: Nhân (React)
- **Frontend Mobile**: Việt (Android/Kotlin)
- **Thời gian**: 2 tháng (8 tuần)

---

## 🎯 CHỨC NĂNG CHÍNH

### ✅ MODULE NHÂN SỰ (QLNS)

**Core Features:**
- ✅ Quản lý Nhân viên (CRUD, profile, search, filter)
- ✅ Quản lý Phòng ban & Cơ cấu tổ chức
- ✅ Quản lý Chức vụ & Phân quyền
- ✅ Hợp đồng lao động (theo dõi thời hạn, notification)
- ✅ Chấm công cơ bản (check-in/out web/mobile, tính giờ làm)
- ✅ Tính lương cơ bản (lương cứng + phụ cấp + thưởng)
- ✅ Quản lý nghỉ phép (đăng ký, duyệt, tracking)
- ✅ Authentication & Authorization (ADMIN, MANAGER, EMPLOYEE)

---

### ✅ MODULE QUẢN LÝ CÔNG VIỆC (Project Management)

**Core Features:**
- ✅ Quản lý Dự án (CRUD, members, timeline)
- ✅ Quản lý Task/Issue (Jira-like)
  - Issue types: Task, Bug, Story, Epic
  - Statuses: To Do → In Progress → Review → Done (Fixed workflow)
  - Priority: Low, Medium, High, Critical
  - Assignee, Reporter
  - Estimated hours vs Actual hours (đơn giản)
- ✅ Sprint Management (Scrum board)
- ✅ Backlog Management
- ✅ Kanban Board (drag & drop)
- ✅ Comments & Collaboration
- ✅ File attachments (tích hợp Cloud Storage)
- ✅ Activity History / Audit log
- ✅ Dashboard & Basic Reports
  - Burndown chart (đơn giản)
  - Velocity chart (đơn giản)
  - Workload per user

---

### ✅ MODULE CHAT (Internal Communication)

**Core Features:**
- ✅ Chat 1-1 và Group chat
- ✅ Project chat (auto-create khi tạo project)
- ✅ Tin nhắn realtime (WebSocket/STOMP)
- ✅ Send text messages
- ✅ Send images/files (tích hợp Cloud Storage)
- ✅ Message status (delivered, seen)
- ✅ Edit/Delete messages
- ✅ Search messages
- ✅ Notifications push

**Simplified:**
- Contact list: Tất cả nhân viên đều có thể chat với nhau (không cần friend system phức tạp)

---

### ✅ MODULE CLOUD STORAGE

**Core Features:**
- ✅ Upload/Download files
- ✅ Folder structure (Personal, Shared, Project folders)
- ✅ File metadata (name, size, type, owner, dates)
- ✅ File sharing (public link, permission-based)
  - Permissions: VIEW, DOWNLOAD, EDIT
  - Public links với expiry
- ✅ Version control cơ bản (lưu versions, không diff)
- ✅ Search files (by name, type)
- ✅ File preview (image, PDF)
- ✅ MinIO/S3 storage backend

---

## 📊 DATABASE SCHEMA

### Tổng số bảng: **24 bảng**

#### Core Tables (4)
- `users` - User accounts (authentication)
- `nhan_vien` - Employee info
- `phong_ban` - Departments
- `chuc_vu` - Positions

#### HR Tables (4)
- `hop_dong` - Contracts
- `cham_cong` - Attendance (check-in/out)
- `bang_luong` - Salary
- `nghi_phep` - Leave requests

#### Project Management Tables (7)
- `projects` - Projects
- `project_members` - Project members
- `sprints` - Sprints
- `issue_types` - Task types (Task, Bug, Story, Epic)
- `issue_statuses` - Task statuses (To Do, In Progress, Review, Done)
- `issues` - Tasks/Issues
- `comments` - Issue comments

#### Chat Tables (4)
- `chat_rooms` - Chat rooms
- `chat_room_members` - Room members
- `messages` - Messages
- `message_status` - Message status (delivered/seen)

#### Cloud Storage Tables (3)
- `folders` - Folder structure
- `files` - File metadata
- `file_shares` - File sharing

#### System Tables (2)
- `notifications` - Notifications
- `activity_logs` - Activity logs

**Chi tiết:** Xem file [database_schema_clean.sql](database_schema_clean.sql)

---

## 📅 KẾ HOẠCH 8 TUẦN

### 🔹 GIAI ĐOẠN 1: SETUP & CORE (Tuần 1-2)

#### Tuần 1: Setup Project & Database

**Dũng (BE):**
- Setup Spring Boot multi-module project
- Cấu hình database connection
- Chạy migration script (24 bảng)
- Setup JWT Security Configuration
- Implement Authentication APIs:
  - `/api/auth/register`
  - `/api/auth/login`
  - `/api/auth/refresh`
  - `/api/auth/logout`
  - `/api/auth/me`

**Trường (BE):**
- Setup testing framework (JUnit, Mockito)
- Setup MinIO với Docker
- Implement User Management APIs:
  - `/api/users` (CRUD, search, pagination)
  - `/api/users/{id}/avatar` (upload)
- Setup GlobalExceptionHandler
- Viết unit tests cho Auth & User

**Nhân (FE Web):**
- Setup React project (Vite + TypeScript)
- Install dependencies (React Router, Axios, Ant Design, TanStack Query, Zustand)
- Setup Axios interceptor (JWT)
- Tạo Login/Register pages
- Tạo Main Layout (Header, Sidebar)
- Tạo Protected Route

**Việt (Mobile):**
- Setup Android project (Kotlin + Compose)
- Cấu hình dependencies (Retrofit, Room, Hilt, Coil)
- Setup MVVM architecture
- Tạo Login/Register screens
- Setup JWT storage (DataStore)
- Setup Navigation

---

#### Tuần 2: User Profile & Admin

**Dũng (BE):**
- API `/api/auth/change-password`
- Tạo Entities cho HR tables
- Setup relationships (JPA)

**Trường (BE):**
- API User profile management
- API Admin user management
- Image processing cho avatar
- Unit tests

**Nhân (FE Web):**
- Profile page (view, edit, avatar upload)
- Change password modal
- Admin user management pages
- Header với user menu dropdown

**Việt (Mobile):**
- Profile screen (view, edit, avatar)
- Change password
- Settings screen
- Bottom Navigation

---

### 🔹 GIAI ĐOẠN 2: HR MODULE (Tuần 3-4)

#### Tuần 3: Nhân viên, Phòng ban, Chức vụ

**Dũng (BE):**
- API Quản lý Nhân viên (CRUD, search, filter)
- API Phòng ban (CRUD, members)
- Validation business logic

**Trường (BE):**
- API Chức vụ (CRUD)
- API Hợp đồng (CRUD, lịch sử, expiring notification)
- Unit tests

**Nhân (FE Web):**
- Trang Nhân viên (table, search, filter, pagination)
- Form Thêm/Sửa nhân viên (validation)
- Trang chi tiết nhân viên (tabs)
- Trang Phòng ban (CRUD)
- Trang Chức vụ (CRUD)

**Việt (Mobile):**
- Employee list (search, filter, pull-to-refresh)
- Employee detail (read-only, call, chat button)
- Department list
- Offline cache với Room Database

---

#### Tuần 4: Chấm công & Lương

**Dũng (BE):**
- API Chấm công (CRUD, check-in, check-out)
- API `/api/cham-cong/my` - Chấm công của user hiện tại
- API `/api/cham-cong/report` - Báo cáo chấm công
- Logic tính số giờ làm, trạng thái

**Trường (BE):**
- API Bảng lương (CRUD, calculate)
- API `/api/bang-luong/my` - Lương của user
- API `/api/bang-luong/export` - Export Excel (Apache POI)
- Logic tính lương: lương cơ bản + phụ cấp + thưởng

**Nhân (FE Web):**
- Trang chấm công (calendar view, check-in/out button)
- Trang báo cáo chấm công (filter, chart)
- Trang quản lý lương (table, filter)
- Form tính lương tháng (admin)
- Export Excel

**Việt (Mobile):**
- Chấm công screen (check-in/out với GPS optional)
- Lịch sử chấm công
- Xem bảng lương của bản thân
- Push notification nhắc chấm công

---

### 🔹 GIAI ĐOẠN 3: PROJECT MANAGEMENT (Tuần 5-6)

#### Tuần 5: Projects & Issues

**Dũng (BE):**
- API Projects (CRUD, members, dashboard)
- API Sprints (CRUD, start, complete)
- Logic: chỉ 1 sprint ACTIVE per project

**Trường (BE):**
- API Issues (CRUD, search, filter)
- API `/api/issues/{id}/assign` - Gán task
- API `/api/issues/{id}/change-status`
- API Comments (CRUD)
- Auto-generate issue key (PROJ-001)

**Nhân (FE Web):**
- Trang Projects (grid cards, create)
- Trang chi tiết Project:
  - Tab Overview (dashboard)
  - Tab Backlog (issues chưa vào sprint)
  - Tab Sprint Board (Kanban: To Do, In Progress, Review, Done)
  - Tab Members
- Modal tạo/sửa issue
- Drag & drop issues giữa các cột

**Việt (Mobile):**
- Project list
- Issue list (filter, sort)
- Issue detail
- Thêm comment
- Thay đổi status
- Push notification khi assign task

---

#### Tuần 6: Activity Logs & Reports

**Dũng (BE):**
- API Activity logs (ghi log mọi CUD operations)
- API `/api/projects/{id}/activity`
- API `/api/issues/{id}/activity`

**Trường (BE):**
- API `/api/reports/project/{id}/burndown`
- API `/api/reports/project/{id}/velocity`
- API `/api/reports/user/{id}/workload`
- API Notifications (CRUD, mark read)

**Nhân (FE Web):**
- Activity timeline component
- Burndown chart (Chart.js / Recharts)
- Velocity chart
- User workload dashboard
- Notification dropdown (header)

**Việt (Mobile):**
- Notification list screen
- Activity history
- Basic charts

---

### 🔹 GIAI ĐOẠN 4: CHAT & STORAGE (Tuần 7)

#### Tuần 7: Chat Realtime & File Storage

**Dũng (BE):**
- Setup WebSocket configuration (STOMP)
- API Chat rooms (CRUD, direct, group)
- WebSocket `/topic/rooms/{roomId}` - Subscribe
- WebSocket `/app/rooms/{roomId}/send` - Send
- API Storage Upload/Download
- Auto-create project chat room

**Trường (BE):**
- API Messages (pagination, search)
- API Message status (delivered, seen)
- API Folders (CRUD)
- API Files (CRUD, search)
- API File sharing (generate link, permissions)
- Tích hợp MinIO

**Nhân (FE Web):**
- Trang Chat (sidebar rooms + chat area)
- Chat interface (bubble messages)
- Upload ảnh/file trong chat
- WebSocket integration (SockJS + STOMP.js)
- Real-time updates
- File Manager (tree view, upload, download, preview)
- Share file (generate link)

**Việt (Mobile):**
- Chat list screen
- Chat conversation (WebSocket với OkHttp)
- Send text + images
- File browser
- Upload/download files

---

### 🔹 GIAI ĐOẠN 5: POLISH & DEPLOY (Tuần 8)

#### Tuần 8: Nghỉ phép, Dashboards, Deployment

**Dũng (BE):**
- API Nghỉ phép (CRUD, my, pending)
- API `/api/nghi-phep/{id}/approve`
- API `/api/nghi-phep/{id}/reject`
- Send notification khi duyệt/từ chối
- API Dashboard admin

**Trường (BE):**
- API Dashboard manager
- API Dashboard employee
- Performance optimization (indexing, query tuning)
- API documentation (Swagger)
- Unit tests coverage > 70%

**Nhân (FE Web):**
- Trang nghỉ phép (form + calendar)
- Trang duyệt nghỉ phép (manager)
- Dashboard admin (charts tổng quan)
- Dashboard manager (team performance)
- Dashboard employee (my tasks, attendance)
- Responsive design
- UI polish

**Việt (Mobile):**
- Đăng ký nghỉ phép
- Danh sách đơn nghỉ
- Dashboard cá nhân
- UI polish
- Offline support improvements

**Tất cả:**
- Integration testing
- Bug fixing
- Code review
- Deployment setup (Docker, Nginx, APK build)
- Documentation
- Demo presentation

---

## 🚀 KIẾN TRÚC HỆ THỐNG

### Backend Architecture (Monolith - Đơn giản hóa)

```
Spring Boot Backend (Single Application)
├── com.company.enterprise.auth          # Authentication
├── com.company.enterprise.hr            # HR module
├── com.company.enterprise.project       # Project Management
├── com.company.enterprise.chat          # Chat + WebSocket
├── com.company.enterprise.storage       # File storage
└── com.company.enterprise.common        # Shared utilities
```

### Tech Stack Chi Tiết

**Backend:**
- Spring Boot 3.5.6
- Spring Security + JWT
- Spring Data JPA
- Spring WebSocket (STOMP)
- MinIO SDK
- Apache POI (Excel)
- Lombok
- JUnit + Mockito

**Frontend Web:**
- React 18 + TypeScript
- Vite
- React Router DOM v6
- TanStack Query (React Query)
- Zustand (state management)
- Axios
- Ant Design
- Chart.js / Recharts
- SockJS + STOMP.js
- React Beautiful DnD (drag & drop)

**Mobile Android:**
- Kotlin
- Jetpack Compose
- Retrofit + OkHttp
- Room Database
- Hilt (DI)
- Coil (Image loading)
- Navigation Compose
- Kotlin Coroutines + Flow
- OkHttp WebSocket

**Database:**
- SQL Server 2019+

**Storage:**
- MinIO (self-hosted S3-compatible)

---

## 📝 PHÂN CÔNG CÔNG VIỆC

### Dũng (Backend Developer - Lead)
**Focus:** Core infrastructure, HR, Project Management, Chat

**Deliverables:**
- Tuần 1-2: Auth APIs, JWT Security, Database setup
- Tuần 3-4: HR APIs (Nhân viên, Phòng ban, Chấm công)
- Tuần 5-6: Project & Sprint APIs, Activity logs
- Tuần 7: Chat WebSocket, Storage Upload/Download
- Tuần 8: Nghỉ phép APIs, Admin dashboard

**Total:** ~50 API endpoints

---

### Trường (Backend Developer)
**Focus:** Testing, File Storage, Supporting APIs

**Deliverables:**
- Tuần 1-2: MinIO setup, User CRUD, Testing framework
- Tuần 3-4: Chức vụ, Hợp đồng, Lương + Excel export
- Tuần 5-6: Issue APIs, Comments, Reports (charts data)
- Tuần 7: Chat messages, File management, Sharing
- Tuần 8: Dashboards, Performance tuning

**Total:** ~50 API endpoints, Unit tests > 70%

---

### Nhân (Frontend Web Developer)
**Focus:** Full web application

**Deliverables:**
- Tuần 1-2: Login, Layout, Profile, Admin user management
- Tuần 3-4: HR pages (Nhân viên, Chấm công, Lương)
- Tuần 5-6: Project pages (Kanban, Issue forms, Charts)
- Tuần 7: Chat UI, File Manager
- Tuần 8: Nghỉ phép, Dashboards, Polish

**Total:** ~35 pages/components

---

### Việt (Mobile Android Developer)
**Focus:** Employee mobile app

**Deliverables:**
- Tuần 1-2: Login, Navigation, Profile
- Tuần 3-4: Employee list/detail, Chấm công, Offline cache
- Tuần 5-6: Task list/detail, Push notifications
- Tuần 7: Chat, File browser
- Tuần 8: Nghỉ phép, Dashboard, Polish

**Total:** ~22 screens

---

## ⚠️ RỦI RO & GIẢI PHÁP

### Rủi ro 1: Tích hợp frontend-backend chậm
**Giải pháp:**
- Backend cung cấp Swagger docs sớm
- Frontend mock API responses
- Daily standup sync

### Rủi ro 2: WebSocket không ổn định
**Giải pháp:**
- Có REST API fallback
- Test WebSocket sớm (tuần 2-3)
- Long Polling nếu cần

### Rủi ro 3: Team member nghỉ
**Giải pháp:**
- Code review lẫn nhau
- Documentation rõ ràng
- Git commit thường xuyên

---

## 📊 METRICS & DELIVERABLES

### Cuối tuần 2: Authentication Complete
- [x] Login/Register working
- [x] JWT authentication
- [x] Profile management

### Cuối tuần 4: HR Module Complete
- [ ] Nhân viên CRUD
- [ ] Chấm công, Lương
- [ ] Hợp đồng

### Cuối tuần 6: Project Module Complete
- [ ] Projects, Issues, Sprints
- [ ] Kanban board
- [ ] Comments, Charts

### Cuối tuần 7: Chat & Storage
- [ ] Realtime chat
- [ ] File upload/download

### Cuối tuần 8: Final
- [ ] All features
- [ ] Deployed

---

## 🎓 TÀI LIỆU THAM KHẢO

- Spring Boot: https://spring.io/
- React: https://react.dev/
- Android Compose: https://developer.android.com/jetpack/compose
- MinIO: https://min.io/docs/

---

## 🚀 DEPLOYMENT

### Backend (Docker)
```dockerfile
FROM openjdk:21-slim
COPY target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Mobile
```bash
./gradlew assembleRelease
```

---

## 🎯 KẾT LUẬN

Kế hoạch này tập trung vào **MVP** - tính năng cốt lõi:

✅ **Làm gì:**
- HR: Nhân viên, Chấm công, Lương, Nghỉ phép
- Project: Tasks (Jira-like), Kanban, Sprints
- Chat: Realtime messaging (text + files)
- Storage: Upload/Download, Sharing

✅ **Ưu tiên:**
1. Core features working
2. Simple & effective
3. Done > Perfect

**Good luck! 🚀**

---

**Version:** 2.0 (Clean)
**Last Updated:** 2025-10-03
**Total Tables:** 24
**Total APIs:** ~100 endpoints





