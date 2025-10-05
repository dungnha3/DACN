# 🏢 HỆ THỐNG QUẢN LÝ DOANH NGHIỆP TÍCH HỢP

**Enterprise Resource Planning (ERP) System**

> Hợp nhất 4 đồ án thành một hệ thống quản lý doanh nghiệp toàn diện

---

## 📌 GIỚI THIỆU

Dự án hợp nhất 4 module đồ án thành một hệ thống ERP hoàn chỉnh:

1. **📊 QLNS** - Quản lý Nhân sự
   - Quản lý nhân viên, phòng ban, chức vụ
   - Chấm công, tính lương
   - Quản lý hợp đồng, nghỉ phép

2. **📋 QuanLyCongViec** - Quản lý Dự án & Công việc
   - Quản lý dự án, sprint (Agile/Scrum)
   - Task tracking (Jira-like)
   - Kanban board, Gantt chart
   - Báo cáo hiệu suất

3. **💬 ChatApp** - Giao tiếp nội bộ
   - Chat realtime (1-1, group, project chat)
   - Thông báo push
   - Chia sẻ file trong chat

4. **☁️ CloudStorage** - Lưu trữ File & Tài liệu (MỚI)
   - Upload/download files
   - Quản lý folder, phân quyền
   - File sharing, version control
   - Tích hợp với MinIO/S3

---

## 🎯 MỤC TIÊU

- **Tích hợp**: Hợp nhất 4 module thành 1 hệ thống liền mạch
- **Đồng bộ**: Shared authentication, user management
- **Realtime**: Chat, notifications realtime với WebSocket
- **Mobile-first**: Responsive web + Native Android app
- **Scalable**: Kiến trúc RESTful, dễ mở rộng

---

## 🛠️ CÔNG NGHỆ

### Backend
- **Framework**: Spring Boot 3.5.6 (Java 21)
- **Database**: SQL Server 2019+
- **Security**: Spring Security + JWT
- **Real-time**: WebSocket (STOMP)
- **Storage**: MinIO (S3-compatible)

### Frontend Web
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design / Material-UI
- **State**: Zustand / Redux Toolkit
- **API**: Axios + React Query

### Mobile
- **Platform**: Android (Kotlin)
- **UI**: Jetpack Compose
- **Network**: Retrofit + OkHttp
- **Local DB**: Room Database
- **DI**: Hilt

---

## 👥 TEAM

| Vai trò | Thành viên | Trách nhiệm |
|---------|-----------|-------------|
| **Backend** | Dũng + Trường | API development, Database design |
| **Frontend Web** | Nhân | React web application |
| **Mobile** | Việt | Android application |

**Thời gian:** 2 tháng (8 tuần)

---

## 📂 CẤU TRÚC PROJECT

```
enterprise-system/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/company/enterprise/
│   │       │       ├── auth/        # Authentication module
│   │       │       ├── hr/          # HR module
│   │       │       ├── project/     # Project Management
│   │       │       ├── chat/        # Chat module
│   │       │       ├── storage/     # File storage
│   │       │       └── common/      # Shared utilities
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── frontend-web/               # React Frontend
│   ├── src/
│   │   ├── api/               # API services
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── store/            # State management
│   │   └── App.tsx
│   └── package.json
│
├── mobile-android/            # Android App
│   ├── app/
│   │   └── src/
│   │       └── main/
│   │           ├── java/
│   │           │   └── com/company/enterprise/
│   │           │       ├── data/
│   │           │       ├── ui/
│   │           │       └── di/
│   │           └── AndroidManifest.xml
│   └── build.gradle.kts
│
├── database/                  # Database scripts
│   ├── schema.sql
│   ├── seed_data.sql
│   └── migrations/
│
├── docs/                      # Documentation
│   ├── api/                   # API docs (Swagger)
│   ├── architecture/          # Architecture diagrams
│   └── user-guide/            # User manuals
│
├── KE_HOACH_HOP_NHAT_DO_AN.md    # Kế hoạch chi tiết
├── database_schema.sql            # Database schema
├── QUICK_START.md                 # Quick start guide
└── README.md                      # This file
```

---

## 📊 DATABASE SCHEMA

Hệ thống sử dụng **26 bảng** được chia thành 6 nhóm:

### 1. Core Tables (Users & HR)
- `users` - User accounts
- `nhan_vien` - Employee info
- `phong_ban` - Departments
- `chuc_vu` - Positions
- `hop_dong` - Contracts
- `cham_cong` - Attendance
- `bang_luong` - Salary
- `nghi_phep` - Leave requests

