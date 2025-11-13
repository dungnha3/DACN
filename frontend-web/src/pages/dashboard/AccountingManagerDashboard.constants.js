// Mock data for Accounting Manager Dashboard

// KPI Data
export const kpiData = {
  revenue: '2.450.000.000',
  expenses: '1.850.000.000',
  profit: '600.000.000',
  pendingApprovals: 8
}

// Attendance History
export const attendanceHistory = [
  { date: '2025-11-08', timeIn: '08:15', timeOut: '17:30', hours: 9.3, status: 'normal' },
  { date: '2025-11-07', timeIn: '08:20', timeOut: '17:45', hours: 9.4, status: 'normal' },
  { date: '2025-11-06', timeIn: '08:25', timeOut: '17:15', hours: 8.8, status: 'early' },
  { date: '2025-11-05', timeIn: '08:15', timeOut: '17:30', hours: 9.3, status: 'normal' },
  { date: '2025-11-04', timeIn: '08:10', timeOut: '17:40', hours: 9.5, status: 'normal' },
]

// Leave Requests
export const leaveRequests = [
  { id: 1, type: 'Nghỉ phép', date: '08/11/2025', status: 'approved', approver: 'Giám đốc' },
  { id: 2, type: 'Nghỉ ốm', date: '05/11/2025', status: 'pending', approver: 'Giám đốc' },
  { id: 3, type: 'Công tác', date: '01/11/2025', status: 'approved', approver: 'Giám đốc' },
]

// Pending Approvals for Accounting Manager
export const pendingApprovals = [
  {
    id: 1,
    type: 'Đề xuất chi phí',
    employee: 'Nguyễn Văn A',
    date: '08/11/2025',
    reason: 'Mua thiết bị văn phòng cho phòng IT',
    status: 'pending'
  },
  {
    id: 2,
    type: 'Thanh toán hóa đơn',
    employee: 'Trần Thị B',
    date: '07/11/2025',
    reason: 'Thanh toán hóa đơn điện tháng 10',
    status: 'pending'
  },
  {
    id: 3,
    type: 'Tạm ứng',
    employee: 'Lê Văn C',
    date: '06/11/2025',
    reason: 'Tạm ứng chi phí công tác Hà Nội',
    status: 'approved'
  },
  {
    id: 4,
    type: 'Hoàn ứng',
    employee: 'Phạm Thị D',
    date: '05/11/2025',
    reason: 'Hoàn ứng chi phí đào tạo nhân viên',
    status: 'pending'
  },
  {
    id: 5,
    type: 'Đề xuất chi phí',
    employee: 'Hoàng Văn E',
    date: '04/11/2025',
    reason: 'Chi phí bảo trì hệ thống máy tính',
    status: 'rejected'
  },
  {
    id: 6,
    type: 'Thanh toán hóa đơn',
    employee: 'Vũ Thị F',
    date: '03/11/2025',
    reason: 'Thanh toán hóa đơn internet tháng 10',
    status: 'approved'
  },
  {
    id: 7,
    type: 'Tạm ứng',
    employee: 'Đỗ Văn G',
    date: '02/11/2025',
    reason: 'Tạm ứng chi phí mua vật tư',
    status: 'pending'
  },
  {
    id: 8,
    type: 'Hoàn ứng',
    employee: 'Bùi Thị H',
    date: '01/11/2025',
    reason: 'Hoàn ứng chi phí đi lại',
    status: 'pending'
  }
]

// Notifications
export const notifications = [
  { title: 'Báo cáo tài chính Q4', desc: 'Cần hoàn thành báo cáo tài chính quý 4 trước 15/12', date: '1 giờ trước' },
  { title: 'Kiểm toán nội bộ', desc: 'Lịch kiểm toán nội bộ sẽ diễn ra từ 20-25/11', date: '2 giờ trước' },
  { title: 'Thanh toán lương', desc: 'Đã hoàn thành thanh toán lương tháng 11', date: '1 ngày trước' },
  { title: 'Hóa đơn điện', desc: 'Hóa đơn điện tháng 10 đã được thanh toán', date: '2 ngày trước' },
]

