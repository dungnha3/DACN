# Implementation Plan: Flutter Mobile App (Employee Focus)

## Tổng Quan

Phát triển ứng dụng di động Flutter tích hợp với backend Spring Boot hiện tại và Firebase Cloud Messaging.
**Mục tiêu:** Xây dựng ứng dụng dành riêng cho **Nhân viên (Employee)**. Các tính năng quản lý (Admin/Manager) sẽ được thực hiện trên **Web Portal**, không có trên mobile.

**Backend đã có:**
- ✅ 8 modules đầy đủ: common, auth, user, hr, project, chat, notification, storage
- ❌ **CHƯA CÓ:** Firebase Cloud Messaging integration

**Mobile app hiện có:**
- ✅ Basic authentication (login/logout)
- ✅ Real-time chat với STOMP WebSocket
- ❌ **THIẾU:** Push notifications, HR features, My Tasks, polished UI/UX

---

## User Review Required

> [!IMPORTANT]
> **Firebase Setup Questions**
> 
> Trước khi bắt đầu implementation, cần xác nhận:
> 
> 1. **Firebase Project:** Đã có Firebase project rồi hay cần tạo mới?
> 2. **Platforms:** Ưu tiên Android trước hay cả Android + iOS?
> 3. **Service Account Key:** Backend đã có service account JSON key chưa? (cần để gửi FCM từ backend)

---

## Proposed Changes

### Backend - Firebase Cloud Messaging Integration

#### [NEW] [FirebaseConfig.java](file:///c:/DACN/BE/BE/src/main/java/DoAn/BE/common/config/FirebaseConfig.java)
Configuration cho Firebase Admin SDK.

#### [NEW] [FCMService.java](file:///c:/DACN/BE/BE/src/main/java/DoAn/BE/notification/service/FCMService.java)
Service gửi push notifications qua FCM.

#### [MODIFY] [User.java](file:///c:/DACN/BE/BE/src/main/java/DoAn/BE/user/entity/User.java)
Thêm field `fcmToken`.

#### [NEW] [ProfileController.java](file:///c:/DACN/BE/BE/src/main/java/DoAn/BE/user/controller/ProfileController.java)
New endpoints: `PUT /api/profile/fcm-token`.

---

### Flutter - Core Infrastructure

#### [MODIFY] [pubspec.yaml](file:///c:/DACN/mobile/pubspec.yaml)
Add dependencies: `firebase_core`, `firebase_messaging`, `flutter_local_notifications`, `geolocator`, `provider`, `http`.

#### [NEW] [firebase_notification_service.dart](file:///c:/DACN/mobile/lib/services/firebase_notification_service.dart)
Handle FCM: Request permission, Get token, Send to backend, Handle notifications.

---

### Flutter - Data Layer

#### [NEW] [api_service.dart](file:///c:/DACN/mobile/lib/data/services/api_service.dart)
Centralized HTTP client với JWT authentication headers và Token refresh.

#### [NEW] Models & Services
- **HR:** `AttendanceService`, `PayrollService`, `LeaveService`.
- **Project:** `IssueService` (Focus on My Tasks).
- **Notification:** `NotificationService`.

---

### Flutter - UI/Screens (Employee Only)

#### HR Self-Service Module

**[NEW] [attendance_screen.dart](file:///c:/DACN/mobile/lib/screens/hr/attendance_screen.dart)**
- GPS Check-in/Check-out.
- Xem giờ làm việc hôm nay.
- Lịch chấm công.

**[NEW] [payroll_screen.dart](file:///c:/DACN/mobile/lib/screens/hr/payroll_screen.dart)**
- Xem bảng lương chi tiết (Lương, Phụ cấp, Khấu trừ).
- Lịch sử lương.

**[NEW] [leave_request_screen.dart](file:///c:/DACN/mobile/lib/screens/hr/leave_request_screen.dart)**
- Tạo đơn nghỉ phép.
- Xem lịch sử đơn nghỉ phép.

**[NEW] [profile_screen.dart](file:///c:/DACN/mobile/lib/screens/profile/profile_screen.dart)**
- Thông tin cá nhân.
- Đổi mật khẩu, Đăng xuất.

---

#### Project Module (Employee View)

**[NEW] [my_tasks_screen.dart](file:///c:/DACN/mobile/lib/screens/projects/my_tasks_screen.dart)**
- Danh sách Task được giao cho tôi (`GET /api/issues/assignee/{userId}`).
- Filter: TODO, IN_PROGRESS, DONE.

**[NEW] [issue_detail_screen.dart](file:///c:/DACN/mobile/lib/screens/projects/issue_detail_screen.dart)**
- Chi tiết Task.
- **Cập nhật trạng thái** (Kéo thả hoặc Dropdown).
- Comment & Activity.

---

#### Notification Module

**[NEW] [notifications_screen.dart](file:///c:/DACN/mobile/lib/screens/notifications/notifications_screen.dart)**
- Danh sách thông báo.
- Đánh dấu đã đọc.

---

### Flutter - UI/UX Improvements

#### [NEW] Theme System & Widgets
- `app_theme.dart`: Consistent branding.
- `CustomButton`, `LoadingIndicator`, `EmptyState`.

---

## Implementation Order

**Phase 1: Foundation (Week 1)**
1. ✅ Backend analysis (COMPLETED)
2. Setup Firebase project.
3. Backend: Add FCM integration.
4. Flutter: Firebase initialization.

**Phase 2: Employee Core Features (Week 2-3)**
1. **HR:** GPS Attendance, Payroll, Leave Request.
2. **Project:** My Tasks, Update Task Status.
3. **Notification:** List & Badge.

**Phase 3: Polish & Testing (Week 4)**
1. UI/UX improvements.
2. Comprehensive testing (Employee flows).

---

## Verification Plan (Employee Flows)

### Automated Tests
- Unit tests for Services.
- Widget tests for Screens.

### Integration Tests
1. Login → Token Refresh.
2. GPS Check-in flow.
3. Leave Request submission.
4. Update Task Status flow.

### Manual Verification
1. **Employee Flow:**
   - Login.
   - Check-in GPS (verify location).
   - View Payroll (verify numbers).
   - Create Leave Request (verify status).
   - View "My Tasks" -> Move task to "Done".
   - Receive Notification -> Tap to open.

---

## API Endpoint Reference (Employee Focus)

### Auth & Profile
- `POST /api/auth/login`
- `PUT /api/profile/fcm-token`

### HR
- `POST /cham-cong/gps`
- `GET /bang-luong/nhan-vien/{id}`
- `POST /nghi-phep`

### Project (My Tasks)
- `GET /api/issues/assignee/{userId}` - **Key Endpoint**
- `PUT /api/issues/{id}/status` - **Key Endpoint**

### Notifications
- `GET /api/notifications`
