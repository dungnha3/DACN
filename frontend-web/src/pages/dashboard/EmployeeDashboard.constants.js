// Mock data for Employee Dashboard

// KPI Data
export const kpiData = {
  salary: '15.384.615',
  leaveDays: 12,
  lateDays: 1,
  totalHours: 168.5
}

// Attendance History
export const attendanceHistory = [
  { date: '2025-11-08', timeIn: '08:30', timeOut: '17:45', hours: 9.3, status: 'normal' },
  { date: '2025-11-07', timeIn: '08:35', timeOut: '17:30', hours: 8.9, status: 'late' },
  { date: '2025-11-06', timeIn: '08:25', timeOut: '17:15', hours: 8.8, status: 'early' },
  { date: '2025-11-05', timeIn: '08:30', timeOut: '17:30', hours: 9.0, status: 'normal' },
  { date: '2025-11-04', timeIn: '08:30', timeOut: '17:30', hours: 9.0, status: 'normal' },
]

// Leave Requests
export const leaveRequests = [
  { id: 1, type: 'Nghỉ phép', date: '07/11/2025', status: 'approved', approver: 'Trần Thị B' },
  { id: 2, type: 'Giải trình', date: '05/11/2025', status: 'pending', approver: 'Trần Thị B' },
  { id: 3, type: 'Nghỉ ốm', date: '01/11/2025', status: 'rejected', approver: 'Trần Thị B' },
]

// Notifications
export const notifications = [
  { title: 'Thông báo nghỉ lễ', desc: 'Công ty nghỉ lễ Quốc khánh 2/9', date: '3 ngày trước' },
  { title: 'Tiệc tất niên', desc: 'Tiệc tất niên công ty sẽ được tổ chức vào 25/12', date: '1 tuần trước' },
]

// Chat Contacts
export const chatContacts = [
  {
    id: 1,
    name: 'HR Department',
    avatar: '👥',
    lastMessage: 'Đã gửi thông báo về chính sách mới',
    time: '10:30',
    unread: 2,
    online: true
  },
  {
    id: 2,
    name: 'Tech Team',
    avatar: '💻',
    lastMessage: 'Meeting lúc 2PM hôm nay nhé',
    time: '09:15',
    unread: 0,
    online: true
  },
  {
    id: 3,
    name: 'Nguyễn Văn A',
    avatar: '👤',
    lastMessage: 'Cảm ơn bạn!',
    time: 'Hôm qua',
    unread: 0,
    online: false
  },
  {
    id: 4,
    name: 'Trần Thị B',
    avatar: '👩',
    lastMessage: 'File đã được gửi',
    time: 'Hôm qua',
    unread: 0,
    online: false
  },
  {
    id: 5,
    name: 'Marketing Team',
    avatar: '📢',
    lastMessage: 'Chiến dịch mới đã sẵn sàng',
    time: '2 ngày trước',
    unread: 0,
    online: false
  }
]

// Chat Messages
export const chatMessages = [
  {
    id: 1,
    sender: 'HR Department',
    content: 'Xin chào! Chúng tôi có thông báo về chính sách nghỉ phép mới.',
    time: '10:25',
    isOwn: false
  },
  {
    id: 2,
    sender: 'You',
    content: 'Dạ, em đã nhận được thông báo. Cho em hỏi thêm về quy định chi tiết được không ạ?',
    time: '10:27',
    isOwn: true
  },
  {
    id: 3,
    sender: 'HR Department',
    content: 'Được ạ. Chính sách mới cho phép nhân viên đăng ký nghỉ phép trước 3 ngày làm việc.',
    time: '10:28',
    isOwn: false
  },
  {
    id: 4,
    sender: 'HR Department',
    content: 'Đã gửi thông báo về chính sách mới',
    time: '10:30',
    isOwn: false
  },
  {
    id: 5,
    sender: 'You',
    content: 'Cảm ơn anh/chị đã giải đáp!',
    time: '10:31',
    isOwn: true
  }
]

// Menu Sections Configuration
export const sectionsConfig = {
  dashboard: {
    title: 'Dashboard',
    pageTitle: 'Dashboard',
    subtitle: 'Tổng quan công việc của bạn',
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
  payroll: {
    title: 'Phiếu lương',
    pageTitle: 'Phiếu lương',
    subtitle: 'Xem thông tin lương và phụ cấp',
  },
  documents: {
    title: 'Hợp đồng & Tài liệu',
    pageTitle: 'Hợp đồng & Tài liệu',
    subtitle: 'Quản lý hợp đồng và tài liệu cá nhân',
  },
  chat: {
    title: 'Trò chuyện',
    pageTitle: 'Trò chuyện',
    subtitle: 'Nhắn tin với đồng nghiệp và phòng ban',
  }
}
