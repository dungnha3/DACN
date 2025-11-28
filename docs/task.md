# Task List: Flutter Mobile App (Employee Focus)

## Phase 1: Backend Analysis ✅
- [x] Đọc module `common` (config, security, utils)
- [x] Đọc module `auth` (JWT, sessions, brute-force)
- [x] Đọc module `user` (CRUD, roles, Manager protection)
- [x] Đọc module `hr` (GPS attendance, payroll, leave)
- [x] Đọc module `project` (Agile, sprints, issues)
- [x] Đọc module `chat` (WebSocket STOMP, real-time)
- [x] Đọc module `notification` (domain-specific services)
- [x] Đọc module `storage` (file upload, versioning)
- [x] Phân tích React frontend web (API patterns, endpoints)

## Phase 2: Backend - Firebase Integration 🔥
- [ ] Setup Firebase project (create or use existing)
- [ ] Add Android app to Firebase project
- [ ] Add iOS app to Firebase project (optional)
- [ ] Download `google-services.json` cho Android
- [ ] Download `GoogleService-Info.plist` cho iOS
- [ ] Generate service account key cho backend
- [ ] Backend: Add Firebase Admin SDK dependency (`pom.xml`)
- [ ] Backend: Create `FirebaseConfig.java` (initialize Firebase)
- [ ] Backend: Create `FCMService.java` (send notifications)
- [ ] Backend: Modify `User.java` entity (add `fcmToken` field)
- [ ] Backend: Run database migration (ALTER TABLE users)
- [ ] Backend: Create endpoint `PUT /api/profile/fcm-token`
- [ ] Backend: Integrate FCM vào `AuthNotificationService`
- [ ] Backend: Integrate FCM vào `ChatNotificationService`
- [ ] Backend: Integrate FCM vào `ProjectNotificationService`
- [ ] Backend: Integrate FCM vào `LeaveRequestNotificationService`
- [ ] Backend: Test FCM sending với Postman

## Phase 3: Flutter - Firebase Setup
- [ ] Run FlutterFire CLI: `flutterfire configure`
- [ ] Add Firebase dependencies vào `pubspec.yaml`
- [ ] Copy `google-services.json` vào `android/app/`
- [ ] Configure Android `build.gradle` files
- [ ] Initialize Firebase trong `main.dart`
- [ ] Create `FirebaseNotificationService`
- [ ] Request notification permission (Android 13+)
- [ ] Get FCM token on app start
- [ ] Send FCM token to backend: `PUT /api/profile/fcm-token`
- [ ] Setup foreground notification handler
- [ ] Setup background notification handler
- [ ] Setup terminated notification handler
- [ ] Test receiving push notifications (all 3 states)
- [ ] Implement notification navigation logic

## Phase 4: Core Features - Data Layer
- [ ] Create centralized `ApiService` với auth headers
- [ ] Implement token refresh logic (401 handling)
- [ ] Create HR models (NhanVien, ChamCong, BangLuong, NghiPhep)
- [ ] Create Project models (Project, Issue, Sprint)
- [ ] Create Notification model
- [ ] Create `AttendanceService` (GPS check-in/out)
- [ ] Create `PayrollService` (view payroll)
- [ ] Create `LeaveService` (CRUD leave requests)
- [ ] Create `ProjectService` (list projects)
- [ ] Create `IssueService` (list/update issues)
- [ ] Create `NotificationService` (list, mark read)

## Phase 5: Employee Features - HR Module
- [ ] Screen: GPS Attendance (`attendance_screen.dart`)
  - [ ] Integrate `geolocator` package
  - [ ] Request location permission
  - [ ] Get current GPS coordinates
  - [ ] Display address (reverse geocoding)
  - [ ] Check-in button → `POST /cham-cong/gps`
  - [ ] Check-out button → `PUT /cham-cong/{id}/check-out`
  - [ ] Display working hours today
  - [ ] Calendar view cho tháng
