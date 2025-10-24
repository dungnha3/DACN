-- =====================================================
-- ISSUE STATUS INITIALIZATION
-- Khởi tạo dữ liệu mẫu cho bảng issue_statuses
-- =====================================================

-- Xóa dữ liệu cũ nếu có (tùy chọn)
-- DELETE FROM issue_statuses;

-- Insert các trạng thái mặc định
INSERT INTO issue_statuses (name, order_index, color) VALUES
('To Do', 1, '#4BADE8'),
('In Progress', 2, '#FFA500'),
('Review', 3, '#9C27B0'),
('Done', 4, '#4CAF50');

-- Kiểm tra kết quả
SELECT * FROM issue_statuses ORDER BY order_index;
