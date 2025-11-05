# Project Module API Documentation

## Authentication
Tất cả endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Project Endpoints

### 1. Tạo dự án mới
**POST** `/api/projects`

**Request Body:**
```json
{
  "name": "Dự án Website",
  "keyProject": "WEB-001",
  "description": "Xây dựng website công ty",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "phongbanId": 1
}
```

**Response:** `201 Created`
```json
{
  "projectId": 1,
  "name": "Dự án Website",
  "keyProject": "WEB-001",
  "description": "Xây dựng website công ty",
  "status": "ACTIVE",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "phongbanId": 1,
  "phongbanName": "Phòng IT",
  "createdBy": 5,
  "createdByName": "admin"
}
```

---

### 2. Lấy thông tin dự án
**GET** `/api/projects/{projectId}`

**Response:** `200 OK`
```json
{
  "projectId": 1,
  "name": "Dự án Website",
  "keyProject": "WEB-001",
  "description": "Xây dựng website công ty",
  "status": "ACTIVE",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "phongbanId": 1,
  "phongbanName": "Phòng IT",
  "createdBy": 5,
  "createdByName": "admin"
}
```

---

### 3. Lấy tất cả dự án
**GET** `/api/projects`

**Response:** `200 OK`
```json
[
  {
    "projectId": 1,
    "name": "Dự án Website",
    "keyProject": "WEB-001",
    ...
  },
  {
    "projectId": 2,
    "name": "Dự án Mobile App",
    "keyProject": "MOB-001",
    ...
  }
]
```

---

### 4. Lấy dự án của tôi
**GET** `/api/projects/my-projects`

**Response:** `200 OK` - Danh sách các dự án mà user là thành viên

---

### 5. Cập nhật dự án
**PUT** `/api/projects/{projectId}`

**Yêu cầu:** User phải là OWNER hoặc MANAGER

**Request Body:**
```json
{
  "name": "Dự án Website (Updated)",
  "description": "Mô tả mới",
  "status": "ON_HOLD",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "phongbanId": 2
}
```

**Response:** `200 OK` - Project đã cập nhật

---

### 6. Xóa dự án
**DELETE** `/api/projects/{projectId}`

**Yêu cầu:** User phải là OWNER

**Response:** `204 No Content`

---

## Project Member Endpoints

### 7. Thêm thành viên
**POST** `/api/projects/{projectId}/members`

**Yêu cầu:** User phải là OWNER hoặc MANAGER

**Request Body:**
```json
{
  "userId": 10,
  "role": "MEMBER"
}
```

**Roles:** `OWNER`, `MANAGER`, `MEMBER`

**Response:** `201 Created`
```json
{
  "id": 5,
  "userId": 10,
  "username": "john_doe",
  "email": "john@example.com",
  "avatarUrl": "https://...",
  "role": "MEMBER",
  "joinedAt": "2024-01-15T10:30:00"
}
```

---

### 8. Lấy danh sách thành viên
**GET** `/api/projects/{projectId}/members`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "userId": 5,
    "username": "admin",
    "email": "admin@example.com",
    "avatarUrl": null,
    "role": "OWNER",
    "joinedAt": "2024-01-01T08:00:00"
  },
  {
    "id": 2,
    "userId": 10,
    "username": "john_doe",
    "email": "john@example.com",
    "avatarUrl": null,
    "role": "MEMBER",
    "joinedAt": "2024-01-15T10:30:00"
  }
]
```

---

### 9. Xóa thành viên
**DELETE** `/api/projects/{projectId}/members/{memberId}`

**Yêu cầu:** User phải là OWNER hoặc MANAGER

**Lưu ý:** Không thể xóa OWNER

**Response:** `204 No Content`

---

### 10. Cập nhật vai trò thành viên
**PATCH** `/api/projects/{projectId}/members/{memberId}/role?role=MANAGER`

**Yêu cầu:** User phải là OWNER hoặc MANAGER

**Query Parameters:**
- `role`: OWNER | MANAGER | MEMBER

**Lưu ý:** Không thể thay đổi role của OWNER

**Response:** `200 OK` - Member với role mới

---

## Issue Endpoints

### 11. Tạo issue mới
**POST** `/api/issues`

**Request Body:**
```json
{
  "projectId": 1,
  "title": "Thiết kế giao diện homepage",
  "description": "Tạo mockup cho trang chủ mới",
  "statusId": 1,
  "priority": "HIGH",
  "assigneeId": 10,
  "estimatedHours": 8.5,
  "dueDate": "2024-01-20"
}
```

**Priority:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`

