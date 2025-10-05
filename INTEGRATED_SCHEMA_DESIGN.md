# 🏗️ THIẾT KẾ SCHEMA TÍCH HỢP - ĐỒ ÁN LỚN

## 📋 TỔNG QUAN SCHEMA

### 🎯 Mục tiêu
- Tích hợp hoàn toàn ChatApp và QLNS vào đồ án lớn
- Đảm bảo tính nhất quán và tối ưu hóa database
- Hỗ trợ đầy đủ các chức năng: HR, Project Management, Chat, Storage

### 📊 CẤU TRÚC SCHEMA MỚI

```
🏢 ENTERPRISE SYSTEM (24 Tables)
├── 👥 CORE (4 tables)
│   ├── users (User management)
│   ├── nhan_vien (HR extended info)
│   ├── phong_ban (Departments)
│   └── chuc_vu (Positions)
│
├── 💼 HR MODULE (4 tables)
│   ├── hop_dong (Contracts)
│   ├── cham_cong (Time tracking)
│   ├── bang_luong (Payroll)
│   └── nghi_phep (Leave requests)
│
├── 📋 PROJECT MODULE (7 tables)
│   ├── projects (Projects)
│   ├── project_members (Team members)
│   ├── sprints (Sprint planning)
│   ├── issue_types (Task types)
│   ├── issue_statuses (Workflow states)
│   ├── issues (Tasks/Issues)
│   └── comments (Task comments)
│
├── 💬 CHAT MODULE (4 tables)
│   ├── chat_rooms (Chat rooms)
│   ├── chat_room_members (Room participants)
│   ├── messages (Chat messages)
│   └── message_status (Read status)
│
├── 📁 STORAGE MODULE (3 tables)
│   ├── folders (File organization)
│   ├── files (File storage)
│   └── file_shares (File sharing)
│
└── 🔔 SYSTEM MODULE (2 tables)
    ├── notifications (User notifications)
    └── activity_logs (Audit trail)
```

## 🔗 RELATIONSHIPS CHÍNH

### 1. **User-Centric Design**
```
User (1) ──────── (1) NhanVien
  │
  ├── (N) Projects (created_by)
  ├── (N) ProjectMembers
  ├── (N) Issues (reporter, assignee)
  ├── (N) Messages (sender)
  ├── (N) ChatRoomMembers
  ├── (N) Files (owner)
  └── (N) Notifications
```

### 2. **Project Management Flow**
```
Project (1) ──────── (N) ProjectMembers
  │
  ├── (N) Sprints
  ├── (N) Issues
  ├── (N) ChatRooms (project-specific)
  └── (N) Folders (project files)
```

### 3. **HR Management Flow**
```
NhanVien (1) ──────── (1) User
  │
  ├── (N) HopDong
  ├── (N) ChamCong
  ├── (N) BangLuong
  ├── (N) NghiPhep
  └── (N) ProjectMembers
```

## 🎨 ENTITY DESIGN PRINCIPLES

### ✅ **Consistency Rules**
1. **Naming Convention**: snake_case cho DB, camelCase cho Java
2. **ID Strategy**: IDENTITY cho tất cả primary keys
3. **Timestamps**: created_at, updated_at cho audit
4. **Soft Delete**: is_deleted cho data retention
5. **Enums**: STRING type cho readability

### ✅ **Relationship Rules**
1. **Cascade**: ALL cho owned entities, NONE cho references
2. **Orphan Removal**: true cho dependent entities
3. **Lazy Loading**: default cho performance
4. **JsonIgnore**: tránh infinite loops

### ✅ **Performance Rules**
1. **Indexes**: trên foreign keys và search fields
2. **Constraints**: CHECK cho data integrity
3. **Unique**: composite unique cho business rules
4. **Nullable**: explicit nullable/not null

## 📝 ENTITY MAPPING

| Module | Entity | Table | Key Features |
|--------|--------|-------|--------------|
| **Core** | User | users | Authentication, roles |
| **Core** | NhanVien | nhan_vien | HR extended info |
| **Core** | PhongBan | phong_ban | Department hierarchy |
| **Core** | ChucVu | chuc_vu | Position levels |
| **HR** | HopDong | hop_dong | Contract management |
| **HR** | ChamCong | cham_cong | Time tracking |
| **HR** | BangLuong | bang_luong | Payroll calculation |
| **HR** | NghiPhep | nghi_phep | Leave management |
| **Project** | Project | projects | Project lifecycle |
| **Project** | ProjectMember | project_members | Team management |
| **Project** | Sprint | sprints | Sprint planning |
| **Project** | Issue | issues | Task management |
| **Project** | IssueType | issue_types | Task categorization |
| **Project** | IssueStatus | issue_statuses | Workflow states |
| **Project** | Comment | comments | Task discussions |
| **Chat** | ChatRoom | chat_rooms | Communication spaces |
| **Chat** | ChatRoomMember | chat_room_members | Room participants |
| **Chat** | Message | messages | Chat content |
| **Chat** | MessageStatus | message_status | Read receipts |
| **Storage** | Folder | folders | File organization |
| **Storage** | File | files | File storage |
| **Storage** | FileShare | file_shares | File sharing |
| **System** | Notification | notifications | User alerts |
| **System** | ActivityLog | activity_logs | Audit trail |

