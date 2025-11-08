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
  }
}
