# UI/UX Design Concept: Business Management System

## 🎨 Design Philosophy
**"Professional yet Dynamic"**
Kết hợp sự chuyên nghiệp của ứng dụng doanh nghiệp với sự hiện đại, mượt mà của các ứng dụng consumer hàng đầu.
- **Keywords:** Clean, Spacious, Rounded, Smooth.
- **Visual Style:** Soft Shadows (đổ bóng nhẹ), Card-based layout (bố cục dạng thẻ), Subtle Gradients (chuyển màu nhẹ).

---

## 🛠️ Design System

### 1. Color Palette (Màu sắc)
Sử dụng tông màu Xanh Dương (Blue) làm chủ đạo để tạo cảm giác tin cậy, kết hợp với các màu accent tươi sáng.

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Primary** | **Royal Blue** | `#2563EB` | Buttons, Active States, Headers |
| **Secondary** | **Sky Blue** | `#3B82F6` | Gradients, Secondary Actions |
| **Accent** | **Vibrant Teal** | `#06B6D4` | Highlights, Progress Bars, Icons |
| **Success** | **Emerald** | `#10B981` | Check-in thành công, Task Done |
| **Warning** | **Amber** | `#F59E0B` | Pending status, Late alerts |
| **Error** | **Rose** | `#E11D48` | Check-out, Delete, Errors |
| **Surface** | **Off-White** | `#F8FAFC` | Background (Light Mode) |
| **Surface** | **Dark Gunmetal**| `#1E293B` | Background (Dark Mode) |

### 2. Typography (Phông chữ)
Sử dụng **Inter** hoặc **Roboto** (Google Fonts) - dễ đọc, hiện đại.
- **Headings:** Bold, kích thước lớn (24-32sp).
- **Body:** Regular/Medium, kích thước chuẩn (14-16sp).
- **Caption:** Grey color, kích thước nhỏ (12sp).

### 3. Component Styles
- **Cards:** Bo góc `BorderRadius.circular(16)`, đổ bóng nhẹ `BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: Offset(0, 4))`.
- **Buttons:** Chiều cao 50-56dp, bo góc tròn hoặc pill-shape. Gradient background cho nút chính.
- **Inputs:** Filled background (màu xám nhạt), border ẩn, focus sẽ hiện border màu Primary.

---

## 📱 Screen Concepts (Ý tưởng màn hình)

### 1. Dashboard (Màn hình chính)
*Phong cách: "Command Center"*
- **Header:** Chào buổi sáng + Avatar + Notification Bell (có badge đỏ).
- **Quick Stats (Carousel):**
    - Card 1: "Chấm công hôm nay" (Giờ check-in, đếm ngược giờ về).
    - Card 2: "Task đang làm" (Tiến độ dự án A: 75%).
- **Quick Actions (Grid 2x2):** Các nút to, icon màu sắc rực rỡ:
    - 📍 Check-in (Màu Xanh lá)
    - 📅 Xin nghỉ (Màu Cam)
    - 📋 Task mới (Màu Xanh dương)
    - 💰 Bảng lương (Màu Tím)
- **Recent Activity:** List dọc các thông báo mới nhất hoặc task vừa được giao.

### 2. Project Management (Quản lý dự án)
*Phong cách: "Kanban & Progress"*
- **Project List:** Dạng Card lớn. Mỗi card có:
    - Tên dự án (Bold).
    - Thanh tiến độ (Linear Progress Indicator) chạy ngang.
    - Avatars của thành viên (chồng lên nhau - Avatar Stack).
    - Status Chip (Active/Completed).
- **Project Detail:**
    - Tab bar: "Overview", "Tasks", "Files".
    - **Tasks Tab:** List các task, bên trái là dải màu (Priority: Đỏ/Vàng/Xanh). Swipe sang phải để "Done", sang trái để "Assign".

### 3. HR - GPS Attendance (Chấm công)
*Phong cách: "Map Utility"*
- **Map Background:** Bản đồ chiếm 60% màn hình phía trên.
- **Bottom Sheet:** Một thẻ trắng bo tròn trượt từ dưới lên chiếm 40%.
    - Hiển thị địa chỉ hiện tại (Text to).
    - Khoảng cách đến công ty (Ví dụ: "Bạn đang cách văn phòng 50m").
    - **Slide Action Button:** Nút trượt ngang "Trượt để Check-in" (giống iPhone unlock) -> Tránh bấm nhầm.

### 4. Chat (Trò chuyện)
*Phong cách: "Modern Messenger"*
- **Bubble:**
    - Tin mình gửi: Gradient Blue, bo góc (trừ góc dưới phải).
    - Tin nhận: Màu xám nhạt, bo góc (trừ góc dưới trái).
- **Input Bar:** Floating bar (nổi lên trên background), có nút đính kèm (+) xoay ra menu chọn ảnh/file.
- **Typing Indicator:** 3 chấm nhảy múa mượt mà.

### 5. Profile (Cá nhân)
*Phong cách: "ID Card"*
- **Header:** Background gradient lớn. Avatar nằm đè lên ranh giới giữa header và body.
- **Info Cards:** Các thông tin (Email, Phone, Dept) nằm trong các card riêng biệt, icon bên trái.
- **Settings:** List menu đơn giản, switch toggle cho "Dark Mode".

### 6. HR - Payroll (Bảng lương)
*Phong cách: "Financial Clarity"*
- **Month Picker:** Dropdown chọn tháng/năm ở trên cùng.
- **Summary Card:** Card lớn hiển thị "Thực nhận" (Net Salary) với font số to, màu xanh lá.
- **Breakdown:** Accordion (danh sách xổ xuống) cho các mục:
    - 🟢 Thu nhập (Lương cứng, Phụ cấp, Thưởng).
    - 🔴 Khấu trừ (BHXH, Thuế, Phạt).
- **History:** Biểu đồ cột nhỏ thể hiện xu hướng lương 6 tháng gần nhất.

### 7. HR - Leave Request (Xin nghỉ phép)
*Phong cách: "Simple Form"*
- **Leave Balance:** Card hiển thị số ngày phép còn lại (Ví dụ: 10/12 ngày).
- **Form:**
    - Loại nghỉ: Chips chọn nhanh (Phép năm, Ốm, Không lương).
    - Thời gian: Date Range Picker giao diện lịch.
    - Lý do: Text area với placeholder gợi ý.
- **History List:** Danh sách các đơn đã tạo với status badge màu (Vàng: Chờ, Xanh: Duyệt, Đỏ: Từ chối).

### 8. Notifications (Thông báo)
*Phong cách: "Clean List"*
- **Filter Tabs:** Tất cả | Chưa đọc | Quan trọng.
- **List Item:**
    - Icon phân loại (Chat, Task, System) bên trái.
    - Title đậm, nội dung 2 dòng.
    - Thời gian (VD: "2 giờ trước") màu xám.
    - **Unread:** Background màu xanh nhạt, chấm tròn xanh bên phải.

---

## ✨ Micro-interactions (Hiệu ứng nhỏ)
- **Button Press:** Nút co lại nhẹ (Scale down 0.98) khi bấm.
- **List Scroll:** Hiệu ứng xuất hiện dần (Fade in + Slide up) khi cuộn danh sách.
- **Success:** Pháo hoa nhỏ (Confetti) hoặc dấu tích xanh vẽ động khi Check-in thành công.