### 2. Project Management
- `projects` - Projects
- `project_members` - Project members
- `sprints` - Sprints
- `issues` - Tasks/Issues
- `issue_types` - Task types
- `issue_statuses` - Task statuses
- `comments` - Issue comments

### 3. Chat
- `chat_rooms` - Chat rooms
- `chat_room_members` - Room members
- `messages` - Messages
- `message_status` - Message status (delivered/seen)
- `friends` - Friend relationships

### 4. Cloud Storage
- `folders` - Folder structure
- `files` - File metadata
- `file_shares` - File sharing
- `storage_quotas` - User quotas

### 5. Notifications & Logs
- `notifications` - Notifications
- `activity_logs` - Activity logs

**Chi tiết:** Xem file [database_schema.sql](database_schema.sql)

---

## 🚀 QUICK START

### 1️⃣ Setup Database
```bash
# Chạy SQL script
sqlcmd -S localhost -U sa -P YourPassword -i database_schema.sql
```

### 2️⃣ Start Backend
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

### 3️⃣ Start Frontend Web
```bash
cd frontend-web
npm install
npm run dev
```

### 4️⃣ Build Mobile App
```bash
# Mở Android Studio
# Import project từ folder mobile-android
# Run 'app'
```

**Chi tiết:** Xem [QUICK_START.md](QUICK_START.md)

---

## 📅 TIMELINE

### Giai đoạn 1: Setup & Core (Tuần 1-2)
- ✅ Setup projects, database
- ✅ Authentication & User management
- ✅ Basic layouts

### Giai đoạn 2: HR Module (Tuần 3-4)
- ✅ Nhân viên, phòng ban, chức vụ
- ✅ Chấm công, tính lương
- ✅ Hợp đồng

### Giai đoạn 3: Project Management (Tuần 5-6)
- ✅ Projects, Issues, Sprints
- ✅ Kanban board
- ✅ Comments, Reports

### Giai đoạn 4: Chat & Storage (Tuần 7)
- ✅ Chat realtime
- ✅ File upload/download
- ✅ File sharing

### Giai đoạn 5: Polish & Deploy (Tuần 8)
- ✅ Nghỉ phép
- ✅ Dashboards
- ✅ Testing, deployment

**Chi tiết:** Xem [KE_HOACH_HOP_NHAT_DO_AN.md](KE_HOACH_HOP_NHAT_DO_AN.md)

---

## 🔐 AUTHENTICATION

### Tài khoản mặc định:
- **Username**: `admin`
- **Password**: `Admin@123`
- **Role**: ADMIN

### JWT Flow:
1. Login → Nhận `accessToken` (15 phút) + `refreshToken` (14 ngày)
2. Gọi API với header: `Authorization: Bearer {accessToken}`
3. Token hết hạn → Gọi `/api/auth/refresh` với `refreshToken`

---

## 📡 API ENDPOINTS

### Authentication
```
POST   /api/auth/register      - Đăng ký
POST   /api/auth/login         - Đăng nhập
POST   /api/auth/refresh       - Refresh token
POST   /api/auth/logout        - Đăng xuất
GET    /api/auth/me            - User hiện tại
```

### HR Module
```
GET    /api/nhan-vien          - Danh sách nhân viên
POST   /api/nhan-vien          - Tạo nhân viên
GET    /api/cham-cong          - Lịch sử chấm công
POST   /api/cham-cong/check-in - Check-in
GET    /api/bang-luong         - Bảng lương
POST   /api/nghi-phep          - Đăng ký nghỉ phép
```

### Project Management
```
GET    /api/projects           - Danh sách dự án
POST   /api/projects           - Tạo dự án
GET    /api/issues             - Danh sách issues
POST   /api/issues             - Tạo issue
PUT    /api/issues/{id}/status - Đổi trạng thái
POST   /api/comments           - Thêm comment
```

### Chat
```
GET    /api/chat/rooms         - Danh sách phòng chat
POST   /api/chat/rooms         - Tạo phòng chat
GET    /api/chat/messages      - Lịch sử tin nhắn
WS     /ws                     - WebSocket endpoint
```

### Storage
```
POST   /api/storage/upload     - Upload file
GET    /api/storage/download   - Download file
POST   /api/storage/share      - Chia sẻ file
GET    /api/storage/quota      - Quota thông tin
```

**Swagger UI:** http://localhost:8080/swagger-ui.html (sau khi chạy backend)

---

## 🎨 SCREENSHOTS