**Response:** `201 Created`
```json
{
  "issueId": 1,
  "projectId": 1,
  "projectName": "Dự án Website",
  "issueKey": "WEB-001-1",
  "title": "Thiết kế giao diện homepage",
  "description": "Tạo mockup cho trang chủ mới",
  "statusId": 1,
  "statusName": "To Do",
  "statusColor": "#4BADE8",
  "priority": "HIGH",
  "reporterId": 5,
  "reporterName": "admin",
  "assigneeId": 10,
  "assigneeName": "john_doe",
  "estimatedHours": 8.5,
  "actualHours": null,
  "dueDate": "2024-01-20",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00",
  "isOverdue": false
}
```

---

### 12. Lấy thông tin issue
**GET** `/api/issues/{issueId}`

**Response:** `200 OK` - Issue details

---

### 13. Lấy issues của dự án
**GET** `/api/issues/project/{projectId}`

**Response:** `200 OK` - Danh sách issues của dự án

---

### 14. Lấy issues được giao cho tôi
**GET** `/api/issues/my-issues`

**Response:** `200 OK` - Danh sách issues mà user là assignee

---

### 15. Lấy issues tôi đã tạo
**GET** `/api/issues/my-reported`

**Response:** `200 OK` - Danh sách issues mà user là reporter

---

### 16. Cập nhật issue
**PUT** `/api/issues/{issueId}`

**Request Body:**
```json
{
  "title": "Thiết kế giao diện homepage (Updated)",
  "description": "Mô tả mới",
  "statusId": 2,
  "priority": "MEDIUM",
  "assigneeId": 15,
  "estimatedHours": 10.0,
  "actualHours": 8.0,
  "dueDate": "2024-01-25"
}
```

**Response:** `200 OK` - Issue đã cập nhật

---

### 17. Xóa issue
**DELETE** `/api/issues/{issueId}`

**Yêu cầu:** User phải là OWNER/MANAGER hoặc là reporter của issue

**Response:** `204 No Content`

---

### 18. Gán issue cho thành viên
**PATCH** `/api/issues/{issueId}/assign/{assigneeId}`

**Yêu cầu:** User phải là OWNER hoặc MANAGER

**Response:** `200 OK` - Issue với assignee mới

---

### 19. Thay đổi trạng thái issue
**PATCH** `/api/issues/{issueId}/status/{statusId}`

**Response:** `200 OK` - Issue với status mới

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Ngày kết thúc phải sau ngày bắt đầu",
  "status": 400
}
```

### 401 Unauthorized
```json
{
  "message": "Token không hợp lệ",
  "status": 401
}
```

### 403 Forbidden
```json
{
  "message": "Bạn không có quyền quản lý dự án này",
  "status": 403
}
```

### 404 Not Found
```json
{
  "message": "Không tìm thấy dự án",
  "status": 404
}
```

### 409 Conflict
```json
{
  "message": "Mã dự án đã tồn tại: WEB-001",
  "status": 409
}
```

### 422 Validation Error
```json
{
  "name": "Tên dự án không được để trống",
  "keyProject": "Mã dự án không được quá 10 ký tự"
}
```

---

## Business Rules

### Project
1. Mã dự án (keyProject) phải unique
2. EndDate phải sau StartDate
3. Creator tự động trở thành OWNER
4. Chỉ OWNER mới có thể xóa dự án
5. OWNER và MANAGER có thể quản lý members
6. Không thể xóa OWNER khỏi dự án
7. Không thể thay đổi role của OWNER

### Issue
1. Issue key tự động generate: {PROJECT_KEY}-{NUMBER}
2. Assignee phải là member của project
3. Reporter là người tạo issue
4. Chỉ OWNER/MANAGER hoặc reporter mới có thể xóa issue
5. Issue được đánh dấu overdue nếu quá dueDate và chưa Done
6. Chỉ project members mới có thể xem/tạo issues

### Authorization Matrix

| Action | OWNER | MANAGER | MEMBER |
|--------|-------|---------|--------|
| View project | ✓ | ✓ | ✓ |
| Update project | ✓ | ✓ | ✗ |
| Delete project | ✓ | ✗ | ✗ |
| Add member | ✓ | ✓ | ✗ |
| Remove member | ✓ | ✓ | ✗ |
| Update member role | ✓ | ✓ | ✗ |
| Create issue | ✓ | ✓ | ✓ |
| View issue | ✓ | ✓ | ✓ |
| Update issue | ✓ | ✓ | ✓ |
| Delete issue | ✓ | ✓ | Own only |
| Assign issue | ✓ | ✓ | ✗ |
| Change status | ✓ | ✓ | ✓ |

---

## Testing with cURL

### Tạo dự án
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "keyProject": "TEST-001",
    "description": "Test description",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'
```

### Lấy dự án của tôi
```bash
curl -X GET http://localhost:8080/api/projects/my-projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Tạo issue
```bash
curl -X POST http://localhost:8080/api/issues \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 1,
    "title": "Test Issue",
    "description": "Test description",
    "statusId": 1,
    "priority": "MEDIUM"
  }'
```