## 🚀 IMPLEMENTATION PLAN

### Phase 1: Core Entities ✅
- [x] User entity (authentication)
- [x] NhanVien entity (HR info)
- [x] PhongBan entity (departments)
- [x] ChucVu entity (positions)

### Phase 2: HR Entities ✅
- [x] HopDong entity (contracts)
- [x] ChamCong entity (time tracking)
- [x] BangLuong entity (payroll)
- [x] NghiPhep entity (leave requests)

### Phase 3: Project Entities ✅
- [x] Project entity (project management)
- [x] ProjectMember entity (team members)
- [x] Sprint entity (sprint planning)
- [x] Issue entity (task management)
- [x] IssueType entity (task types)
- [x] IssueStatus entity (workflow)
- [x] Comment entity (discussions)

### Phase 4: Chat Entities ✅
- [x] ChatRoom entity (chat spaces)
- [x] ChatRoomMember entity (participants)
- [x] Message entity (chat content)
- [x] MessageStatus entity (read status)

### Phase 5: Storage Entities ✅
- [x] Folder entity (file organization)
- [x] File entity (file storage)
- [x] FileShare entity (file sharing)

### Phase 6: System Entities ✅
- [x] Notification entity (user alerts)
- [x] ActivityLog entity (audit trail)

## 🔧 TECHNICAL SPECIFICATIONS

### Database Configuration
- **Engine**: SQL Server 2019+
- **Encoding**: UTF-8 (NVARCHAR)
- **Collation**: Vietnamese_CI_AS
- **Timezone**: UTC+7 (Vietnam)

### JPA Configuration
- **Provider**: Hibernate 6.x
- **Dialect**: SQLServer2019Dialect
- **Naming**: PhysicalNamingStrategy
- **Lazy Loading**: Default enabled

### Security Features
- **Password**: BCrypt hashing
- **Tokens**: JWT for authentication
- **CORS**: Configured for frontend
- **Validation**: Bean validation

## 📊 PERFORMANCE OPTIMIZATION

### Indexes Strategy
```sql
-- User lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Project queries
CREATE INDEX idx_projects_key ON projects(key_project);
CREATE INDEX idx_projects_status ON projects(status);

-- Issue tracking
CREATE INDEX idx_issues_assignee ON issues(assignee_id);
CREATE INDEX idx_issues_status ON issues(status_id);

-- Chat performance
CREATE INDEX idx_messages_room_sent ON messages(room_id, sent_at DESC);
```

### Query Optimization
- **Pagination**: Pageable cho large datasets
- **Projection**: DTOs cho specific fields
- **Caching**: @Cacheable cho lookup data
- **Batch**: Batch operations cho bulk updates

## 🎯 BUSINESS RULES

### User Management
- **Unique**: username, email, phone
- **Roles**: ADMIN, MANAGER, EMPLOYEE
- **Status**: Active/Inactive users
- **Audit**: Login tracking

### HR Management
- **Hierarchy**: Department → Position → Employee
- **Contracts**: Multiple contracts per employee
- **Time Tracking**: Daily check-in/out
- **Payroll**: Monthly calculation

### Project Management
- **Lifecycle**: Planning → Active → Completed
- **Team**: Owner, Manager, Member roles
- **Sprints**: Time-boxed iterations
- **Issues**: Task tracking with workflow

### Chat System
- **Types**: Direct, Group, Project chats
- **Members**: Admin/Member roles
- **Messages**: Text, File, Image types
- **Status**: Delivered/Seen tracking

### File Storage
- **Organization**: Hierarchical folders
- **Sharing**: User-to-user, project-based
- **Versioning**: File version control
- **Quotas**: Storage limits per user

## 🔄 MIGRATION STRATEGY

### From ChatApp
1. **Users**: Merge user tables
2. **Chat**: Preserve chat history
3. **Files**: Migrate file storage
4. **Messages**: Maintain message threads

### From QLNS
1. **HR Data**: Preserve employee records
2. **Contracts**: Maintain contract history
3. **Payroll**: Keep salary records
4. **Time Tracking**: Preserve attendance

### Data Integrity
- **Foreign Keys**: Maintain referential integrity
- **Constraints**: Business rule validation
- **Triggers**: Automated calculations
- **Backup**: Full data backup before migration

## 🎉 EXPECTED BENEFITS

### ✅ **Unified System**
- Single sign-on across modules
- Consistent user experience
- Centralized data management

### ✅ **Enhanced Features**
- Cross-module notifications
- Integrated file sharing
- Project-based chat rooms
- HR project assignments

### ✅ **Performance**
- Optimized database queries
- Reduced data duplication
- Efficient caching strategy
- Scalable architecture

### ✅ **Maintainability**
- Clean code structure
- Consistent naming conventions
- Comprehensive documentation
- Automated testing

---

**Version**: 3.0  
**Date**: 2025-01-27  
**Status**: ✅ Ready for Implementation  
**Total Entities**: 24  
**Database Tables**: 24  
**Integration**: ChatApp + QLNS + Project Management
