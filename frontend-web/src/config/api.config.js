export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    LOGOUT_ALL: '/api/auth/logout-all',
    REFRESH: '/api/auth/refresh',
    VALIDATE: '/api/auth/validate',
    PROFILE: '/api/profile/me',
  },
  
  // Users
  USERS: {
    BASE: '/api/users',
    BY_ID: (id) => `/api/users/${id}`,
    SEARCH: '/api/users/search',
    ONLINE: '/api/users/online',
  },
  
  // HR - Đã cập nhật theo BE API
  HR: {
    // Nhân viên
    EMPLOYEES: '/nhan-vien',
    EMPLOYEE_BY_ID: (id) => `/nhan-vien/${id}`,
    EMPLOYEES_PAGE: '/nhan-vien/page',
    EMPLOYEE_BY_USER: (userId) => `/nhan-vien/user/${userId}`,
    EMPLOYEE_BY_STATUS: (status) => `/nhan-vien/trang-thai/${status}`,
    EMPLOYEE_BY_DEPT: (deptId) => `/nhan-vien/phong-ban/${deptId}`,
    EMPLOYEE_BY_POSITION: (posId) => `/nhan-vien/chuc-vu/${posId}`,
    EMPLOYEE_SEARCH: '/nhan-vien/search',
    
    // Phòng ban
    DEPARTMENTS: '/phong-ban',
    DEPARTMENT_BY_ID: (id) => `/phong-ban/${id}`,
    
    // Chức vụ
    POSITIONS: '/chuc-vu',
    POSITION_BY_ID: (id) => `/chuc-vu/${id}`,
    
    // Hợp đồng
    CONTRACTS: '/hop-dong',
    CONTRACT_BY_ID: (id) => `/hop-dong/${id}`,
    CONTRACT_BY_EMPLOYEE: (empId) => `/hop-dong/nhan-vien/${empId}`,
    CONTRACT_ACTIVE: (empId) => `/hop-dong/nhan-vien/${empId}/active`,
    CONTRACT_BY_STATUS: (status) => `/hop-dong/trang-thai/${status}`,
    CONTRACT_EXPIRING: '/hop-dong/expiring',
    CONTRACT_CANCEL: (id) => `/hop-dong/${id}/cancel`,
    CONTRACT_RENEW: (id) => `/hop-dong/${id}/renew`,
    
    // Dashboard
    DASHBOARD: '/api/dashboard/tong-quan',
    DASHBOARD_STATS: '/api/dashboard/stats',
    DASHBOARD_BY_MONTH: '/api/dashboard/thang',
    DASHBOARD_ATTENDANCE: '/api/dashboard/cham-cong-phong-ban',
    DASHBOARD_SALARY: '/api/dashboard/luong-theo-thang',
    DASHBOARD_AGE: '/api/dashboard/nhan-vien-theo-tuoi',
    DASHBOARD_GENDER: '/api/dashboard/nhan-vien-theo-gioi-tinh',
    
    // Chấm công
    ATTENDANCES: '/cham-cong',
    ATTENDANCE_BY_ID: (id) => `/cham-cong/${id}`,
    ATTENDANCE_BY_EMPLOYEE: (empId) => `/cham-cong/nhan-vien/${empId}`,
    ATTENDANCE_DATE_RANGE: '/cham-cong/date-range',
    ATTENDANCE_BY_MONTH: (empId) => `/cham-cong/nhan-vien/${empId}/month`,
    ATTENDANCE_WORKING_DAYS: (empId) => `/cham-cong/nhan-vien/${empId}/working-days`,
    ATTENDANCE_TOTAL_HOURS: (empId) => `/cham-cong/nhan-vien/${empId}/total-hours`,
    ATTENDANCE_STATISTICS: (empId) => `/cham-cong/nhan-vien/${empId}/statistics`,
    ATTENDANCE_CHECKIN: '/cham-cong/check-in',
    ATTENDANCE_CHECKOUT: (id) => `/cham-cong/${id}/check-out`,
    ATTENDANCE_GPS: '/cham-cong/gps',
    ATTENDANCE_STATUS: (empId) => `/cham-cong/status/${empId}`,
    
    // Nghỉ phép
    LEAVES: '/nghi-phep',
    LEAVE_BY_ID: (id) => `/nghi-phep/${id}`,
    LEAVE_BY_EMPLOYEE: (empId) => `/nghi-phep/nhan-vien/${empId}`,
    LEAVE_DATE_RANGE: '/nghi-phep/date-range',
    LEAVE_PENDING: '/nghi-phep/pending',
    LEAVE_APPROVED: '/nghi-phep/approved',
    LEAVE_REJECTED: '/nghi-phep/rejected',
    LEAVE_APPROVE: (id) => `/nghi-phep/${id}/approve`,
    LEAVE_REJECT: (id) => `/nghi-phep/${id}/reject`,
    LEAVE_TOTAL_DAYS: (empId) => `/nghi-phep/nhan-vien/${empId}/total-days`,
    LEAVE_IS_ON_LEAVE: (empId) => `/nghi-phep/nhan-vien/${empId}/is-on-leave`,
    
    // Đánh giá
    EVALUATIONS: '/api/danh-gia',
    EVALUATION_BY_ID: (id) => `/api/danh-gia/${id}`,
    EVALUATION_PAGE: '/api/danh-gia/page',
    EVALUATION_BY_EMPLOYEE: (empId) => `/api/danh-gia/nhan-vien/${empId}`,
    EVALUATION_PENDING: '/api/danh-gia/pending',
    EVALUATION_SUBMIT: (id) => `/api/danh-gia/${id}/submit`,
    EVALUATION_APPROVE: (id) => `/api/danh-gia/${id}/approve`,
    EVALUATION_REJECT: (id) => `/api/danh-gia/${id}/reject`,
    
    // Bảng lương
    PAYROLLS: '/bang-luong',
    PAYROLL_BY_ID: (id) => `/bang-luong/${id}`,
    PAYROLL_BY_EMPLOYEE: (empId) => `/bang-luong/nhan-vien/${empId}`,
    PAYROLL_BY_MONTH: '/bang-luong/thang',
    PAYROLL_CALCULATE: '/bang-luong/tinh-luong',
  },
  
  // Projects
  PROJECTS: {
    LIST: '/api/projects',
    BY_ID: (id) => `/api/projects/${id}`,
    PAGE: '/api/projects/page',
    BY_USER: (userId) => `/api/projects/user/${userId}`,
    BY_STATUS: (status) => `/api/projects/status/${status}`,
    BY_DEPARTMENT: (deptId) => `/api/projects/department/${deptId}`,
    SEARCH: '/api/projects/search',
  },
  
  // Issues
  ISSUES: {
    LIST: '/api/issues',
    BY_ID: (id) => `/api/issues/${id}`,
    BY_PROJECT: (projectId) => `/api/issues/project/${projectId}`,
    BY_SPRINT: (sprintId) => `/api/issues/sprint/${sprintId}`,
    BY_ASSIGNEE: (userId) => `/api/issues/assignee/${userId}`,
    BY_STATUS: (statusId) => `/api/issues/status/${statusId}`,
    BY_PRIORITY: (priority) => `/api/issues/priority/${priority}`,
    SEARCH: '/api/issues/search',
  },
  
  // Sprints
  SPRINTS: {
    LIST: '/api/sprints',
    BY_ID: (id) => `/api/sprints/${id}`,
    BY_PROJECT: (projectId) => `/api/sprints/project/${projectId}`,
    BY_STATUS: (status) => `/api/sprints/status/${status}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    UNREAD: '/api/notifications/unread',
    MARK_READ: (id) => `/api/notifications/${id}/read`,
  },
  
  // Chat
  CHAT: {
    ROOMS: '/api/chat/rooms',
    MESSAGES: '/api/chat/messages',
  },
};
