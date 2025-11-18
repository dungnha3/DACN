# Migration Guide: Modular Project Manager Dashboard

## Overview

This guide explains how to integrate the new modular structure into your existing Project Manager Dashboard.

## What Changed

### Before
All features were rendered inline within `ProjectManagerDashboard.jsx`:
- Single 1500+ line component
- All features in one file
- Hard to maintain and test
- Difficult navigation between features

### After
Each menu tab is now a separate module in `@/features/project/`:
```
project/
├── profile/       → Hồ sơ cá nhân
├── timesheet/     → Chấm công
├── leave/         → Đơn từ & Nghỉ phép
├── approvals/     → Duyệt nghỉ phép
├── payroll/       → Phiếu lương
├── documents/     → Hợp đồng & Tài liệu
├── projects/      → Dự án
└── chat/          → Trò chuyện
```

## Integration Steps

### Step 1: Install React Router (if not already installed)

```bash
npm install react-router-dom
```

### Step 2: Update ProjectManagerDashboard.jsx

Replace the inline rendering with routing:

```javascript
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import {
  ProfilePage,
  TimesheetPage,
  LeavePage,
  ApprovalsPage,
  PayrollPage,
  DocumentsPage,
  ProjectsPage,
  ChatPage
} from '@/features/project'

export default function ProjectManagerDashboard() {
  const navigate = useNavigate()
  
  // Navigation handler
  const handleNavigation = (path) => {
    navigate(`/project-manager/${path}`)
  }

  return (
    <div style={styles.dashboard}>
      {/* Sidebar with Navigation */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.logoText}>MENU CHÍNH</h2>
        </div>
        
        <div style={styles.navMenu}>
          <NavItem onClick={() => handleNavigation('dashboard')} icon="🏠">
            Dashboard
          </NavItem>
          <NavItem onClick={() => handleNavigation('profile')} icon="👤">
            Hồ sơ cá nhân
          </NavItem>
          <NavItem onClick={() => handleNavigation('timesheet')} icon="🕐">
            Chấm công
          </NavItem>
          <NavItem onClick={() => handleNavigation('leave')} icon="📋">
            Đơn từ & Nghỉ phép
          </NavItem>
          <NavItem onClick={() => handleNavigation('approvals')} icon="✓">
            Duyệt nghỉ phép
          </NavItem>
          <NavItem onClick={() => handleNavigation('payroll')} icon="💰">
            Phiếu lương
          </NavItem>
          <NavItem onClick={() => handleNavigation('documents')} icon="📄">
            Hợp đồng & Tài liệu
          </NavItem>
          <NavItem onClick={() => handleNavigation('projects')} icon="🏗️">
            Dự án
          </NavItem>
          <NavItem onClick={() => handleNavigation('chat')} icon="💬">
            Trò chuyện
          </NavItem>
        </div>
      </div>

      {/* Main Content Area with Routes */}
      <div style={styles.mainContent}>
        <Routes>
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="timesheet" element={<TimesheetPage />} />
          <Route path="leave" element={<LeavePage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="payroll" element={<PayrollPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  )
}

// Dashboard Overview Component (keep the original dashboard KPIs here)
function DashboardOverview() {
  return (
    <div style={styles.pageContent}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Dashboard</h1>
        <p style={styles.pageSubtitle}>Tổng quan quản lý dự án của bạn</p>
      </div>
      
      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        {/* Your existing KPI cards here */}
      </div>
      
      {/* Charts and other dashboard widgets */}
    </div>
  )
}
```

### Step 3: Update App Routing

In your main App.jsx or routing configuration:

```javascript
import ProjectManagerDashboard from '@/features/dashboard/project-manager'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Other routes */}
        <Route path="/project-manager/*" element={<ProjectManagerDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
```

### Step 4: Alternative - Simple State-Based Navigation (No Router)

If you prefer not to use React Router, you can keep the existing state-based navigation:

```javascript
import {
  ProfilePage,
  TimesheetPage,
  LeavePage,
  // ... other imports
} from '@/features/project'

export default function ProjectManagerDashboard() {
  const [active, setActive] = useState('dashboard')
  
  // Render component based on active state
  const renderContent = () => {
    switch(active) {
      case 'dashboard':
        return <DashboardOverview />
      case 'profile':
        return <ProfilePage />
      case 'timesheet':
        return <TimesheetPage />
      case 'leave':
        return <LeavePage />
      case 'approvals':
        return <ApprovalsPage />
      case 'payroll':
        return <PayrollPage />
      case 'documents':
        return <DocumentsPage />
      case 'projects':
        return <ProjectsPage />
      case 'chat':
        return <ChatPage />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        {/* Navigation items with onClick={() => setActive('...')} */}
      </div>
      
      {/* Content */}
      <div style={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  )
}
```

## Benefits

1. **✅ Modularity**: Each feature is independent and can be developed/tested separately
2. **✅ Maintainability**: Smaller, focused components instead of one huge file
3. **✅ Reusability**: Modules can be reused across different dashboards
4. **✅ Team Collaboration**: Different developers can work on different modules
5. **✅ Performance**: Easier to implement code splitting and lazy loading
6. **✅ Testing**: Each module can be unit tested independently

## Code Splitting (Optional)

For better performance, you can lazy load modules:

```javascript
import { lazy, Suspense } from 'react'

const ProfilePage = lazy(() => import('@/features/project/profile'))
const TimesheetPage = lazy(() => import('@/features/project/timesheet'))
// ... other lazy imports

function ProjectManagerDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="profile" element={<ProfilePage />} />
        {/* other routes */}
      </Routes>
    </Suspense>
  )
}
```

## Rollback Plan

If you need to rollback to the original structure:
1. The original `ProjectManagerDashboard.jsx` remains unchanged
2. Simply remove the imports from `@/features/project`
3. Delete the `project/` directory if needed

## Next Steps

1. Test each module individually
2. Add proper error boundaries
3. Implement API integration for each module
4. Add loading states and error handling
5. Enhance placeholder modules with full functionality