// Chat Contacts
export const chatContacts = [
  {
    id: 1,
    name: 'Giám đốc tài chính',
    avatar: '💼',
    lastMessage: 'Báo cáo tài chính Q4 cần hoàn thành sớm',
    time: '10:30',
    unread: 2,
    online: true
  },
  {
    id: 2,
    name: 'HR Department',
    avatar: '👥',
    lastMessage: 'Bảng lương tháng 11 đã được duyệt',
    time: '09:45',
    unread: 0,
    online: true
  },
  {
    id: 3,
    name: 'IT Department',
    avatar: '💻',
    lastMessage: 'Hệ thống kế toán cần cập nhật',
    time: '09:20',
    unread: 1,
    online: true
  },
  {
    id: 4,
    name: 'Nguyễn Văn A',
    avatar: '👤',
    lastMessage: 'Cảm ơn anh đã duyệt đề xuất chi phí',
    time: 'Hôm qua',
    unread: 0,
    online: false
  },
  {
    id: 5,
    name: 'Trần Thị B',
    avatar: '👩',
    lastMessage: 'Hóa đơn đã được gửi qua email',
    time: 'Hôm qua',
    unread: 0,
    online: false
  },
  {
    id: 6,
    name: 'Kiểm toán viên',
    avatar: '📊',
    lastMessage: 'Lịch kiểm toán đã được xác nhận',
    time: '2 ngày trước',
    unread: 0,
    online: false
  }
]

// Chat Messages
export const chatMessages = [
  {
    id: 1,
    sender: 'Giám đốc tài chính',
    content: 'Chào anh! Báo cáo tài chính Q4 tiến độ thế nào rồi?',
    time: '10:25',
    isOwn: false
  },
  {
    id: 2,
    sender: 'You',
    content: 'Dạ, em đã hoàn thành 80% báo cáo. Dự kiến sẽ xong trước ngày 15/12.',
    time: '10:27',
    isOwn: true
  },
  {
    id: 3,
    sender: 'Giám đốc tài chính',
    content: 'Tốt lắm! Còn việc kiểm toán nội bộ thì sao?',
    time: '10:28',
    isOwn: false
  },
  {
    id: 4,
    sender: 'You',
    content: 'Em đã chuẩn bị đầy đủ tài liệu. Kiểm toán viên sẽ đến vào tuần sau.',
    time: '10:30',
    isOwn: true
  },
  {
    id: 5,
    sender: 'Giám đốc tài chính',
    content: 'Rất tốt! Cảm ơn anh đã làm việc chăm chỉ.',
    time: '10:31',
    isOwn: false
  }
]

// Menu Sections Configuration
export const sectionsConfig = {
  dashboard: {
    title: 'Dashboard',
    pageTitle: 'Dashboard',
    subtitle: 'Tổng quan quản lý tài chính của bạn',
  },
  profile: {
    title: 'Hồ sơ cá nhân',
    pageTitle: 'Hồ sơ cá nhân',
    subtitle: 'Xem và cập nhật thông tin cá nhân',
  },
  timesheet: {
    title: 'Chấm công',
    pageTitle: 'Lịch sử chấm công',
    subtitle: 'Xem lịch sử chấm công và số giờ làm việc',
  },
  leave: {
    title: 'Đơn từ & Nghỉ phép',
    pageTitle: 'Đơn từ & Nghỉ phép',
    subtitle: 'Xin nghỉ phép và xem trạng thái đơn',
  },
  approvals: {
    title: 'Duyệt đơn',
    pageTitle: 'Duyệt đơn từ',
    subtitle: 'Xem xét và phê duyệt các đề xuất tài chính',
  },
  payroll: {
    title: 'Phiếu lương',
    pageTitle: 'Quản lý lương',
    subtitle: 'Quản lý và xử lý phiếu lương nhân viên',
  },
  documents: {
    title: 'Tài liệu & Báo cáo',
    pageTitle: 'Tài liệu & Báo cáo',
    subtitle: 'Quản lý tài liệu và báo cáo tài chính',
  },
  chat: {
    title: 'Trò chuyện',
    pageTitle: 'Trò chuyện',
    subtitle: 'Nhắn tin với đồng nghiệp và các phòng ban',
  }
}