- [ ] Screen: Payroll (`payroll_screen.dart`)
  - [ ] Month/Year picker
  - [ ] Load payroll: `GET /bang-luong/nhan-vien/{id}`
  - [ ] Display salary breakdown (lương, phụ cấp, khấu trừ)
  - [ ] Highlight lương thực nhận
  - [ ] History (previous months)
- [ ] Screen: Leave Request (`leave_request_screen.dart`)
  - [ ] Form tạo đơn nghỉ phép
  - [ ] Date range picker
  - [ ] Leave type dropdown (PHEP_NAM, OM, KO_LUONG)
  - [ ] Submit → `POST /nghi-phep`
  - [ ] List my leave requests
  - [ ] Status color-coding (CHO_DUYET, DA_DUYET, TU_CHOI)
- [ ] Screen: Profile (`profile_screen.dart`)
  - [ ] Display user info (name, email, phone)
  - [ ] Display department + position
  - [ ] Change password
  - [ ] Logout button

## Phase 6: Employee Features - Project Module
- [ ] Screen: My Projects (`projects_screen.dart`)
  - [ ] Load `GET /api/projects/user/{userId}`
  - [ ] Filter by status (ACTIVE, COMPLETED)
  - [ ] Simple list view
- [ ] Screen: My Tasks (`my_tasks_screen.dart`)
  - [ ] Load `GET /api/issues/assignee/{userId}`
  - [ ] Filter by status (TODO, IN_PROGRESS, DONE)
  - [ ] Group by Project
- [ ] Screen: Task Detail (`issue_detail_screen.dart`)
  - [ ] Display full issue info
  - [ ] Comments section
  - [ ] **Update status** (Employee main action)
  - [ ] Activity log

## Phase 7: Core Features - Notification Module
- [ ] Screen: Notifications List (`notifications_screen.dart`)
  - [ ] Load `GET /api/notifications?page={page}`
  - [ ] Infinite scroll pagination
  - [ ] Unread/read visual distinction
  - [ ] Mark as read on tap
  - [ ] Navigate to content based on type
  - [ ] Mark all as read button
- [ ] Widget: Notification Badge
  - [ ] Load unread count: `GET /api/notifications/unread`
  - [ ] Auto-refresh every 30s
  - [ ] Display in AppBar
  - [ ] Update on pull-to-refresh

## Phase 8: UI/UX Polish
- [ ] Create app theme (`app_theme.dart`)
  - [ ] Define primary/secondary colors
  - [ ] Text styles (heading, body, caption)
  - [ ] Button styles
  - [ ] Card styles
- [ ] Create reusable widgets
  - [ ] `CustomButton` widget
  - [ ] `LoadingIndicator` widget
  - [ ] `EmptyState` widget
  - [ ] `ErrorWidget` with retry
  - [ ] `UserAvatar` widget
  - [ ] `StatusChip` widget (color-coded)
- [ ] Implement app-wide navigation
  - [ ] Named routes (`app_router.dart`)
  - [ ] Deep linking for notifications
  - [ ] Route guards (auth check)
- [ ] Add smooth animations/transitions
- [ ] Add loading states cho tất cả async operations
- [ ] Add error handling UI
- [ ] Polish existing chat UI

## Phase 9: Testing & Verification (Employee Flows)
- [ ] Unit tests cho services
- [ ] Widget tests cho reusable widgets
- [ ] Integration tests
  - [ ] Login flow (with token refresh)
  - [ ] GPS attendance flow
  - [ ] Leave request submission
  - [ ] My Tasks flow
  - [ ] WebSocket chat connection
- [ ] Manual testing
  - [ ] Test trên Android emulator
  - [ ] Test trên real device
  - [ ] Test different screen sizes
  - [ ] Test offline scenarios
  - [ ] Test GPS permission scenarios
  - [ ] Test push notifications (foreground/background/terminated)
  - [ ] Test navigation from notifications
- [ ] User acceptance testing
  - [ ] Employee flow (check-in, leave request, view payroll)
  - [ ] Employee flow (update task status)
