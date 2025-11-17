export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/profile/me',
  },
  
  // Users
  USERS: {
    BASE: '/api/users',
    BY_ID: (id) => `/api/users/${id}`,
    SEARCH: '/api/users/search',
    ONLINE: '/api/users/online',
  },
  
  // HR
  HR: {
    EMPLOYEES: '/api/hr/employees',
    EMPLOYEE_BY_ID: (id) => `/api/hr/employees/${id}`,
    SALARY: '/api/hr/salary',
    ATTENDANCE: '/api/hr/attendance',
    CONTRACTS: '/api/hr/contracts',
    LEAVES: '/api/hr/leaves',
    DEPARTMENTS: '/api/hr/departments',
    POSITIONS: '/api/hr/positions',
    DASHBOARD: '/api/hr/dashboard',
  },
  
  // Projects
  PROJECTS: {
    BASE: '/api/projects',
    BY_ID: (id) => `/api/projects/${id}`,
    ISSUES: '/api/projects/issues',
    SPRINTS: '/api/projects/sprints',
    DASHBOARD: '/api/projects/dashboard',
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
