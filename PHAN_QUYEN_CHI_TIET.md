# 📋 PHÂN QUYỀN CHI TIẾT SAU KHI THAY ĐỔI

**Ngày cập nhật:** 2025-11-19  
**Trạng thái:** Final - Đã bảo mật đầy đủ

---

## 🔐 NGUYÊN TẮC BẢO MẬT

### **Dữ liệu nhạy cảm:**
- `luongCoBan` (Lương cơ bản)
- `phuCap` (Phụ cấp)
- `BangLuong` (Tất cả thông tin bảng lương)

### **Quy tắc:**
1. **CHỈ Accounting Manager** có quyền FULL với dữ liệu lương
2. **Employee** chỉ xem được lương của chính mình
3. **HR Manager** quản lý HR lifecycle NHƯNG KHÔNG xem được lương
4. **Project Manager** quản lý dự án NHƯNG KHÔNG xem được lương
5. **Admin** quản lý hệ thống NHƯNG KHÔNG truy cập business data

---

## 👤 1. ADMIN

### ✅ Có quyền:
- **Quản lý User:**
  - Tạo user mới (tất cả roles)
  - Xem danh sách user
  - Xem chi tiết user
  - Reset password user (trừ Manager)
  - Deactivate user (trừ Manager)
  
- **Audit Log:**
  - Xem tất cả audit logs
  - Theo dõi hành động của users

- **System Management:**
  - Cấu hình hệ thống
  - Quản lý roles và permissions
  - Backup/restore

### ❌ Không có quyền:
- ❌ **Sửa/xóa tài khoản Manager** (HR, Accounting, Project)
- ❌ **Xem/quản lý dữ liệu lương** (BangLuong, luongCoBan, phuCap)
- ❌ **Xem dashboard HR/Accounting** → `ForbiddenException`
- ❌ **Truy cập Chat/Storage** (business data)
- ❌ **CRUD nhân viên, hợp đồng**

### 🔒 Bảo mật đặc biệt:
- Mọi hành động trên Manager account đều bị **audit log**
- Không thể bypass vào business modules

---

## 👔 2. HR MANAGER

### ✅ Có quyền:

#### **Quản lý Nhân viên:**
- ✅ Tạo nhân viên mới (SET lương OK)
- ✅ Sửa thông tin nhân viên (SET lương OK)
- ✅ Xem danh sách nhân viên
- ✅ Xem chi tiết nhân viên **NHƯNG:**
  - `luongCoBan` → `null`
  - `phuCap` → `null`
- ✅ Tìm kiếm/lọc nhân viên
- ✅ Cập nhật trạng thái nhân viên

#### **Quản lý Phòng ban & Chức vụ:**
- ✅ CRUD phòng ban
- ✅ CRUD chức vụ

#### **Quản lý Hợp đồng:**
- ✅ Tạo hợp đồng (SET lương OK)
- ✅ Sửa hợp đồng (SET lương OK)
- ✅ Xem danh sách hợp đồng **NHƯNG:**
  - `luongCoBan` → `null`
- ✅ Gia hạn hợp đồng
- ✅ Hủy hợp đồng

#### **Quản lý Đánh giá:**
- ✅ CRUD đánh giá nhân viên
- ✅ Xem tất cả đánh giá

#### **Dashboard:**
- ✅ Xem dashboard tổng quan **NHƯNG:**
  - `tongNhanVien` → Có
  - `bangLuongChuaThanhToan` → Có (số lượng)
  - `tongLuongThangNay` → `0` (masked)
- ✅ Xem biểu đồ chấm công
- ✅ Xem thống kê nhân viên

### ❌ Không có quyền:

#### **Dữ liệu lương:**
- ❌ Xem `luongCoBan` nhân viên → `null`
- ❌ Xem `phuCap` → `null`
- ❌ Xem `BangLuong` → `ForbiddenException`
- ❌ CRUD bảng lương → `ForbiddenException`
- ❌ Tính lương tự động → `ForbiddenException`
- ❌ Xem tổng lương công ty → `0`
- ❌ Xem biểu đồ lương 6 tháng → `0`

#### **Chấm công:**
- ❌ Quản lý chấm công (thuộc Accounting)
- ✅ CHỈ xem thống kê chấm công

#### **Nghỉ phép:**
- ❌ Duyệt nghỉ phép (thuộc PM/Accounting)
- ✅ Xem danh sách nghỉ phép

### 📊 Ví dụ Response khi HR xem nhân viên:
```json
{
  "nhanvienId": 1,
  "hoTen": "Nguyễn Văn A",
  "cccd": "001234567890",
  "phongBan": "IT",
  "chucVu": "Developer",
  "luongCoBan": null,  // ← MASKED
  "phuCap": null       // ← MASKED
}
```

