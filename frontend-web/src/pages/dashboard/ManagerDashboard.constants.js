// Mock data for Manager Dashboard

// KPI Data
export const kpiData = {
  teamSize: 12,
  pendingLeaves: 3,
  approvedToday: 5,
  totalRequests: 28
}

// Attendance History
export const attendanceHistory = [
  { date: '2025-11-08', timeIn: '08:30', timeOut: '17:45', hours: 9.3, status: 'normal' },
  { date: '2025-11-07', timeIn: '08:35', timeOut: '17:30', hours: 8.9, status: 'late' },
  { date: '2025-11-06', timeIn: '08:25', timeOut: '17:15', hours: 8.8, status: 'early' },
  { date: '2025-11-05', timeIn: '08:30', timeOut: '17:30', hours: 9.0, status: 'normal' },
  { date: '2025-11-04', timeIn: '08:30', timeOut: '17:30', hours: 9.0, status: 'normal' },
]

// Leave Requests (for manager's own leaves)
export const leaveRequests = [
  { id: 1, type: 'Nghỉ phép', date: '07/11/2025', status: 'approved', approver: 'Giám đốc' },
  { id: 2, type: 'Giải trình', date: '05/11/2025', status: 'pending', approver: 'Giám đốc' },
  { id: 3, type: 'Nghỉ ốm', date: '01/11/2025', status: 'rejected', approver: 'Giám đốc' },
]

// Pending Leave Approvals (for team members)
export const pendingApprovals = [
  { 
    id: 1, 
    employeeName: 'Nguyễn Văn A', 
    type: 'Nghỉ phép', 
    fromDate: '10/11/2025',
    toDate: '12/11/2025',
    days: 3,
    reason: 'Nghỉ phép năm',
    submitDate: '08/11/2025',
    status: 'pending'
  },
  { 
    id: 2, 
    employeeName: 'Trần Thị B', 
    type: 'Nghỉ ốm', 
    fromDate: '09/11/2025',
    toDate: '09/11/2025',
    days: 1,
    reason: 'Bị cảm, có giấy khám bệnh',
    submitDate: '08/11/2025',
    status: 'pending'
  },
  { 
    id: 3, 
    employeeName: 'Lê Văn C', 
    type: 'Giải trình', 
    fromDate: '07/11/2025',
    toDate: '07/11/2025',
    days: 1,
    reason: 'Đi muộn do kẹt xe',
    submitDate: '07/11/2025',
    status: 'pending'
  },
  { 
    id: 4, 
    employeeName: 'Phạm Thị D', 
    type: 'Nghỉ phép', 
    fromDate: '15/11/2025',
    toDate: '16/11/2025',
    days: 2,
    reason: 'Việc gia đình',
    submitDate: '08/11/2025',
    status: 'approved'
  },
  { 
    id: 5, 
    employeeName: 'Hoàng Văn E', 
    type: 'Nghỉ phép', 
    fromDate: '05/11/2025',
    toDate: '05/11/2025',
    days: 1,
    reason: 'Không có lý do chính đáng',
    submitDate: '04/11/2025',
    status: 'rejected'
  },
]

// Notifications
export const notifications = [
  { title: 'Đơn nghỉ phép mới', desc: 'Nguyễn Văn A đã gửi đơn nghỉ phép', date: '30 phút trước' },
  { title: 'Thông báo nghỉ lễ', desc: 'Công ty nghỉ lễ Quốc khánh 2/9', date: '3 ngày trước' },
]

// Menu Sections Configuration
export const sectionsConfig = {
  dashboard: {
    title: 'Dashboard',
    pageTitle: 'Dashboard',
    subtitle: 'Tổng quan quản lý của bạn',
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
    title: 'Duyệt nghỉ phép',
    pageTitle: 'Duyệt nghỉ phép',
    subtitle: 'Duyệt đơn nghỉ phép của nhân viên',
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
