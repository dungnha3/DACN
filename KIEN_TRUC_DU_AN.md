# 🏗️ KIẾN TRÚC DỰ ÁN - HỆ THỐNG QUẢN LÝ DOANH NGHIỆP

## 📋 MỤC LỤC
1. [Tổng quan kiến trúc](#tổng-quan)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Web Architecture](#frontend-web-architecture)
4. [Mobile Architecture](#mobile-architecture)
5. [Database Architecture](#database-architecture)
6. [Security Architecture](#security-architecture)
7. [Deployment Architecture](#deployment-architecture)
8. [Data Flow](#data-flow)

---

## 🎯 TỔNG QUAN

### Kiến trúc tổng thể - 3 Tier Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────┐          ┌────────────────────┐        │
│  │   React Web App    │          │   Android App      │        │
│  │   (TypeScript)     │          │   (Kotlin)         │        │
│  │                    │          │                    │        │
│  │  - Pages           │          │  - Screens         │        │
│  │  - Components      │          │  - Compose UI      │        │
│  │  - State Mgmt      │          │  - MVVM            │        │
│  │  - WebSocket       │          │  - Room DB         │        │
│  └────────────────────┘          └────────────────────┘        │
│           │                               │                     │
└───────────┼───────────────────────────────┼─────────────────────┘
            │                               │
            └───────────────┬───────────────┘
                            │
                    HTTP/WebSocket
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                           ▼      APPLICATION LAYER              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│              ┌─────────────────────────────┐                   │
│              │   Spring Boot Backend       │                   │
│              │   (Java 21)                 │                   │
│              │                             │                   │
│              │  ┌─────────────────────┐   │                   │
│              │  │   REST Controllers   │   │                   │
│              │  └─────────────────────┘   │                   │
│              │  ┌─────────────────────┐   │                   │
│              │  │   Business Logic     │   │                   │
│              │  │   (Services)         │   │                   │
│              │  └─────────────────────┘   │                   │
│              │  ┌─────────────────────┐   │                   │
│              │  │   Data Access        │   │                   │
│              │  │   (Repositories)     │   │                   │
│              │  └─────────────────────┘   │                   │
│              │  ┌─────────────────────┐   │                   │
│              │  │   WebSocket (STOMP)  │   │                   │
│              │  └─────────────────────┘   │                   │
│              └─────────────────────────────┘                   │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │
                   JPA/Hibernate
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                            ▼          DATA LAYER                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │   SQL Server     │              │   MinIO          │        │
│  │   (Database)     │              │   (File Storage) │        │
│  │                  │              │                  │        │
│  │  - 27 Tables     │              │  - Folders       │        │
│  │  - Relationships │              │  - Files         │        │
│  │  - Indexes       │              │  - Buckets       │        │
│  └──────────────────┘              └──────────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 BACKEND ARCHITECTURE

### Spring Boot - Monolith với Module Pattern

```
enterprise-system-backend/
│
├── src/main/java/com/company/enterprise/
│   │
│   ├── 📦 auth/                    # Authentication Module
│   │   ├── controller/
│   │   │   └── AuthController.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   └── AuthServiceImpl.java
│   │   ├── dto/
│   │   │   ├── LoginRequest.java
│   │   │   ├── LoginResponse.java
│   │   │   └── RefreshTokenRequest.java
│   │   └── util/
│   │       ├── JwtUtil.java
│   │       └── JwtAuthenticationFilter.java
│   │
│   ├── 📦 user/                    # User Management Module
│   │   ├── entity/
│   │   │   └── User.java
│   │   ├── controller/
│   │   │   └── UserController.java
│   │   ├── service/
│   │   │   ├── UserService.java
│   │   │   └── UserServiceImpl.java
│   │   ├── repository/
│   │   │   └── UserRepository.java
│   │   └── dto/
│   │       └── UserDTO.java
│   │
│   ├── 📦 ai/                      # AI Integration Module
│   │   ├── service/
│   │   │   ├── OpenAIService.java
│   │   │   ├── NotionAIService.java
│   │   │   ├── AIAssignmentService.java
│   │   │   └── AIContentService.java
│   │   ├── controller/
│   │   │   ├── AIAssignmentController.java
│   │   │   └── NotionAIController.java
│   │   ├── dto/
│   │   │   ├── AIAssignmentRequest.java
│   │   │   ├── AIContentRequest.java
│   │   │   └── AIResponse.java
│   │   └── config/
│   │       └── AIConfig.java
│   │
│   ├── 📦 hr/                      # HR Module
│   │   ├── entity/
│   │   │   ├── NhanVien.java
│   │   │   ├── PhongBan.java
│   │   │   ├── ChucVu.java
│   │   │   ├── HopDong.java
│   │   │   ├── ChamCong.java
│   │   │   ├── BangLuong.java
│   │   │   └── NghiPhep.java
│   │   ├── controller/
│   │   │   ├── NhanVienController.java
│   │   │   ├── PhongBanController.java
│   │   │   ├── ChucVuController.java
│   │   │   ├── HopDongController.java
│   │   │   ├── ChamCongController.java
│   │   │   ├── BangLuongController.java
│   │   │   └── NghiPhepController.java
│   │   ├── service/
│   │   │   └── [7 services + implementations]
│   │   ├── repository/
│   │   │   └── [7 repositories]
│   │   └── dto/
│   │       └── [7+ DTOs]
│   │
│   ├── 📦 project/                 # Project Management Module
│   │   ├── entity/
│   │   │   ├── Project.java
│   │   │   ├── ProjectMember.java
│   │   │   ├── Sprint.java
│   │   │   ├── Issue.java
│   │   │   ├── IssueType.java
│   │   │   ├── IssueStatus.java
│   │   │   └── Comment.java
│   │   │   # AI-Enhanced Fields:
│   │   │   # - ai_generated_description
│   │   │   # - ai_suggested_assignee
│   │   │   # - ai_estimated_hours
│   │   │   # - ai_priority_suggestion
│   │   ├── controller/
│   │   │   ├── ProjectController.java
│   │   │   ├── SprintController.java
│   │   │   ├── IssueController.java
│   │   │   └── CommentController.java
│   │   ├── service/
│   │   │   └── [4 services + implementations]
│   │   ├── repository/
│   │   │   └── [7 repositories]
│   │   └── dto/
│   │       └── [DTOs]
│   │
│   ├── 📦 chat/                    # Chat Module
│   │   ├── entity/
│   │   │   ├── ChatRoom.java
│   │   │   ├── ChatRoomMember.java
│   │   │   ├── Message.java
│   │   │   └── MessageStatus.java
│   │   │   # Enhanced with Online Status:
│   │   │   # - is_online (Boolean)
│   │   │   # - last_seen (LocalDateTime)
│   │   ├── controller/
│   │   │   ├── ChatRoomController.java
│   │   │   └── MessageController.java
│   │   ├── websocket/
│   │   │   ├── WebSocketConfig.java
│   │   │   ├── WebSocketController.java
│   │   │   ├── WebSocketEventListener.java
│   │   │   └── PresenceController.java
│   │   ├── service/
│   │   │   └── [3 services]
│   │   ├── repository/
│   │   │   └── [4 repositories]
│   │   └── dto/
│   │       └── [DTOs]
│   │
│   ├── 📦 storage/                 # File Storage Module
│   │   ├── entity/
│   │   │   ├── Folder.java
│   │   │   ├── File.java
│   │   │   └── FileShare.java
│   │   ├── controller/
│   │   │   ├── StorageController.java
│   │   │   └── FolderController.java
│   │   ├── service/
│   │   │   ├── MinioService.java
│   │   │   ├── FileStorageService.java
│   │   │   ├── FolderService.java
│   │   │   └── FileShareService.java
│   │   ├── repository/
│   │   │   └── [3 repositories]
│   │   └── dto/
│   │       └── [DTOs]
│   │
│   ├── 📦 notification/            # Notification Module
│   │   ├── entity/
│   │   │   └── Notification.java
│   │   ├── controller/
│   │   │   └── NotificationController.java
│   │   ├── service/
│   │   │   ├── NotificationService.java
│   │   │   └── PushNotificationService.java
│   │   ├── repository/
│   │   │   └── NotificationRepository.java
│   │   └── dto/
│   │       └── NotificationDTO.java
│   │
│   ├── 📦 activity/                # Activity Log Module
│   │   ├── entity/
│   │   │   └── ActivityLog.java
│   │   ├── controller/
│   │   │   └── ActivityLogController.java
│   │   ├── service/
│   │   │   └── ActivityLogService.java
│   │   └── repository/
│   │       └── ActivityLogRepository.java
│   │
│   ├── 📦 common/                  # Shared Module
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   ├── CorsConfig.java
│   │   │   └── JpaConfig.java
│   │   ├── exception/
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── ResourceNotFoundException.java
│   │   │   └── UnauthorizedException.java
│   │   ├── dto/
│   │   │   └── ApiResponse.java
│   │   └── util/
│   │       ├── DateUtils.java
│   │       └── ValidationUtils.java
│   │
│   └── EnterpriseApplication.java  # Main Application
│
├── src/main/resources/
│   ├── application.properties
│   ├── application-dev.properties
│   └── application-prod.properties
│
└── pom.xml
```

### Backend Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   CONTROLLER LAYER                      │
│  @RestController, @RequestMapping                       │
│  - Nhận HTTP requests                                   │
│  - Validation input                                     │
│  - Gọi Service layer                                    │
│  - Trả về HTTP responses                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                        │
│  @Service                                               │
│  - Business logic                                       │
│  - Transaction management (@Transactional)              │
│  - Orchestrate multiple repositories                   │
│  - Data transformation (Entity ↔ DTO)                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  REPOSITORY LAYER                       │
│  @Repository, extends JpaRepository                     │
│  - CRUD operations                                      │
│  - Custom queries (@Query)                             │
│  - Database access                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    ENTITY LAYER                         │
│  @Entity, @Table                                        │
│  - JPA entities                                         │
│  - Database mapping                                     │
│  - Relationships (@OneToMany, @ManyToOne)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
                ┌────────────┐
                │  DATABASE  │
                └────────────┘
```

---

## 💻 FRONTEND WEB ARCHITECTURE

### React - Component-Based Architecture

```
frontend-web/
│
├── public/
│   ├── index.html
│   └── assets/
│
├── src/
│   │
│   ├── 📦 api/                     # API Layer
│   │   ├── client.ts              # Axios instance
│   │   ├── auth.api.ts            # Auth APIs
│   │   ├── user.api.ts            # User APIs
│   │   ├── hr.api.ts              # HR APIs
│   │   ├── project.api.ts         # Project APIs
│   │   ├── chat.api.ts            # Chat APIs
│   │   ├── storage.api.ts         # Storage APIs
│   │   └── ai.api.ts              # AI APIs
│   │
│   ├── 📦 components/              # Reusable Components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Loading.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MainLayout.tsx
│   │   └── features/
│   │       ├── UserAvatar.tsx
│   │       ├── NotificationDropdown.tsx
│   │       ├── FileUploader.tsx
│   │       ├── OnlineStatus.tsx
│   │       ├── AIWritingAssistant.tsx
│   │       └── AIAssignmentButton.tsx
│   │
│   ├── 📦 pages/                   # Page Components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── hr/
│   │   │   ├── EmployeeListPage.tsx
│   │   │   ├── EmployeeFormPage.tsx
│   │   │   ├── AttendancePage.tsx
│   │   │   └── SalaryPage.tsx
│   │   ├── project/
│   │   │   ├── ProjectListPage.tsx
│   │   │   ├── ProjectDetailPage.tsx
│   │   │   ├── KanbanBoardPage.tsx
│   │   │   └── IssueDetailPage.tsx
│   │   ├── chat/
│   │   │   └── ChatPage.tsx
│   │   ├── storage/
│   │   │   └── FileManagerPage.tsx
│   │   └── dashboard/
│   │       ├── AdminDashboard.tsx
│   │       ├── ManagerDashboard.tsx
│   │       └── EmployeeDashboard.tsx
│   │
│   ├── 📦 store/                   # State Management (Zustand)
│   │   ├── authStore.ts
│   │   ├── userStore.ts
│   │   ├── notificationStore.ts
│   │   └── chatStore.ts
│   │
│   ├── 📦 hooks/                   # Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useWebSocket.ts
│   │   ├── useDebounce.ts
│   │   ├── useInfiniteScroll.ts
│   │   └── usePresence.ts
│   │
│   ├── 📦 types/                   # TypeScript Types
│   │   ├── user.types.ts
│   │   ├── project.types.ts
│   │   ├── chat.types.ts
│   │   ├── ai.types.ts
│   │   └── api.types.ts
│   │
│   ├── 📦 utils/                   # Utilities
│   │   ├── formatDate.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx
│
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Frontend Data Flow

```
┌─────────────┐
│   User      │
│  Interaction│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│        COMPONENTS                   │
│  - onClick handlers                 │
│  - Form submissions                 │
│  - User events                      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│     STATE MANAGEMENT (Zustand)      │
│  - Global state                     │
│  - Actions                          │
│  - State updates                    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│       API LAYER (React Query)       │
│  - useQuery (GET)                   │
│  - useMutation (POST/PUT/DELETE)    │
│  - Cache management                 │
│  - Auto refetch                     │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│       AXIOS CLIENT                  │
│  - HTTP requests                    │
│  - JWT interceptor                  │
│  - Error handling                   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│         BACKEND API                 │
└─────────────────────────────────────┘
```

---

## 📱 MOBILE ARCHITECTURE

### Android - MVVM Pattern

```
mobile-android/
│
├── app/src/main/java/com/company/enterprise/
│   │
│   ├── 📦 data/                    # Data Layer
│   │   ├── api/
│   │   │   ├── ApiService.kt
│   │   │   ├── AuthApi.kt
│   │   │   ├── UserApi.kt
│   │   │   ├── HrApi.kt
│   │   │   ├── ProjectApi.kt
│   │   │   ├── ChatApi.kt
│   │   │   └── StorageApi.kt
│   │   ├── model/
│   │   │   ├── User.kt
│   │   │   ├── Employee.kt
│   │   │   ├── Project.kt
│   │   │   ├── Issue.kt
│   │   │   ├── Message.kt
│   │   │   └── File.kt
│   │   ├── repository/
│   │   │   ├── AuthRepository.kt
│   │   │   ├── UserRepository.kt
│   │   │   ├── EmployeeRepository.kt
│   │   │   ├── ProjectRepository.kt
│   │   │   ├── ChatRepository.kt
│   │   │   └── StorageRepository.kt
│   │   └── local/
│   │       ├── AppDatabase.kt
│   │       ├── dao/
│   │       │   ├── UserDao.kt
│   │       │   ├── EmployeeDao.kt
│   │       │   └── MessageDao.kt
│   │       └── entity/
│   │           └── [Local entities]
│   │
│   ├── 📦 di/                      # Dependency Injection (Hilt)
│   │   ├── AppModule.kt
│   │   ├── NetworkModule.kt
│   │   ├── DatabaseModule.kt
│   │   └── RepositoryModule.kt
│   │
│   ├── 📦 ui/                      # UI Layer
│   │   ├── auth/
│   │   │   ├── LoginScreen.kt
│   │   │   ├── LoginViewModel.kt
│   │   │   └── RegisterScreen.kt
│   │   ├── home/
│   │   │   ├── HomeScreen.kt
│   │   │   └── HomeViewModel.kt
│   │   ├── employee/
│   │   │   ├── EmployeeListScreen.kt
│   │   │   ├── EmployeeDetailScreen.kt
│   │   │   └── EmployeeViewModel.kt
│   │   ├── attendance/
│   │   │   ├── AttendanceScreen.kt
│   │   │   └── AttendanceViewModel.kt
│   │   ├── project/
│   │   │   ├── ProjectListScreen.kt
│   │   │   ├── IssueListScreen.kt
│   │   │   ├── IssueDetailScreen.kt
│   │   │   └── ProjectViewModel.kt
│   │   ├── chat/
│   │   │   ├── ChatListScreen.kt
│   │   │   ├── ChatScreen.kt
│   │   │   └── ChatViewModel.kt
│   │   ├── storage/
│   │   │   ├── FileBrowserScreen.kt
│   │   │   └── StorageViewModel.kt
│   │   └── components/
│   │       ├── BottomNavigation.kt
│   │       ├── TopAppBar.kt
│   │       └── [Reusable components]
│   │
│   ├── 📦 util/                    # Utilities
│   │   ├── Constants.kt
│   │   ├── DateUtils.kt
│   │   ├── NetworkUtils.kt
│   │   └── PreferencesManager.kt
│   │
│   └── MainActivity.kt
│
└── build.gradle.kts
```

### Android MVVM Pattern

```
┌─────────────┐
│    VIEW     │  (Composable Functions)
│  @Composable│  - UI rendering
│             │  - User interactions
└──────┬──────┘
       │
       │ observes
       │ State/LiveData
       │
       ▼
┌──────────────┐
│  VIEWMODEL   │  - UI state
│  @HiltViewModel  - Business logic
│             │  - Calls Repository
└──────┬──────┘
       │
       │ calls
       │
       ▼
┌──────────────┐
│  REPOSITORY  │  - Single source of truth
│              │  - Combines Remote + Local
│              │  - Caching strategy
└──────┬───┬───┘
       │   │
   ┌───┘   └───┐
   │           │
   ▼           ▼
┌─────────┐ ┌─────────┐
│ Remote  │ │  Local  │
│Data     │ │Database │
│Source   │ │(Room)   │
│(Retrofit)│ │        │
└─────────┘ └─────────┘
```

---

## 🗄️ DATABASE ARCHITECTURE

### SQL Server Schema

```
┌──────────────────────────────────────────────────────────┐
│                    DATABASE: EnterpriseSystem            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  📁 CORE (4 tables)                                      │
│    ┌─────────────────────────────────────────┐          │
│    │ users                                   │          │
│    │  - user_id (PK)                         │──┐       │
│    │  - username, password_hash              │  │       │
│    │  - email, phone_number, avatar_url      │  │       │
│    │  - role (ADMIN/MANAGER/EMPLOYEE)        │  │       │
│    │  - is_online, last_seen                 │  │       │
│    └─────────────────────────────────────────┘  │       │
│                                                  │       │
│    ┌─────────────────────────────────────────┐  │       │
│    │ nhan_vien                               │  │       │
│    │  - nhanvien_id (PK)                     │  │       │
│    │  - user_id (FK) ─────────────────────────┘       │
│    │  - ho_ten, cccd, ngay_sinh              │          │
│    │  - phongban_id (FK), chucvu_id (FK)     │          │
│    └─────────────────────────────────────────┘          │
│                                                          │
│    ┌────────────────┐      ┌────────────────┐           │
│    │ phong_ban      │      │ chuc_vu        │           │
│    │  - phongban_id │      │  - chucvu_id   │           │
│    │  - ten_phong   │      │  - ten_chuc_vu │           │
│    └────────────────┘      └────────────────┘           │
│                                                          │
│  📁 HR (4 tables)                                        │
│    ┌──────────────┐  ┌──────────────┐                   │
│    │ hop_dong     │  │ cham_cong    │                   │
│    │ bang_luong   │  │ nghi_phep    │                   │
│    └──────────────┘  └──────────────┘                   │
│                                                          │
│  📁 PROJECT (7 tables)                                   │
│    ┌─────────────────────────────────────────┐          │
│    │ projects                                │          │
│    │  - project_id (PK)                      │──┐       │
│    │  - name, key_project, description       │  │       │
│    │  - created_by (FK → users)              │  │       │
│    │  - ai_generated_description             │  │       │
│    │  - ai_suggested_timeline                 │  │       │
│    └─────────────────────────────────────────┘  │       │
│                                                  │       │
│    ┌─────────────────────────────────────────┐  │       │
│    │ issues                                  │  │       │
│    │  - issue_id (PK)                        │  │       │
│    │  - project_id (FK) ──────────────────────┘       │
│    │  - assignee_id (FK → users)             │          │
│    │  - reporter_id (FK → users)             │          │
│    │  - ai_generated_description             │          │
│    │  - ai_suggested_assignee                │          │
│    │  - ai_estimated_hours                   │          │
│    └─────────────────────────────────────────┘          │
│                                                          │
│    [sprints, project_members, comments,                 │
│     issue_types, issue_statuses]                        │
│                                                          │
│  📁 CHAT (4 tables)                                      │
│    ┌─────────────┐  ┌──────────────┐                    │
│    │ chat_rooms  │  │ messages     │                    │
│    └─────────────┘  └──────────────┘                    │
│    ┌────────────────────┐  ┌────────────────┐           │
│    │ chat_room_members  │  │ message_status │           │
│    └────────────────────┘  └────────────────┘           │
│                                                          │
│  📁 STORAGE (3 tables)                                   │
│    ┌──────────┐  ┌──────┐  ┌────────────┐              │
│    │ folders  │  │ files│  │ file_shares│              │
│    └──────────┘  └──────┘  └────────────┘              │
│                                                          │
│  📁 SYSTEM (2 tables)                                    │
│    ┌──────────────────┐  ┌───────────────┐             │
│    │ notifications    │  │ activity_logs │             │
│    └──────────────────┘  └───────────────┘             │
│                                                          │
│  📁 AUTH (3 tables)                                      │
│    ┌─────────────────────────────────────────┐          │
│    │ refresh_tokens                          │          │
│    │  - id (PK)                              │          │
│    │  - token, user_id (FK)                  │          │
│    │  - expires_at, is_revoked               │          │
│    └─────────────────────────────────────────┘          │
│                                                          │
│    ┌─────────────────────────────────────────┐          │
│    │ user_sessions                           │          │
│    │  - id (PK)                              │          │
│    │  - user_id (FK), session_id             │          │
│    │  - ip_address, user_agent               │          │
│    │  - last_activity, is_active             │          │
│    └─────────────────────────────────────────┘          │
│                                                          │
│    ┌─────────────────────────────────────────┐          │
│    │ login_attempts                          │          │
│    │  - id (PK)                              │          │
│    │  - username, ip_address                 │          │
│    │  - success, failure_reason              │          │
│    │  - attempted_at                         │          │
│    └─────────────────────────────────────────┘          │
│                                                          │
│  📁 AI INTEGRATION                                        │
│    - OpenAI API Integration                              │
│    - Notion-style AI Writing Assistant                  │
│    - AI Task Assignment                                  │
│    - AI Content Generation                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Database Relationships

```
users (1) ──────── (N) nhan_vien
  │
  ├──────── (N) projects (created_by)
  │
  ├──────── (N) issues (assignee, reporter)
  │
  ├──────── (N) messages (sender)
  │
  ├──────── (N) files (owner)
  │
  └──────── (N) notifications

nhan_vien (N) ──────── (1) phong_ban
          (N) ──────── (1) chuc_vu
          (1) ──────── (N) hop_dong
          (1) ──────── (N) cham_cong
          (1) ──────── (N) bang_luong
          (1) ──────── (N) nghi_phep

projects (1) ──────── (N) project_members
         (1) ──────── (N) issues
         (1) ──────── (N) sprints
         (1) ──────── (1) chat_rooms (project chat)
         (1) ──────── (1) folders (project folder)

issues (1) ──────── (N) comments
       (N) ──────── (1) issue_types
       (N) ──────── (1) issue_statuses

chat_rooms (1) ──────── (N) messages
           (1) ──────── (N) chat_room_members

folders (1) ──────── (N) files
        (1) ──────── (N) folders (sub-folders)

files (1) ──────── (N) file_shares
      (1) ──────── (N) messages (file attachments)

# Auth Relationships
users (1) ──────── (N) refresh_tokens
users (1) ──────── (N) user_sessions
users (1) ──────── (N) login_attempts

# AI Integration Relationships
users (1) ──────── (N) ai_assignments
issues (1) ──────── (N) ai_suggestions
projects (1) ──────── (N) ai_content
```

---

## 🔐 SECURITY ARCHITECTURE

### JWT Authentication Flow

```
┌──────────────┐                                ┌──────────────┐
│   Client     │                                │   Server     │
│ (Web/Mobile) │                                │  (Backend)   │
└──────┬───────┘                                └──────┬───────┘
       │                                               │
       │  1. POST /api/auth/login                     │
       │    { username, password }                    │
       ├──────────────────────────────────────────────>│
       │                                               │
       │                              2. Validate     │
       │                                 credentials   │
       │                                               │
       │  3. { accessToken, refreshToken, user }      │
       │<──────────────────────────────────────────────┤
       │                                               │
       │  4. Store tokens (localStorage/DataStore)    │
       │                                               │
       │  5. API Request + Authorization header       │
       │    Authorization: Bearer {accessToken}       │
       ├──────────────────────────────────────────────>│
       │                                               │
       │                              6. Validate JWT │
       │                                 Extract user  │
       │                                               │
       │  7. API Response                             │
       │<──────────────────────────────────────────────┤
       │                                               │
       │  8. Access Token expired                     │
       │  POST /api/auth/refresh                      │
       │    { refreshToken }                          │
       ├──────────────────────────────────────────────>│
       │                                               │
       │  9. { newAccessToken }                       │
       │<──────────────────────────────────────────────┤
       │                                               │
```

### Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    NETWORK LAYER                        │
│  - HTTPS/TLS                                            │
│  - CORS Configuration                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              AUTHENTICATION LAYER                       │
│  - JWT Token Validation                                 │
│  - Refresh Token Mechanism                              │
│  - Session Management                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              AUTHORIZATION LAYER                        │
│  - Role-based Access Control (RBAC)                     │
│  - ADMIN / MANAGER / EMPLOYEE                           │
│  - Method Security (@PreAuthorize)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               APPLICATION LAYER                         │
│  - Input Validation                                     │
│  - SQL Injection Prevention (JPA)                       │
│  - XSS Prevention                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  DATA LAYER                             │
│  - Encrypted Passwords (BCrypt)                         │
│  - Sensitive Data Encryption                            │
│  - Database Access Control                              │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 DEPLOYMENT ARCHITECTURE

### Development Environment

```
Developer Machine
│
├── Backend (localhost:8080)
│   └── Spring Boot + SQL Server (localhost:1433)
│
├── Frontend Web (localhost:5173)
│   └── Vite Dev Server
│
├── Mobile (Emulator)
│   └── Android Studio
│
└── MinIO (localhost:9000)
    └── Docker Container
```

### Production Environment

```
┌─────────────────────────────────────────────────────────┐
│                     INTERNET                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               LOAD BALANCER / CDN                       │
│  - Nginx / Cloudflare                                   │
│  - SSL Termination                                      │
└──────────────┬──────────────────┬───────────────────────┘
               │                  │
       ┌───────┘                  └───────┐
       │                                  │
       ▼                                  ▼
┌──────────────────┐            ┌──────────────────┐
│   Frontend Web   │            │   Backend API    │
│                  │            │                  │
│  - React Build   │            │  - Spring Boot   │
│  - Static Files  │            │  - Docker        │
│  - Nginx         │            │  - Port 8080     │
└──────────────────┘            └────────┬─────────┘
                                         │
                          ┌──────────────┼──────────────┐
                          │              │              │
                          ▼              ▼              ▼
                  ┌─────────────┐ ┌──────────┐ ┌──────────┐
                  │ SQL Server  │ │  MinIO   │ │  Redis   │
                  │  Database   │ │  S3      │ │  Cache   │
                  └─────────────┘ └──────────┘ └──────────┘
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    image: enterprise-backend:latest
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=sqlserver
      - MINIO_ENDPOINT=minio:9000
    depends_on:
      - sqlserver
      - minio

  sqlserver:
    image: mcr.microsoft.com/mssql/server:2019-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourPassword
    ports:
      - "1433:1433"
    volumes:
      - sqlserver-data:/var/opt/mssql

  minio:
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio-data:/data

  frontend:
    image: enterprise-frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  sqlserver-data:
  minio-data:
```

---

## 🤖 AI INTEGRATION ARCHITECTURE

### AI Services Integration

```
┌─────────────────────────────────────────────────────────┐
│                    AI PROVIDERS                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │   OpenAI GPT-4   │  │  Google Gemini   │            │
│  │   - Content Gen  │  │  - Fast Response │            │
│  │   - Task Assign  │  │  - Multimodal   │            │
│  └──────────────────┘  └──────────────────┘            │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │  Anthropic Claude│  │   Custom AI      │            │
│  │  - Long Context  │  │  - Business Logic│            │
│  │  - Safety Focus  │  │  - Domain Specific│            │
│  └──────────────────┘  └──────────────────┘            │
│                                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                AI SERVICE LAYER                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │            NotionAIService                      │   │
│  │  - generateContent()                           │   │
│  │  - improveContent()                            │   │
│  │  - summarizeContent()                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │            AIAssignmentService                  │   │
│  │  - assignTaskToUser()                          │   │
│  │  - suggestAssignee()                           │   │
│  │  - estimateHours()                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                BUSINESS LOGIC                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Issue Creation → AI Description Generation            │
│  Project Planning → AI Timeline Suggestion             │
│  Task Assignment → AI User Recommendation             │
│  Content Writing → AI Writing Assistant               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### AI Features Implementation

#### 1. **Notion-style AI Writing Assistant**
```java
// AI Content Generation
@PostMapping("/api/ai/generate-content")
public ResponseEntity<?> generateContent(@RequestBody AIContentRequest request) {
    String generatedContent = notionAIService.generateContent(
        request.getPrompt(), 
        request.getContext()
    );
    return ResponseEntity.ok(new AIResponse(generatedContent));
}
```

#### 2. **AI Task Assignment**
```java
// AI Assignment Service
@PostMapping("/api/ai/assign-task/{issueId}")
public ResponseEntity<?> assignTask(@PathVariable Long issueId) {
    User assignedUser = aiAssignmentService.assignTaskToUser(issueId);
    return ResponseEntity.ok(Map.of(
        "assignedTo", assignedUser.getUsername(),
        "confidence", aiAssignmentService.getConfidenceScore()
    ));
}
```

#### 3. **AI Content Enhancement**
```java
// Content Improvement
@PostMapping("/api/ai/improve-content")
public ResponseEntity<?> improveContent(@RequestBody String content) {
    String improvedContent = notionAIService.improveContent(content);
    return ResponseEntity.ok(new AIResponse(improvedContent));
}
```

### Frontend AI Components

#### 1. **AI Writing Assistant**
```tsx
const AIWritingAssistant = ({ onContentGenerated }) => {
  const [loading, setLoading] = useState(false);
  
  const generateContent = async (prompt) => {
    setLoading(true);
    const response = await aiService.generateContent(prompt);
    onContentGenerated(response.content);
    setLoading(false);
  };
  
  return (
    <div className="ai-assistant">
      <button onClick={() => generateContent('Generate description')}>
        ✍️ AI Generate
      </button>
      <button onClick={() => generateContent('Improve content')}>
        🔄 AI Improve
      </button>
      {loading && <div>AI is thinking...</div>}
    </div>
  );
};
```

#### 2. **AI Assignment Button**
```tsx
const AIAssignmentButton = ({ issueId }) => {
  const [loading, setLoading] = useState(false);
  
  const handleAIAssignment = async () => {
    setLoading(true);
    const result = await aiService.assignTask(issueId);
    alert(`Task assigned to: ${result.assignedTo}`);
    setLoading(false);
  };
  
  return (
    <button 
      onClick={handleAIAssignment}
      disabled={loading}
      className="ai-assign-btn"
    >
      {loading ? 'AI Assigning...' : '🤖 AI Assign'}
    </button>
  );
};
```

### AI Data Flow

```
┌─────────────┐
│   User      │
│  Interaction│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│        AI COMPONENTS                │
│  - AI Writing Assistant             │
│  - AI Assignment Button             │
│  - AI Content Generator             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│         AI API LAYER                │
│  - OpenAI GPT-4                     │
│  - Google Gemini                    │
│  - Anthropic Claude                 │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│       AI SERVICE LAYER              │
│  - NotionAIService                  │
│  - AIAssignmentService              │
│  - AIContentService                 │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│        BUSINESS LOGIC               │
│  - Issue Creation                   │
│  - Project Planning                  │
│  - Task Assignment                   │
│  - Content Generation                │
└─────────────────────────────────────┘
```

---

## 🔄 DATA FLOW

### Example: Tạo Issue mới với AIa

```
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
       │ 1. User click "Create Issue"
       │    Fill form & click "🤖 AI Generate Description"
       │
       ▼
┌──────────────────────────────────┐
│  IssueCreateForm.tsx             │
│  - AI Writing Assistant          │
│  - Generate description with AI  │
│  - Call AI API                   │
└──────┬───────────────────────────┘
       │
       │ 2. POST /api/ai/generate-content
       │    { prompt: "Generate issue description", context: "..." }
       │
       ▼
┌──────────────────────────────────┐
│  NotionAIController.java         │
│  @PostMapping("/api/ai/generate-content")│
│  - Call OpenAI API               │
│  - Generate AI content           │
└──────┬───────────────────────────┘
       │
       │ 3. AI-generated description
       │
       ▼
┌──────────────────────────────────┐
│  Frontend (AI Writing Assistant) │
│  - Show AI-generated content     │
│  - User can edit/accept           │
│  - Submit final form              │
└──────┬───────────────────────────┘
       │
       │ 4. POST /api/issues
       │    { title, aiDescription, assigneeId, ... }
       │
       ▼
┌──────────────────────────────────┐
│  IssueController.java            │
│  @PostMapping("/api/issues")     │
│  - Validate JWT                  │
│  - Check permissions             │
│  - Call service                  │
└──────┬───────────────────────────┘
       │
       │ 5. issueService.createIssue(dto)
       │    - Save with AI-generated content
       │    - Auto-assign with AI suggestion
       │
       ▼
┌──────────────────────────────────┐
│  IssueServiceImpl.java           │
│  - Save issue with AI content    │
│  - AI assignment suggestion      │
│  - Create notification           │
│  - Log activity                  │
└──────┬───────────────────────────┘
       │
       │ 6. WebSocket notification
       │    "New issue assigned to you with AI description"
       │
       ▼
┌──────────────────────────────────┐
│  Frontend (Assignee's browser)   │
│  - Show AI-generated issue       │
│  - AI assignment notification    │
│  - AI content preview            │
└──────────────────────────────────┘
```

### Example: AI Task Assignment

```
┌──────────────┐
│   Manager    │
└──────┬───────┘
       │
       │ 1. Click "🤖 AI Assign" button
       │
       ▼
┌──────────────────────────────────┐
│  AIAssignmentButton.tsx          │
│  - Call AI assignment API        │
│  - Show AI thinking...           │
└──────┬───────────────────────────┘
       │
       │ 2. POST /api/ai/assign-task/{issueId}
       │
       ▼
┌──────────────────────────────────┐
│  AIAssignmentController.java     │
│  @PostMapping("/api/ai/assign-task/{id}")│
│  - Analyze issue requirements    │
│  - Get available users           │
│  - Call AI for assignment        │
└──────┬───────────────────────────┘
       │
       │ 3. AIAssignmentService.assignTaskToUser()
       │    - Create AI prompt with issue + users
       │    - Call OpenAI API
       │    - Parse AI response
       │    - Assign to suggested user
       │
       ▼
┌──────────────────────────────────┐
│  OpenAI API                      │
│  - Analyze issue complexity      │
│  - Match with user skills         │
│  - Suggest best assignee          │
│  - Return confidence score        │
└──────┬───────────────────────────┘
       │
       │ 4. AI response: "Assign to John (95% confidence)"
       │
       ▼
┌──────────────────────────────────┐
│  IssueServiceImpl.java           │
│  - Update issue.assignee         │
│  - Set AI confidence score       │
│  - Create assignment notification│
└──────┬───────────────────────────┘
       │
       │ 5. WebSocket notification
       │    "Issue assigned to you by AI (95% confidence)"
       │
       ▼
┌──────────────────────────────────┐
│  Frontend (John's browser)       │
│  - Show AI assignment            │
│  - Display confidence score      │
│  - AI reasoning explanation       │
└──────────────────────────────────┘
```