---

## 💰 3. ACCOUNTING MANAGER

### ✅ Có quyền FULL:

#### **Bảng lương:**
- ✅ **Tạo** bảng lương
- ✅ **Xem** tất cả bảng lương
- ✅ **Sửa** bảng lương
- ✅ **Xóa** bảng lương
- ✅ **Tính lương tự động** cho 1 hoặc tất cả nhân viên
- ✅ Đánh dấu đã thanh toán
- ✅ Hủy bảng lương
- ✅ Xem theo tháng/năm/trạng thái
- ✅ Xem tổng lương theo kỳ
- ✅ Xem tổng lương theo nhân viên/năm

#### **Chấm công:**
- ✅ **CRUD** chấm công
- ✅ Quản lý chấm công cho tất cả nhân viên
- ✅ Xem thống kê chấm công
- ✅ Tính công tự động

#### **Nghỉ phép:**
- ✅ **Duyệt/từ chối** nghỉ phép (Step 2)
  - Kiểm tra phép tồn
  - Kiểm tra ảnh hưởng lương
- ✅ Xem tất cả đơn nghỉ phép

#### **Dashboard:**
- ✅ Xem dashboard với **ĐẦY ĐỦ số tiền lương**
- ✅ `tongLuongThangNay` → Số tiền thực
- ✅ Biểu đồ lương 6 tháng → Số tiền thực
- ✅ Tổng chi phí lương công ty

#### **Nhân viên & Hợp đồng:**
- ✅ Xem **ĐẦY ĐỦ** thông tin nhân viên bao gồm lương
- ✅ Xem **ĐẦY ĐỦ** thông tin hợp đồng bao gồm lương

### ❌ Không có quyền:
- ❌ CRUD nhân viên (thuộc HR)
- ❌ CRUD hợp đồng (thuộc HR)
- ❌ CRUD đánh giá (thuộc HR)

### 📊 Ví dụ Response khi Accounting xem nhân viên:
```json
{
  "nhanvienId": 1,
  "hoTen": "Nguyễn Văn A",
  "cccd": "001234567890",
  "phongBan": "IT",
  "chucVu": "Developer",
  "luongCoBan": 15000000,  // ← HIỂN THỊ ĐẦY ĐỦ
  "phuCap": 2000000        // ← HIỂN THỊ ĐẦY ĐỦ
}
```

---

## 📊 4. PROJECT MANAGER

### ✅ Có quyền:

#### **Quản lý Dự án:**
- ✅ **Tạo** dự án mới
- ✅ **Sửa** dự án của mình
- ✅ **Xóa** dự án của mình
- ✅ Quản lý members trong dự án
- ✅ Phân quyền members (OWNER/MANAGER/MEMBER)

#### **Issues & Sprints:**
- ✅ CRUD issues
- ✅ CRUD sprints
- ✅ Assign issues
- ✅ Xem báo cáo tiến độ

#### **Nghỉ phép:**
- ✅ **Duyệt/từ chối** nghỉ phép (Step 1)
  - Kiểm tra ảnh hưởng tiến độ dự án
  - Chuyển sang Accounting duyệt Step 2

#### **Đề xuất tăng lương:**
- ✅ Đề xuất tăng lương cho nhân viên
- ✅ **KHÔNG** thấy lương hiện tại (`currentSalary = null`)
- ✅ Chỉ đề xuất số tiền mới

#### **File Storage:**
- ✅ Upload/download files trong dự án
- ✅ Chia sẻ files với members

#### **Chat:**
- ✅ Chat với team members
- ✅ Tạo chat rooms cho dự án

### ❌ Không có quyền:
- ❌ Xem lương nhân viên → `null`
- ❌ Xem/quản lý bảng lương → `ForbiddenException`
- ❌ Quản lý dự án của PM khác
- ❌ CRUD nhân viên/hợp đồng

### 📊 Ví dụ Response khi PM đề xuất tăng lương:
```json
{
  "message": "Đề xuất tăng lương đã được gửi thành công",
  "employeeName": "Nguyễn Văn A",
  // "currentSalary": KHÔNG CÓ FIELD NÀY
  "proposedSalary": "20000000"
}
```

---

## 👨‍💻 5. EMPLOYEE

### ✅ Có quyền:

#### **Thông tin cá nhân:**
- ✅ Xem thông tin cá nhân
- ✅ Sửa profile (avatar, thông tin liên hệ)
- ✅ Đổi mật khẩu

#### **Lương:**
- ✅ Xem bảng lương của **CHÍNH MÌNH**
- ✅ Xem lịch sử lương của mình
- ✅ Xem tổng thu nhập năm của mình
- ✅ Nhận notification về lương

