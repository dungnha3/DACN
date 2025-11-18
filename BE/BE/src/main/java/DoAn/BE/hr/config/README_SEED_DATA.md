# 🌱 Hướng dẫn Seed Data - Quản lý Nghỉ Phép

## Tổng quan
File `NghiPhepDataInitializer.java` sẽ tự động tạo dữ liệu mẫu cho module **Quản lý Đơn Nghỉ Phép** khi khởi động ứng dụng.

## Dữ liệu được tạo

### Số lượng
- **20-25 đơn nghỉ phép** (tùy thuộc vào số nhân viên trong hệ thống)
- Phân bố theo các trạng thái:
  - **40%** - Chờ duyệt (CHO_DUYET)
  - **45%** - Đã duyệt (DA_DUYET)
  - **15%** - Từ chối (TU_CHOI)

### Các loại phép
1. **PHEP_NAM** - Phép năm thường niên
2. **OM** - Nghỉ ốm
3. **KO_LUONG** - Nghỉ không lương
4. **KHAC** - Các loại phép khác (thai sản, chăm con...)

### Thời gian nghỉ
- Ngày nghỉ: **Trong vòng 6 tháng gần đây đến 3 tháng tới**
- Số ngày nghỉ:
  - 80% trường hợp: **1-5 ngày**
  - 20% trường hợp: **7-14 ngày**

### Dữ liệu chi tiết
- ✅ Lý do nghỉ phù hợp với từng loại phép
- ✅ Người duyệt (HR Manager)
- ✅ Ngày duyệt/từ chối
- ✅ Ghi chú phê duyệt hoặc lý do từ chối

## Cách sử dụng

### 1. Khởi động Backend
```bash
# Từ thư mục BE/BE
./mvnw spring-boot:run

# Hoặc
mvn spring-boot:run
```

### 2. Kiểm tra Log
Khi ứng dụng khởi động, bạn sẽ thấy log:
```
🌱 Bắt đầu khởi tạo dữ liệu mẫu cho Nghỉ Phép...
✅ Đã tạo 25 đơn Nghỉ Phép mẫu
```

### 3. Kiểm tra Frontend
1. Mở trình duyệt: `http://localhost:5173`
2. Đăng nhập với tài khoản HR:
   - Username: `hr`
   - Password: `HrManager@123`
3. Vào menu: **Quản lý nhân sự** → **Quản lý nghỉ phép**

## Điều kiện tiên quyết

⚠️ **QUAN TRỌNG**: Seed data chỉ chạy khi:
1. ✅ Có ít nhất 1 nhân viên trong hệ thống
2. ✅ Bảng `nghi_phep` chưa có dữ liệu (count = 0)

Nếu đã có dữ liệu, seed data sẽ **KHÔNG** chạy lại.

## Xóa dữ liệu để chạy lại

Nếu muốn reset và tạo lại seed data:

### Cách 1: Xóa dữ liệu qua SQL
```sql
-- Xóa tất cả đơn nghỉ phép
DELETE FROM nghi_phep;
```

### Cách 2: Drop table và restart
```sql
-- Drop table (Spring sẽ tự tạo lại)
DROP TABLE nghi_phep;
```

Sau đó restart backend, seed data sẽ tự động chạy lại.

## API Endpoints liên quan

```
GET    /api/nghi-phep              - Lấy tất cả đơn nghỉ phép
GET    /api/nghi-phep/{id}         - Lấy chi tiết 1 đơn
POST   /api/nghi-phep              - Tạo đơn mới
PATCH  /api/nghi-phep/{id}/approve - Phê duyệt
PATCH  /api/nghi-phep/{id}/reject  - Từ chối
DELETE /api/nghi-phep/{id}         - Xóa đơn
```

## Troubleshooting

### Seed data không chạy
**Kiểm tra:**
1. Đã có dữ liệu trong bảng `nghi_phep` chưa?
2. Có nhân viên nào trong hệ thống chưa?
3. Xem log lỗi trong console

### Lỗi foreign key
**Nguyên nhân:** Chưa có nhân viên trong hệ thống
**Giải pháp:** Tạo nhân viên trước (hoặc chạy seed data cho Nhân viên)

### Dữ liệu không hiển thị trên Frontend
**Kiểm tra:**
1. Backend có chạy không? (port 8080)
2. Frontend có kết nối được backend không?
3. Console browser có lỗi API không?

## Tùy chỉnh

Để thay đổi số lượng hoặc nội dung seed data, edit file:
```
BE/BE/src/main/java/DoAn/BE/hr/config/NghiPhepDataInitializer.java
```

**Các tham số có thể thay đổi:**
- Dòng 51: `Math.min(25, ...)` - Số lượng đơn tối đa
- Dòng 69-77: Tỷ lệ trạng thái (40-45-15)
- Dòng 86-92: Số ngày nghỉ (1-5 hoặc 7-14)
- Dòng 111-171: Nội dung lý do nghỉ

## Ghi chú

- ✅ Seed data an toàn, không làm ảnh hưởng dữ liệu thực
- ✅ Chỉ chạy 1 lần khi khởi động (nếu chưa có data)
- ✅ Có thể tắt bằng cách xóa/comment file này
- ✅ Dữ liệu random, mỗi lần chạy sẽ khác nhau
