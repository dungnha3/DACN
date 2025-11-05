# Storage Module API Documentation

## Overview
Module quản lý file và folder với tính năng upload, download, phân quyền và quota management.

## Authentication
Tất cả endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## File Endpoints

### 1. Upload File
**POST** `/api/storage/files/upload`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (required): File to upload
- `folderId` (optional): ID của thư mục đích

**Response:** `201 Created`
```json
{
  "fileId": 1,
  "filename": "abc123-def456.pdf",
  "originalFilename": "document.pdf",
  "fileSize": 1048576,
  "fileSizeFormatted": "1.00 MB",
  "mimeType": "application/pdf",
  "downloadUrl": "/api/storage/files/1/download",
  "message": "Upload file thành công"
}
```

**Lưu ý:**
- File size tối đa: 10MB (cấu hình trong `application.properties`)
- Kiểm tra quota trước khi upload
- File name được tự động generate UUID để tránh conflict

---

### 2. Get File Info
**GET** `/api/storage/files/{fileId}`

**Response:** `200 OK`
```json
{
  "fileId": 1,
  "filename": "abc123-def456.pdf",
  "originalFilename": "document.pdf",
  "filePath": "/uploads/abc123-def456.pdf",
  "fileSize": 1048576,
  "fileSizeFormatted": "1.00 MB",
  "mimeType": "application/pdf",
  "fileExtension": "pdf",
  "folderId": 5,
  "folderName": "Documents",
  "ownerId": 2,
  "ownerName": "john_doe",
  "version": 1,
  "isLatestVersion": true,
  "createdAt": "2025-10-25T10:30:00",
  "updatedAt": "2025-10-25T10:30:00",
  "isImage": false,
  "isDocument": true,
  "isVideo": false
}
```

---

### 3. Download File
**GET** `/api/storage/files/{fileId}/download`

**Response:** `200 OK`
- Content-Type: Theo mime type của file
- Content-Disposition: `attachment; filename="original_filename.ext"`
- Body: File binary data

**Ví dụ với cURL:**
```bash
curl -X GET http://localhost:8080/api/storage/files/1/download \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o downloaded_file.pdf
```

---

### 4. Get My Files
**GET** `/api/storage/files/my-files`

**Response:** `200 OK`
```json
[
  {
    "fileId": 1,
    "filename": "abc123.pdf",
    "originalFilename": "document.pdf",
    ...
  },
  {
    "fileId": 2,
    "filename": "def456.jpg",
    "originalFilename": "photo.jpg",
    ...
  }
]
```

---

### 5. Get Folder Files
**GET** `/api/storage/folders/{folderId}/files`

**Response:** `200 OK` - Danh sách files trong folder

---

### 6. Delete File
**DELETE** `/api/storage/files/{fileId}?permanent=false`

**Query Parameters:**
- `permanent` (optional, default: false): 
  - `false`: Soft delete (đánh dấu isDeleted=true)
  - `true`: Xóa vĩnh viễn file vật lý và database

**Response:** `200 OK`
```json
{
  "message": "Xóa file thành công"
}
```

---

### 7. Get Storage Stats
**GET** `/api/storage/stats`

**Response:** `200 OK`
```json
{
  "totalFiles": 25,
  "totalFolders": 8,
  "totalSize": 52428800,
  "totalSizeFormatted": "50.00 MB",
  "quotaLimit": 5368709120,
  "quotaLimitFormatted": "5.00 GB",
  "remainingQuota": 5316280320,
  "remainingQuotaFormatted": "4.95 GB",
  "usagePercentage": 0.98
}
```

**Quota Limits:**
- USER/EMPLOYEE: 5 GB
- ADMIN: 10 GB

---

## Folder Endpoints

### 8. Create Folder
**POST** `/api/storage/folders`

**Request Body:**
```json
{
  "name": "My Documents",
  "parentFolderId": null,
  "folderType": "PERSONAL",
  "projectId": null
}
```

**Folder Types:**
- `PERSONAL`: Thư mục cá nhân
- `SHARED`: Thư mục chia sẻ
- `PROJECT`: Thư mục dự án (yêu cầu projectId)

**Response:** `201 Created`
```json
{
  "folderId": 1,
  "name": "My Documents",
  "fullPath": "My Documents",
  "parentFolderId": null,
  "parentFolderName": null,
  "ownerId": 2,
  "ownerName": "john_doe",
  "folderType": "PERSONAL",
  "projectId": null,
  "projectName": null,
  "createdAt": "2025-10-25T10:30:00",
  "fileCount": 0,
  "subFolderCount": 0
}
```

---

### 9. Get Folder Info
**GET** `/api/storage/folders/{folderId}`

**Response:** `200 OK` - Folder details

---

### 10. Get My Folders
**GET** `/api/storage/folders/my-folders`

**Response:** `200 OK`
```json
[
  {
    "folderId": 1,
    "name": "Documents",
    "fullPath": "Documents",
    ...
  },
  {
    "folderId": 2,
    "name": "Photos",
    "fullPath": "Photos",
    ...
  }
]
```

---

### 11. Get Sub Folders
**GET** `/api/storage/folders/{folderId}/subfolders`

**Response:** `200 OK` - Danh sách thư mục con

---

### 12. Get Project Folders
**GET** `/api/storage/folders/project/{projectId}`

**Response:** `200 OK` - Danh sách folders của dự án

---

### 13. Update Folder
**PUT** `/api/storage/folders/{folderId}?name=New Name`