#### **Nghỉ phép:**
- ✅ Tạo đơn nghỉ phép
- ✅ Xem đơn nghỉ phép của mình
- ✅ Hủy đơn nghỉ phép (nếu chưa duyệt)

#### **Chấm công:**
- ✅ Chấm công cho chính mình
- ✅ Xem lịch sử chấm công của mình

#### **Dự án:**
- ✅ Xem dự án được assign
- ✅ Cập nhật issues của mình
- ✅ Comment trên issues

#### **File Storage:**
- ✅ Upload files cá nhân
- ✅ Download files của mình
- ✅ Xem files được chia sẻ trong dự án

#### **Chat:**
- ✅ Chat với team members
- ✅ Tham gia chat rooms của dự án

### ❌ Không có quyền:
- ❌ Xem lương của người khác → `ForbiddenException`
- ❌ Xem danh sách tất cả nhân viên
- ❌ Duyệt nghỉ phép
- ❌ Quản lý chấm công người khác

### 📊 Ví dụ Response khi Employee xem lương:
```json
// GET /api/bang-luong/nhan-vien/1/period?thang=11&nam=2025
// ✅ Nếu nhanvienId = userId của mình
{
  "bangluongId": 123,
  "nhanVienId": 1,
  "thang": 11,
  "nam": 2025,
  "luongCoBan": 15000000,    // ← HIỂN THỊ
  "phuCap": 2000000,         // ← HIỂN THỊ
  "luongThucNhan": 16500000  // ← HIỂN THỊ
}

// ❌ Nếu nhanvienId khác userId
// HTTP 403 Forbidden
{
  "error": "Bạn chỉ có thể xem bảng lương của chính mình"
}
```

---

## 📊 SO SÁNH PHÂN QUYỀN

### Bảng so sánh chi tiết:

| Chức năng | Admin | HR | Accounting | PM | Employee |
|-----------|-------|-----|-----------|-----|----------|
| **NHÂN VIÊN** |
| Tạo nhân viên | ❌ | ✅ | ❌ | ❌ | ❌ |
| Xem thông tin NV | ❌ | ✅ (lương=null) | ✅ (full) | ✅ (lương=null) | ✅ (chính mình) |
| Sửa nhân viên | ❌ | ✅ | ❌ | ❌ | ❌ |
| Xóa nhân viên | ❌ | ✅ | ❌ | ❌ | ❌ |
| **HỢP ĐỒNG** |
| Tạo hợp đồng | ❌ | ✅ | ❌ | ❌ | ❌ |
| Xem hợp đồng | ❌ | ✅ (lương=null) | ✅ (full) | ❌ | ✅ (của mình) |
| Sửa hợp đồng | ❌ | ✅ | ❌ | ❌ | ❌ |
| **BẢNG LƯƠNG** |
| Tạo bảng lương | ❌ | ❌ | ✅ | ❌ | ❌ |
| Xem bảng lương | ❌ | ❌ | ✅ (all) | ❌ | ✅ (mình) |
| Sửa bảng lương | ❌ | ❌ | ✅ | ❌ | ❌ |
| Xóa bảng lương | ❌ | ❌ | ✅ | ❌ | ❌ |
| Tính lương tự động | ❌ | ❌ | ✅ | ❌ | ❌ |
| **CHẤM CÔNG** |
| Quản lý chấm công | ❌ | ❌ | ✅ | ❌ | ❌ |
| Chấm công cá nhân | ❌ | ❌ | ✅ | ❌ | ✅ |
| Xem chấm công | ❌ | ✅ (stats) | ✅ (all) | ❌ | ✅ (mình) |
| **NGHỈ PHÉP** |
| Tạo đơn nghỉ phép | ❌ | ❌ | ❌ | ❌ | ✅ |
| Duyệt Step 1 (PM) | ❌ | ❌ | ❌ | ✅ | ❌ |
| Duyệt Step 2 (Acc) | ❌ | ❌ | ✅ | ❌ | ❌ |
| Xem đơn nghỉ phép | ❌ | ✅ | ✅ | ✅ | ✅ (mình) |
| **DASHBOARD** |
| Xem dashboard | ❌ | ✅ (lương=0) | ✅ (full) | ✅ | ❌ |
| Xem tổng lương | ❌ | ❌ (=0) | ✅ | ❌ | ❌ |
| Biểu đồ lương | ❌ | ❌ (=0) | ✅ | ❌ | ❌ |
| **DỰ ÁN** |
| Quản lý dự án | ❌ | ❌ | ❌ | ✅ (của mình) | Xem only |
| CRUD Issues | ❌ | ❌ | ❌ | ✅ | ✅ (assigned) |
| **FILE STORAGE** |
| Upload/Download | ❌ | ❌ | ❌ | ✅ | ✅ |
| **CHAT** |
| Chat team | ❌ | ✅ | ✅ | ✅ | ✅ |
| **USER MANAGEMENT** |
| Tạo user | ✅ | ❌ | ❌ | ❌ | ❌ |
| Sửa Manager | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reset password | ✅ (trừ Mgr) | ❌ | ❌ | ❌ | ✅ (mình) |
| **AUDIT LOG** |
| Xem audit logs | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🔄 QUY TRÌNH 2-STEP APPROVAL (Nghỉ phép)

