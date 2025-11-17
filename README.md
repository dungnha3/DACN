# 🚀 Enterprise Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-blue.svg)](https://docs.spring.io/spring-framework/reference/web/websocket.html)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🎯 **Hệ thống quản lý doanh nghiệp tích hợp đầy đủ** - Project Management, HR, Chat, Notifications, File Storage

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [🚀 Running](#-running)
- [📡 API Documentation](#-api-documentation)
- [🔔 Real-time Features](#-real-time-features)
- [⏰ Scheduled Jobs](#-scheduled-jobs)
- [🎨 Module Integration](#-module-integration)
- [👥 Contributors](#-contributors)

---

## ✨ Features

### 🎯 **Project Management**

#### **Projects & Teams**
- ✅ **Tạo và quản lý dự án** - Khởi tạo dự án với mô tả, timeline, và mục tiêu
- ✅ **Quản lý thành viên** - Thêm/xóa members, phân quyền (Owner, Manager, Member)
- ✅ **Project Dashboard** - Tổng quan tiến độ, workload, và completion rate
- ✅ **Project Chat Integration** - Tự động tạo chat room khi tạo project
- ✅ **Project Status Tracking** - Theo dõi trạng thái (Planning, Active, Completed, Archived)

#### **Sprint Management (Scrum/Agile)**
- ✅ **Sprint Planning** - Tạo sprint với start date, end date, và goals
- ✅ **Sprint Backlog** - Quản lý issues trong sprint
- ✅ **Sprint Board** - Kanban/Scrum board cho sprint
- ✅ **Sprint Start/Complete** - Workflow chuyển trạng thái sprint
- ✅ **Sprint Statistics** - Velocity, burndown chart, completion rate
- ✅ **Sprint Notifications** - Tự động thông báo khi sprint bắt đầu/kết thúc

#### **Issue Tracking**
- ✅ **Issue Creation** - Tạo tasks, bugs, stories với priority và estimation
- ✅ **Issue Assignment** - Giao việc cho team members với notification
- ✅ **Issue Status** - Workflow transitions (To Do → In Progress → Done)
- ✅ **Issue Comments** - Thảo luận và cộng tác trên từng issue
- ✅ **Issue Activities** - Lịch sử thay đổi và activities log
- ✅ **Issue Overdue Detection** - Tự động phát hiện và nhắc nhở issues quá hạn
- ✅ **Deadline Reminders** - Nhắc nhở 3 ngày trước deadline
- ✅ **@Mention in Comments** - Tag users trong comments để notify

#### **Workload Management**
- ✅ **User Workload Tracking** - Theo dõi số lượng issues và estimated hours
- ✅ **Overload Detection** - Cảnh báo khi user có quá nhiều tasks (>10 issues hoặc >80h)
- ✅ **Workload Dashboard** - Xem workload của từng member trong team
- ✅ **Completion Rate** - Tính toán tỷ lệ hoàn thành công việc
- ✅ **Capacity Planning** - Hỗ trợ phân bổ công việc hợp lý

---

### 💬 **Real-time Chat**

#### **Chat Rooms**
- ✅ **Group Chat** - Tạo phòng chat nhóm với nhiều thành viên
- ✅ **Direct Messaging** - Chat 1-1 giữa 2 users
- ✅ **Project Chat** - Tự động tạo và link với project
- ✅ **Room Management** - Thêm/xóa members, rename room, set avatar
- ✅ **Room Types** - Hỗ trợ GROUP, DIRECT, PROJECT rooms
- ✅ **Room Archiving** - Archive chat rooms không dùng nữa

#### **Messaging**
- ✅ **Text Messages** - Gửi tin nhắn văn bản
- ✅ **File Attachments** - Đính kèm files, images, documents
- ✅ **Message Reactions** - React với emoji (👍, ❤️, 😂, etc.)
- ✅ **Reply to Message** - Trả lời trực tiếp tin nhắn cụ thể
- ✅ **Edit Message** - Sửa tin nhắn đã gửi (với edited indicator)
- ✅ **Delete Message** - Xóa tin nhắn (soft delete)
- ✅ **Message Search** - Tìm kiếm tin nhắn trong room

#### **Real-time Features**
- ✅ **Instant Delivery** - Tin nhắn được gửi real-time qua WebSocket
- ✅ **Online/Offline Status** - Hiển thị trạng thái online của users
- ✅ **Typing Indicators** - "User is typing..." indicator
- ✅ **Read Receipts** - Seen/Unseen message status
- ✅ **Last Seen** - Hiển thị thời gian online cuối cùng
- ✅ **Presence Notifications** - Thông báo khi user online/offline

#### **Mentions & Integration**
- ✅ **@User Mentions** - Tag users trong tin nhắn (@username)
- ✅ **@Task Mentions** - Reference tasks trong chat (@TASK-123)
- ✅ **Auto-link Detection** - Tự động detect và link URLs
- ✅ **Notification Integration** - Notify khi được mention

---

### 👥 **HR Management**

#### **Employee Management**
- ✅ **Employee Profiles** - Quản lý thông tin nhân viên đầy đủ
- ✅ **Department Assignment** - Phân bổ nhân viên vào các phòng ban
- ✅ **Position Management** - Quản lý chức vụ và cấp bậc
- ✅ **Employee Search** - Tìm kiếm và filter nhân viên
- ✅ **Employee Statistics** - Thống kê số lượng, phân bổ theo phòng ban
- ✅ **Department Changes** - Chuyển phòng ban với notification

#### **Contract Management**
- ✅ **Contract Types** - Thử việc, chính thức, thời vụ, freelance
- ✅ **Contract Tracking** - Theo dõi hợp đồng và thời hạn
- ✅ **Expiry Detection** - Tự động phát hiện hợp đồng sắp hết hạn
- ✅ **Contract Reminders** - Nhắc nhở 30 ngày và 7 ngày trước khi hết hạn
- ✅ **Contract History** - Lịch sử hợp đồng của nhân viên

#### **Performance Evaluation**
- ✅ **Review Cycles** - Tạo chu kỳ đánh giá định kỳ
- ✅ **KPI Tracking** - Theo dõi KPIs và objectives
- ✅ **Rating System** - Đánh giá theo thang điểm
- ✅ **Feedback System** - Ghi nhận feedback từ managers
- ✅ **Performance Reports** - Báo cáo hiệu suất làm việc

#### **Salary & Payroll**
- ✅ **Salary Calculation** - Tính lương tự động theo công thức
- ✅ **Allowances** - Quản lý các khoản phụ cấp
- ✅ **Deductions** - Khấu trừ bảo hiểm, thuế, etc.
- ✅ **Bonus Management** - Thưởng theo hiệu suất
- ✅ **Payroll Reports** - Báo cáo bảng lương tháng
- ✅ **Salary Approval** - Workflow duyệt lương với notification

#### **Leave Management**
- ✅ **Leave Request** - Nhân viên tạo đơn nghỉ phép
- ✅ **Leave Types** - Phép năm, phép ốm, phép không lương, etc.
- ✅ **Approval Workflow** - Manager duyệt/từ chối đơn
- ✅ **Leave Balance** - Theo dõi số ngày phép còn lại
- ✅ **Leave Calendar** - Xem lịch nghỉ của team
- ✅ **Leave Notifications** - Thông báo khi submit/approve/reject

---

### ⏰ **Attendance System**

#### **Check-in/Check-out**
- ✅ **GPS-based Attendance** - Chấm công bằng GPS location
- ✅ **Location Validation** - Kiểm tra trong bán kính cho phép (default 500m)
- ✅ **Distance Calculation** - Tính khoảng cách từ công ty
- ✅ **Address Display** - Hiển thị địa chỉ check-in
- ✅ **Check-in Methods** - GPS, Manual, QR Code, Face ID (future)
- ✅ **Working Hours** - Tự động tính tổng giờ làm việc

#### **Attendance Tracking**
- ✅ **Daily Records** - Ghi nhận chấm công mỗi ngày
- ✅ **Late Detection** - Tự động phát hiện đi trễ (>8:00 AM)
- ✅ **Early Leave Detection** - Phát hiện về sớm (<5:00 PM)
- ✅ **Missing Attendance** - Detect ngày không chấm công
- ✅ **Attendance Status** - Đúng giờ, đi trễ, về sớm, vắng mặt

#### **Reports & Analytics**
- ✅ **Monthly Report** - Báo cáo chấm công tháng
- ✅ **Attendance Summary** - Tổng số ngày làm việc, đi trễ, vắng
- ✅ **Statistics Dashboard** - Biểu đồ và thống kê chi tiết
- ✅ **Export Reports** - Xuất Excel/PDF (future)
- ✅ **Team Attendance** - Xem chấm công của cả team

#### **Automated Notifications**
- ✅ **Check-in Success** - Thông báo khi check-in thành công
- ✅ **Late Alert** - Cảnh báo khi check-in trễ
- ✅ **Checkout Reminder** - Nhắc checkout lúc 5:30 PM
- ✅ **Missing Attendance** - Nhắc nhở lúc 8:00 PM nếu chưa chấm công
- ✅ **Monthly Summary** - Gửi tổng kết đầu tháng

---

### 📁 **File Storage**

#### **Storage Organization**
- ✅ **Folder System** - Tổ chức files theo folders và subfolders
- ✅ **Folder Types** - PERSONAL (cá nhân), SHARED (chia sẻ), PROJECT (dự án)
- ✅ **Auto-create Project Folders** - Tự động tạo folder khi tạo project
- ✅ **Folder Permissions** - Kiểm soát quyền truy cập folders
- ✅ **Nested Folders** - Hỗ trợ folder con không giới hạn

#### **File Management**
- ✅ **File Upload** - Upload multiple files (max 100MB/file)
- ✅ **File Download** - Download files với rate limiting
- ✅ **File Preview** - Preview images, PDFs (future)
- ✅ **File Metadata** - Lưu original name, size, type, upload date
- ✅ **File Versioning** - Track version changes (future enhancement)
- ✅ **Soft Delete** - Files bị xóa có thể restore

#### **Storage Quota**
- ✅ **User Quota** - Default 5GB per user
- ✅ **Admin Quota** - 10GB for admins
- ✅ **Quota Tracking** - Theo dõi dung lượng đã dùng
- ✅ **Quota Warnings** - Cảnh báo khi vượt 80%
- ✅ **Quota Exceeded** - Block upload khi hết dung lượng

#### **Sharing & Collaboration**
- ✅ **File Sharing** - Share files với users khác
- ✅ **Folder Sharing** - Share cả folder
- ✅ **Project Files** - Files tự động share với project members
- ✅ **Share Notifications** - Notify khi được share files

#### **Advanced Features**
- ✅ **File Search** - Tìm kiếm files theo tên
- ✅ **Recent Files** - Xem files gần đây (30 ngày)
- ✅ **Shared with Me** - Xem files được share
- ✅ **File Statistics** - Thống kê theo loại (documents, images, videos)
- ✅ **Storage Analytics** - Phân tích dung lượng sử dụng

---

### 🔔 **Notification System**

#### **Notification Types (35+)**
- ✅ **Chat Notifications** - New messages, mentions, replies, member added
- ✅ **Project Notifications** - Member changes, status updates, completions
- ✅ **Issue Notifications** - Assignments, status changes, comments, overdue
- ✅ **Sprint Notifications** - Sprint start, ending reminders, completions
- ✅ **Storage Notifications** - Uploads, shares, quota warnings
- ✅ **Attendance Notifications** - Check-in/out, late alerts, reminders
- ✅ **HR Notifications** - Leave requests, contracts, salary approvals

#### **Delivery Channels**
- ✅ **In-app Notifications** - Hiển thị trong app với badge count
- ✅ **Real-time WebSocket** - Push notifications qua WebSocket
- ✅ **Email Notifications** - Gửi email cho notifications quan trọng
- ✅ **Push Notifications** - Mobile push (future)

#### **Notification Management**
- ✅ **Mark as Read** - Đánh dấu đã đọc individual hoặc bulk
- ✅ **Notification List** - Xem tất cả notifications
- ✅ **Notification Filters** - Filter theo type, status
- ✅ **Notification Preferences** - Tùy chỉnh loại notification nhận
- ✅ **Notification History** - Lưu lịch sử 90 ngày

---

### 🤖 **Automation & Scheduled Jobs**

#### **Issue Automation**
- ✅ **Overdue Detection** - Scan daily 9:00 AM, detect overdue issues
- ✅ **Deadline Reminders** - Remind 3 days before deadline (10:00 AM)
- ✅ **Auto-notify Assignees** - Tự động gửi notifications

#### **Attendance Automation**
- ✅ **Checkout Reminder** - Nhắc checkout mỗi 5:30 PM (Mon-Fri)
- ✅ **Missing Check** - Scan 8:00 PM, notify users chưa chấm công
- ✅ **Monthly Summary** - Gửi báo cáo ngày 1 hàng tháng 9:00 AM

#### **Sprint Automation**
- ✅ **Sprint Ending Alert** - Nhắc nhở 3 ngày trước khi sprint kết thúc
- ✅ **Daily Sprint Check** - Scan 8:00 AM mỗi ngày

#### **HR Automation**
- ✅ **Contract Expiry Check** - Daily scan, warn 30 & 7 days before expiry
- ✅ **Leave Balance Update** - Auto-update số ngày phép
- ✅ **Probation End Reminders** - Nhắc nhở khi hết thử việc

#### **Cron Schedules**
```
9:00 AM Daily    - Issue overdue check
10:00 AM Daily   - Deadline reminders
5:30 PM Weekdays - Checkout reminder
8:00 PM Weekdays - Missing attendance check
8:00 AM Daily    - Sprint ending check
9:00 AM Monthly  - Attendance summary
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│           WebSocket Client + REST API Client            │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/WebSocket
                     │
┌────────────────────▼────────────────────────────────────┐
│               Spring Boot Backend                        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Security   │  │   WebSocket  │  │  Scheduler   │ │
│  │   (JWT)      │  │   (STOMP)    │  │  (Cron)      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Project    │  │     Chat     │  │      HR      │ │
│  │   Module     │  │    Module    │  │    Module    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Storage    │  │Notification  │  │     User     │ │
│  │   Module     │  │    Module    │  │    Module    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ JDBC
                     │
┌────────────────────▼────────────────────────────────────┐
│              SQL Server Database                         │
│        (Users, Projects, Messages, Files, etc.)         │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 21 | Programming Language |
| Spring Boot | 3.5.6 | Framework |
| Spring Security | 3.5.6 | Authentication & Authorization |
| Spring WebSocket | 3.5.6 | Real-time Communication |
| Spring Data JPA | 3.5.6 | Database ORM |
| Hibernate | 6.x | JPA Implementation |
| JWT | - | Token-based Auth |
| Lombok | - | Boilerplate Reduction |
| Maven | - | Build Tool |

### **Database**
| Technology | Purpose |
|------------|---------|
| SQL Server | Primary Database |
| Flyway | Database Migration (optional) |

### **Real-time**
| Technology | Purpose |
|------------|---------|
| WebSocket | Bidirectional Communication |
| STOMP | Messaging Protocol |
| SockJS | WebSocket Fallback |

### **DevOps**
| Tool | Purpose |
|------|---------|
| Git | Version Control |
| Maven | Dependency Management |
| Postman | API Testing |

---

## 📦 Installation

### **Prerequisites**
```bash
✅ Java 21 or higher
✅ Maven 3.8+
✅ SQL Server 2019+
✅ Git
```

### **Clone Repository**
```bash
git clone https://github.com/yourusername/enterprise-management.git
cd enterprise-management/BE
```

### **Database Setup**
```sql
-- Create database
CREATE DATABASE EnterpriseDB;

-- Run schema from resources/schema.sql (if provided)
-- Or let Spring Boot auto-create tables
```

---

## 🔧 Configuration

### **application.properties**
```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=EnterpriseDB;encrypt=true;trustServerCertificate=true
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect

# JWT Configuration
jwt.secret=your-secret-key-here-minimum-256-bits
jwt.expiration=86400000

# File Upload Configuration
file.upload-dir=./uploads
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=100MB

# Storage Quota
app.storage.user-quota-gb=5
app.storage.admin-quota-gb=10

# GPS Configuration (for Attendance)
company.latitude=21.0285
company.longitude=105.8542
company.radius=500

# Email Configuration (optional)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## 🚀 Running

### **Development Mode**
```bash
# Using Maven
mvn spring-boot:run

# Or build and run
mvn clean package
java -jar target/BE-0.0.1-SNAPSHOT.war
```

### **Production Mode**
```bash
# Build with production profile
mvn clean package -Pprod

# Run with production config
java -jar target/BE-0.0.1-SNAPSHOT.war --spring.profiles.active=prod
```

### **Access Application**
```
🌐 API Base URL: http://localhost:8080
🔌 WebSocket URL: ws://localhost:8080/ws/chat
📚 API Docs: http://localhost:8080/swagger-ui.html (if enabled)
```

---

## 📡 API Documentation

### **Authentication**
```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh-token
GET  /api/auth/me
```

### **Project Management**
```http
# Projects
GET    /api/projects
POST   /api/projects
GET    /api/projects/{id}
PUT    /api/projects/{id}
DELETE /api/projects/{id}

# Members
POST   /api/projects/{id}/members
DELETE /api/projects/{projectId}/members/{memberId}
PUT    /api/projects/{projectId}/members/{memberId}/role

# Issues
GET    /api/projects/issues
POST   /api/projects/issues
GET    /api/projects/issues/{id}
PUT    /api/projects/issues/{id}
DELETE /api/projects/issues/{id}
POST   /api/projects/issues/{id}/assign

# Sprints
GET    /api/projects/sprints
POST   /api/projects/sprints
POST   /api/projects/sprints/{id}/start
POST   /api/projects/sprints/{id}/complete

# Project Files
GET    /api/projects/{projectId}/files
GET    /api/projects/{projectId}/files/stats
```

### **Chat**
```http
# Rooms
GET    /api/chat/rooms
POST   /api/chat/rooms
GET    /api/chat/rooms/{id}
POST   /api/chat/rooms/{id}/members
DELETE /api/chat/rooms/{roomId}/members/{memberId}

# Messages
GET    /api/chat/rooms/{roomId}/messages
POST   /api/chat/rooms/{roomId}/messages
PUT    /api/chat/messages/{messageId}
DELETE /api/chat/messages/{messageId}
POST   /api/chat/messages/{messageId}/reactions

# WebSocket Topics
SUBSCRIBE /topic/chat/{roomId}
SEND      /app/chat/send
SEND      /app/chat/typing/start
SEND      /app/chat/typing/stop
```

### **HR Management**
```http
# Employees
GET    /api/hr/nhan-vien
POST   /api/hr/nhan-vien
GET    /api/hr/nhan-vien/{id}
PUT    /api/hr/nhan-vien/{id}
DELETE /api/hr/nhan-vien/{id}

# Attendance
GET    /api/hr/cham-cong
POST   /api/hr/cham-cong/gps
GET    /api/hr/cham-cong/thang/{year}/{month}

# Leave Requests
GET    /api/hr/nghi-phep
POST   /api/hr/nghi-phep
PUT    /api/hr/nghi-phep/{id}/approve
PUT    /api/hr/nghi-phep/{id}/reject

# Salary
GET    /api/hr/bang-luong
POST   /api/hr/bang-luong
GET    /api/hr/bang-luong/{id}
```

### **File Storage**
```http
POST   /api/storage/files              # Upload file
GET    /api/storage/files/{id}/download
DELETE /api/storage/files/{id}
GET    /api/storage/folders
POST   /api/storage/folders
GET    /api/storage/quota
```

### **Notifications**
```http
GET    /api/notifications
PUT    /api/notifications/{id}/read
PUT    /api/notifications/read-all
DELETE /api/notifications/{id}

# WebSocket
SUBSCRIBE /user/queue/notifications
```

---

## 🔔 Real-time Features

### **WebSocket Connection**
```javascript
// Frontend example
const socket = new SockJS('http://localhost:8080/ws/chat');
const stompClient = Stomp.over(socket);

stompClient.connect({
    'Authorization': 'Bearer ' + token
}, (frame) => {
    console.log('Connected:', frame);
    
    // Subscribe to chat room
    stompClient.subscribe('/topic/chat/123', (message) => {
        const data = JSON.parse(message.body);
        console.log('New message:', data);
    });
    
    // Subscribe to personal notifications
    stompClient.subscribe('/user/queue/notifications', (notification) => {
        const data = JSON.parse(notification.body);
        console.log('New notification:', data);
    });
});
```

### **Real-time Events**
| Event | Topic | Description |
|-------|-------|-------------|
| New Message | `/topic/chat/{roomId}` | Real-time chat messages |
| Typing | `/topic/chat/{roomId}/typing` | User typing indicators |
| User Status | `/topic/chat/{roomId}/presence` | Online/offline status |
| Notification | `/user/queue/notifications` | Personal notifications |
| Project Update | `/topic/project/{projectId}` | Project changes |

---

## ⏰ Scheduled Jobs

### **Automated Tasks**
| Job | Schedule | Description |
|-----|----------|-------------|
| **Issue Overdue Checker** | Daily 9:00 AM | Detect overdue issues, notify assignees |
| **Deadline Reminder** | Daily 10:00 AM | Remind issues due in 3 days |
| **Checkout Reminder** | Mon-Fri 5:30 PM | Remind users to check-out |
| **Missing Attendance** | Mon-Fri 8:00 PM | Notify users missing attendance |
| **Monthly Summary** | 1st of month 9:00 AM | Send attendance summary |
| **Sprint Ending Reminder** | Daily 8:00 AM | Notify sprints ending in 3 days |

### **Cron Expressions**
```java
@Scheduled(cron = "0 0 9 * * *")    // 9:00 AM daily
@Scheduled(cron = "0 30 17 * * MON-FRI")  // 5:30 PM weekdays
@Scheduled(cron = "0 0 9 1 * *")    // 9:00 AM 1st of month
```

---

## 🎨 Module Integration

### **Integration Matrix**
| Module A | Module B | Features |
|----------|----------|----------|
| **Chat** ↔ **Project** | ✅ Auto-create chat room<br>✅ Sync members<br>✅ @Mention tasks<br>✅ System messages |
| **Project** ↔ **Notification** | ✅ Member changes<br>✅ Status updates<br>✅ Role changes<br>✅ Completion alerts |
| **Issue** ↔ **Notification** | ✅ Assignment<br>✅ Status change<br>✅ Comments<br>✅ Overdue alerts |
| **Storage** ↔ **Project** | ✅ Project folders<br>✅ File uploads<br>✅ Member notifications |
| **Attendance** ↔ **Notification** | ✅ Check-in/out success<br>✅ Late alerts<br>✅ Missing reminders |
| **User** ↔ **Project** | ✅ Workload tracking<br>✅ Overload detection<br>✅ Capacity planning |

### **Notification Types (35+)**
```
Chat Notifications:
✅ CHAT_NEW_MESSAGE
✅ CHAT_MENTION
✅ CHAT_REPLY
✅ CHAT_MEMBER_ADDED

Project Notifications:
✅ PROJECT_MEMBER_ADDED
✅ PROJECT_MEMBER_REMOVED
✅ PROJECT_STATUS_CHANGED
✅ PROJECT_COMPLETED
✅ PROJECT_ARCHIVED
✅ PROJECT_ROLE_CHANGED

Issue Notifications:
✅ PROJECT_ISSUE_ASSIGNED
✅ PROJECT_ISSUE_COMMENT
✅ PROJECT_ISSUE_STATUS
✅ PROJECT_ISSUE_UPDATED
✅ PROJECT_ISSUE_OVERDUE

Sprint Notifications:
✅ PROJECT_SPRINT_STARTED
✅ PROJECT_SPRINT_ENDING
✅ PROJECT_SPRINT_COMPLETED

Storage Notifications:
✅ STORAGE_UPLOAD
✅ STORAGE_FILE_SHARED
✅ STORAGE_FOLDER_SHARED
✅ STORAGE_QUOTA_WARNING
✅ PROJECT_FILE_UPLOADED

Attendance Notifications:
✅ ATTENDANCE_CHECKIN_SUCCESS
✅ ATTENDANCE_CHECKIN_LATE
✅ ATTENDANCE_CHECKOUT_SUCCESS
✅ ATTENDANCE_MISSING
✅ ATTENDANCE_MONTHLY_SUMMARY

HR Notifications:
✅ LEAVE_REQUEST_SUBMITTED
✅ LEAVE_REQUEST_APPROVED
✅ LEAVE_REQUEST_REJECTED
✅ CONTRACT_EXPIRING
✅ DEPARTMENT_CHANGED
✅ SALARY_APPROVED
```

---

## 🧪 Testing

### **Run Tests**
```bash
mvn test
```

### **API Testing with Postman**
1. Import Postman collection from `/docs/postman/`
2. Set environment variables
3. Run test scenarios

---

## 📊 Database Schema

### **Core Tables**
```sql
-- Users & Authentication
users
roles
user_roles

-- Projects
projects
project_members
sprints
issues
issue_comments
issue_activities
issue_status

-- Chat
chat_rooms
chat_room_members
messages
message_reactions

-- HR
nhan_vien (employees)
phong_ban (departments)
chuc_vu (positions)
cham_cong (attendance)
nghi_phep (leave requests)
bang_luong (salary)
hop_dong (contracts)

-- Storage
files
folders

-- Notifications
notifications
thong_bao
```

---

## 🚧 Roadmap

### **Completed** ✅
- [x] Project Management with Sprints
- [x] Real-time Chat with WebSocket
- [x] HR Management System
- [x] GPS Attendance
- [x] File Storage
- [x] Comprehensive Notifications
- [x] Automated Scheduled Jobs
- [x] User Workload Tracking

### **In Progress** 🚧
- [ ] Mobile App Integration
- [ ] Advanced Analytics Dashboard
- [ ] Email Integration
- [ ] Export Reports (PDF/Excel)

### **Planned** 📝
- [ ] AI-powered Task Recommendations
- [ ] Video Call Integration
- [ ] Advanced Security (2FA)
- [ ] Multi-language Support

---

## 👥 Contributors

- **Developer Team** - Initial work and development

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Spring Boot Team
- All open-source contributors
- Project stakeholders

---

## 📞 Contact & Support

For questions or support:
- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/enterprise-management/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/enterprise-management/wiki)

---

<div align="center">

**⭐ If you find this project useful, please give it a star! ⭐**

Made with ❤️ by the Development Team

</div>