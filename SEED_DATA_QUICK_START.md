# 🚀 Quick Start - Seed Data Nghỉ Phép

## ✅ Đã tạo xong Seed Data Initializer!

File: `BE/BE/src/main/java/DoAn/BE/hr/config/NghiPhepDataInitializer.java`

## 🎯 Chạy ngay

### Bước 1: Restart Backend
```bash
# Dừng backend hiện tại (Ctrl+C)
# Sau đó chạy lại:
cd BE/BE
./mvnw spring-boot:run
```

### Bước 2: Kiểm tra Log
Tìm dòng này trong console:
```
✅ Đã tạo 25 đơn Nghỉ Phép mẫu
```

### Bước 3: Xem trên Frontend
1. Mở: http://localhost:5173
2. Đăng nhập: `hr` / `HrManager@123`
3. Vào: **Quản lý nhân sự** → **Quản lý nghỉ phép**

## 📊 Dữ liệu mẫu

Seed data sẽ tạo **20-25 đơn nghỉ phép** với:

### Trạng thái
- 🟡 **40%** Chờ duyệt
- 🟢 **45%** Đã duyệt  
- 🔴 **15%** Từ chối

### Loại phép
- 🏖️ **Phép năm** - Du lịch, về quê, nghỉ dưỡng
- 🤒 **Ốm** - Bệnh tật, khám chữa bệnh
- 💸 **Không lương** - Việc gia đình, thủ tục hành chính
- 📋 **Khác** - Thai sản, chăm con, đào tạo

### Thời gian
- Ngày nghỉ: **6 tháng trước → 3 tháng sau**
- Số ngày: **1-5 ngày** (phổ biến) hoặc **7-14 ngày** (hiếm)

## ⚡ Lưu ý quan trọng

### ✅ Seed data chỉ chạy khi:
1. Bảng `nghi_phep` CHƯA có dữ liệu
2. Có ít nhất 1 nhân viên trong hệ thống

### ⚠️ Nếu đã có data:
Seed sẽ KHÔNG chạy lại. Bạn sẽ thấy log:
```
📋 Đã có dữ liệu Nghỉ Phép, bỏ qua khởi tạo
```

### 🔄 Để chạy lại:
```sql
-- Xóa dữ liệu cũ
DELETE FROM nghi_phep;

-- Sau đó restart backend
```

## 🎨 Tính năng trên Frontend

Sau khi có seed data, bạn có thể test:

### Xem danh sách
- ✅ Filter theo trạng thái
- ✅ Search theo tên nhân viên
- ✅ Xem thống kê tổng quan

### Quản lý đơn
- ✅ Xem chi tiết đơn nghỉ phép
- ✅ Phê duyệt đơn chờ duyệt
- ✅ Từ chối đơn với lý do
- ✅ Tạo đơn nghỉ phép mới

## 📞 Troubleshooting

### Không thấy log seed data?
→ Kiểm tra: Đã restart backend chưa?

### Log báo "Không có nhân viên"?
→ Tạo nhân viên trước hoặc chạy seed data cho NhanVien

### Frontend không hiển thị data?
→ Kiểm tra:
- Backend có chạy ở port 8080?
- Console browser có lỗi API không?
- Network tab: Request có thành công (200)?

## 📚 Chi tiết

Xem thêm: `BE/BE/src/main/java/DoAn/BE/hr/config/README_SEED_DATA.md`

---

**Tóm tắt:** Restart backend → Kiểm tra log → Vào frontend xem data! 🎉