### Quy trình mới:
```
Employee tạo đơn
    ↓
[CHO_DUYET] → PM duyệt Step 1 (Kiểm tra tiến độ)
    ↓
[PM_APPROVED] → Accounting duyệt Step 2 (Kiểm tra phép tồn)
    ↓
[DA_DUYET] → Hoàn tất
```

### Chi tiết phân quyền:
1. **Employee:** Tạo đơn nghỉ phép
2. **Project Manager:** 
   - Duyệt/từ chối dựa trên tiến độ dự án
   - Chuyển sang Accounting nếu approve
3. **Accounting Manager:**
   - Duyệt/từ chối dựa trên phép tồn và ảnh hưởng lương
   - Quyết định cuối cùng

---

## 🛡️ CƠ CHẾ BẢO MẬT

### 1. **Salary Masking (Mapper Level)**
```java
// NhanVienMapper.java
if (currentUser.isManagerAccounting() || isOwner(nhanVien, currentUser)) {
    dto.setLuongCoBan(nhanVien.getLuongCoBan());
    dto.setPhuCap(nhanVien.getPhuCap());
} else {
    dto.setLuongCoBan(null);  // HR/PM/Admin thấy null
    dto.setPhuCap(null);
}
```

### 2. **Permission Checks (Service Level)**
```java
// BangLuongService.java
public BangLuong getBangLuongById(Long id, User currentUser) {
    if (currentUser.isAdmin()) {
        throw new ForbiddenException("Admin không có quyền");
    }
    if (currentUser.isManagerHR()) {
        throw new ForbiddenException("HR không có quyền");
    }
    // Only Accounting or owner
}
```

### 3. **Audit Logging**
```java
// UserService.java
if (user.isAnyManager()) {
    auditLogService.logAction(
        currentUser,
        "UPDATE_MANAGER",
        "USER",
        userId,
        oldValue,
        newValue,
        AuditLog.Severity.HIGH,
        ipAddress,
        userAgent
    );
    throw new ForbiddenException("Admin không được sửa Manager");
}
```

### 4. **URL Security (SecurityConfig)**
```java
.requestMatchers("/bang-luong/**").hasRole("MANAGER_ACCOUNTING")
.requestMatchers("/cham-cong/manage/**").hasRole("MANAGER_ACCOUNTING")
.requestMatchers("/nghi-phep/approve/pm/**").hasRole("MANAGER_PROJECT")
.requestMatchers("/nghi-phep/approve/accounting/**").hasRole("MANAGER_ACCOUNTING")
```

---

## 📝 NOTES QUAN TRỌNG

### ⚠️ Lưu ý khi phát triển thêm:

1. **Khi thêm API mới liên quan lương:**
   - PHẢI check permission ở Service level
   - PHẢI mask dữ liệu ở Mapper level
   - PHẢI pass `currentUser` từ Controller

2. **Khi implement ExportService:**
   ```java
   public byte[] exportBangLuongToExcel(int thang, int nam, User currentUser) {
       PermissionUtil.checkAccountingViewPermission(currentUser);
       // ... implement
   }
   ```

3. **Khi tạo DTO mới có chứa lương:**
   - Tạo Mapper với salary masking logic
   - Test với tất cả roles

4. **Audit logging bắt buộc cho:**
   - Mọi thao tác của Admin trên Manager accounts
   - Mọi thao tác CRUD trên BangLuong
   - File downloads (track ai download gì)

---

## ✅ CHECKLIST BẢO MẬT

- [x] Admin không sửa/xóa được Manager
- [x] HR không xem được lương
- [x] PM không xem được lương  
- [x] Admin không truy cập được business data
- [x] Employee chỉ xem được data của mình
- [x] Accounting full quyền với lương
- [x] Dashboard mask số tiền cho HR
- [x] 2-step approval cho nghỉ phép
- [x] File upload validation (type, size, malicious)
- [x] Audit logging cho sensitive actions
- [x] Salary masking ở Mapper level
- [x] Permission checks ở Service level

---

**Tài liệu này mô tả phân quyền chính xác sau khi hoàn tất security audit.**  
**Ngày:** 2025-11-19  
**Version:** Final  
**Status:** ✅ Production Ready