### Web Application
- [ ] Login page
- [ ] Dashboard
- [ ] HR Management
- [ ] Kanban Board
- [ ] Chat Interface
- [ ] File Manager

### Mobile Application
- [ ] Login screen
- [ ] Home screen
- [ ] Task list
- [ ] Chat screen

*(Screenshots sẽ được thêm sau khi UI hoàn thiện)*

---

## 🧪 TESTING

### Backend Testing
```bash
cd backend
.\mvnw.cmd test
```

### Frontend Testing
```bash
cd frontend-web
npm run test
```

### API Testing
- **Postman Collection**: Import từ `docs/postman/`
- **Manual Testing**: Sử dụng Swagger UI

---

## 🚢 DEPLOYMENT

### Backend (Docker)
```bash
cd backend
docker build -t enterprise-backend .
docker run -p 8080:8080 enterprise-backend
```

### Frontend (Vercel/Netlify)
```bash
cd frontend-web
npm run build
# Deploy folder dist/
```

### Mobile
```bash
cd mobile-android
./gradlew assembleRelease
# APK: app/build/outputs/apk/release/app-release.apk
```

---

## 📚 DOCUMENTATION

- **[KE_HOACH_HOP_NHAT_DO_AN.md](KE_HOACH_HOP_NHAT_DO_AN.md)** - Kế hoạch chi tiết, đánh giá chức năng, phân công
- **[database_schema.sql](database_schema.sql)** - Database schema đầy đủ
- **[QUICK_START.md](QUICK_START.md)** - Hướng dẫn setup nhanh
- **API Documentation** - Swagger UI (runtime)

---

## 🤝 ĐÓNG GÓP

### Git Workflow
```bash
# Tạo branch cho feature mới
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "feat: add user management"

# Push và tạo Pull Request
git push origin feature/feature-name
```

### Commit Message Convention
- `feat:` - Tính năng mới
- `fix:` - Bug fix
- `refactor:` - Refactor code
- `docs:` - Documentation
- `test:` - Tests
- `chore:` - Maintenance

---

## 📝 CHECKLIST

### Tuần 1-2: ✅ Setup & Auth
- [ ] Database schema
- [ ] Backend project setup
- [ ] Frontend project setup
- [ ] Mobile project setup
- [ ] JWT authentication
- [ ] User management

### Tuần 3-4: ⏳ HR Module
- [ ] Nhân viên CRUD
- [ ] Phòng ban, chức vụ
- [ ] Hợp đồng
- [ ] Chấm công
- [ ] Tính lương

### Tuần 5-6: ⏳ Project Management
- [ ] Projects CRUD
- [ ] Issues/Tasks
- [ ] Kanban board
- [ ] Sprint management
- [ ] Comments & Activity logs

### Tuần 7: ⏳ Chat & Storage
- [ ] Chat rooms
- [ ] Real-time messaging
- [ ] File upload/download
- [ ] File sharing

### Tuần 8: ⏳ Final
- [ ] Nghỉ phép
- [ ] Dashboards
- [ ] Testing
- [ ] Deployment
- [ ] Documentation

---

## 🐛 TROUBLESHOOTING

**Lỗi kết nối database:**
- Kiểm tra SQL Server đang chạy
- Kiểm tra connection string trong `application.properties`

**CORS error:**
- Thêm origin frontend vào CORS configuration

**MinIO không kết nối được:**
- Kiểm tra Docker container: `docker ps | grep minio`
- Restart: `docker restart minio`

**Chi tiết:** Xem [QUICK_START.md](QUICK_START.md) phần Troubleshooting

---

## 📞 LIÊN HỆ & HỖ TRỢ

- **Backend Lead:** Dũng
- **Frontend Lead:** Nhân
- **Mobile Lead:** Việt

**Repository:** [Link to Git repository]

---

## 📄 LICENSE

MIT License - Free to use for educational purposes

---

## 🎯 KẾT LUẬN

Dự án này là sự hợp nhất của 4 đồ án thành một hệ thống ERP hoàn chỉnh, phục vụ quản lý doanh nghiệp toàn diện. Với timeline 2 tháng, team cần tập trung vào:

1. **MVP First** - Ưu tiên tính năng cốt lõi
2. **Communication** - Sync tiến độ hàng ngày
3. **Code Quality** - Code review, testing
4. **Time Management** - Không perfectionism

**Good luck! 🚀**

---

**Version:** 1.0  
**Last Updated:** 2025-10-03  
**Status:** 🚧 In Development