**Query Parameters:**
- `name` (required): Tên mới của folder

**Response:** `200 OK` - Folder đã cập nhật

---

### 14. Delete Folder
**DELETE** `/api/storage/folders/{folderId}`

**Lưu ý:**
- Không thể xóa folder có chứa files
- Không thể xóa folder có chứa subfolders
- Phải xóa hết nội dung trước khi xóa folder

**Response:** `200 OK`
```json
{
  "message": "Xóa thư mục thành công"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "File không được để trống",
  "status": 400
}
```

### 403 Forbidden
```json
{
  "message": "Bạn không có quyền upload vào thư mục này",
  "status": 403
}
```

### 404 Not Found
```json
{
  "message": "Không tìm thấy file",
  "status": 404
}
```

### 413 Payload Too Large
```json
{
  "message": "Vượt quá dung lượng cho phép. Đã dùng: 4.50 GB, Giới hạn: 5.00 GB",
  "status": 413
}
```

### 500 Internal Server Error
```json
{
  "message": "Không thể lưu file: document.pdf",
  "status": 500
}
```

---

## Business Rules

### File Management
1. File name được tự động generate bằng UUID
2. Original filename được lưu trong database
3. Kiểm tra quota trước khi upload
4. Hỗ trợ soft delete và permanent delete
5. File version tracking (tính năng mở rộng)

### Folder Management
1. Hỗ trợ nested folders (parent-child relationship)
2. Full path được tự động generate
3. Không thể xóa folder có nội dung
4. Folder types: PERSONAL, SHARED, PROJECT

### Storage Quota
1. USER/EMPLOYEE: 5 GB
2. ADMIN: 10 GB
3. Kiểm tra quota real-time khi upload
4. Tính tổng dung lượng từ tất cả files của user

### Security
1. User chỉ có thể upload/download/xóa files của mình
2. User chỉ có thể tạo/xóa folders của mình
3. Project folders yêu cầu quyền truy cập project
4. Tất cả operations đều log IP và User-Agent

---

## File Types Detection

### Images
- MIME types: `image/*`
- Extensions: jpg, jpeg, png, gif, bmp, webp, svg

### Documents
- MIME types: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.*`
- Extensions: pdf, doc, docx, xls, xlsx, ppt, pptx

### Videos
- MIME types: `video/*`
- Extensions: mp4, avi, mov, wmv, flv

---

## Usage Examples

### Upload File with Postman
1. Method: POST
2. URL: `http://localhost:8080/api/storage/files/upload`
3. Headers:
   - Authorization: Bearer YOUR_TOKEN
4. Body: form-data
   - Key: `file`, Type: File, Value: [Select file]
   - Key: `folderId`, Type: Text, Value: `1` (optional)

### Upload File with cURL
```bash
curl -X POST http://localhost:8080/api/storage/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "folderId=1"
```

### Download File with cURL
```bash
curl -X GET http://localhost:8080/api/storage/files/1/download \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o downloaded_file.pdf
```

### Create Folder
```bash
curl -X POST http://localhost:8080/api/storage/folders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Documents",
    "folderType": "PERSONAL"
  }'
```

### Get Storage Stats
```bash
curl -X GET http://localhost:8080/api/storage/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Configuration

### application.properties
```properties
# File Upload
file.upload-dir=./uploads
file.max-size-mb=10
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Storage Quota
app.storage.user-quota-gb=5
app.storage.admin-quota-gb=10
```

---

## Database Schema

### files table
- `file_id` (PK)
- `filename` (unique UUID)
- `original_filename`
- `file_path`
- `file_size`
- `mime_type`
- `folder_id` (FK)
- `owner_id` (FK)
- `version`
- `parent_file_id` (FK, for versioning)
- `upload_ip`
- `upload_user_agent`
- `created_at`
- `updated_at`
- `is_deleted`

### folders table
- `folder_id` (PK)
- `name`
- `parent_folder_id` (FK, self-reference)
- `owner_id` (FK)
- `folder_type` (PERSONAL/SHARED/PROJECT)
- `project_id` (FK, optional)
- `created_at`

---

## Future Enhancements
- [ ] File sharing với users khác
- [ ] File versioning (upload new version)
- [ ] Folder permissions (read/write/admin)
- [ ] File preview (images, PDFs)
- [ ] Bulk upload/download
- [ ] Search files by name/type/date
- [ ] Trash bin (restore deleted files)
- [ ] File compression
- [ ] Virus scanning
- [ ] Cloud storage integration (S3, Azure Blob)

---

## Testing Checklist

### File Operations
- [ ] Upload file thành công
- [ ] Upload file vượt quota → 413
- [ ] Upload file > 10MB → 400
- [ ] Download file của mình → 200
- [ ] Download file của người khác → 403
- [ ] Delete file (soft) → 200
- [ ] Delete file (permanent) → 200
- [ ] Get file info → 200

### Folder Operations
- [ ] Create folder → 201
- [ ] Create nested folder → 201
- [ ] Get my folders → 200
- [ ] Get subfolders → 200
- [ ] Update folder name → 200
- [ ] Delete empty folder → 200
- [ ] Delete folder có files → 400

### Storage Stats
- [ ] Get stats → 200
- [ ] Quota calculation đúng
- [ ] Usage percentage đúng

---

## Notes
- Tất cả file uploads được lưu trong thư mục `./uploads`
- File names được hash để tránh conflict
- Original filenames được preserve trong database
- Soft delete cho phép restore sau này
- IP và User-Agent được log cho audit trail
