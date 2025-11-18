# Project Manager Features

This directory contains all the feature modules for the Project Manager role. Each module corresponds to a menu item in the main navigation.

## Module Structure

```
project/
├── profile/          # Hồ sơ cá nhân - Personal Profile
├── timesheet/        # Chấm công - Time Tracking & Attendance
├── leave/            # Đơn từ & Nghỉ phép - Leave Requests
├── approvals/        # Duyệt nghỉ phép - Leave Approvals
├── payroll/          # Phiếu lương - Payroll Information
├── documents/        # Hợp đồng & Tài liệu - Contracts & Documents
├── projects/         # Dự án - Project Management
├── chat/             # Trò chuyện - Team Chat
└── index.js          # Main exports
```

## Architecture

Each module follows a consistent structure:

```
[module-name]/
├── [ModuleName]Page.jsx       # Main component
├── [ModuleName]Page.styles.js # Styling
├── components/                 # Module-specific components
├── data/                       # Mock data and constants
└── index.js                    # Module export
```

## Usage

To use any module in your application:

```javascript
import { ProfilePage, TimesheetPage, ChatPage } from '@/features/project'
```

Or import individually:

```javascript
import ProfilePage from '@/features/project/profile'
```

## Navigation Integration

These modules are designed to be used with the Project Manager Dashboard's navigation menu:

1. **Dashboard** - Stays in `@/features/dashboard/project-manager` (Overview only)
2. **Hồ sơ cá nhân** - Routes to `@/features/project/profile`
3. **Chấm công** - Routes to `@/features/project/timesheet`
4. **Đơn từ & Nghỉ phép** - Routes to `@/features/project/leave`
5. **Duyệt nghỉ phép** - Routes to `@/features/project/approvals`
6. **Phiếu lương** - Routes to `@/features/project/payroll`
7. **Hợp đồng & Tài liệu** - Routes to `@/features/project/documents`
8. **Dự án** - Routes to `@/features/project/projects`
9. **Trò chuyện** - Routes to `@/features/project/chat`

## Module Status

| Module | Status | Description |
|--------|--------|-------------|
| Profile | ⏳ Placeholder | Basic structure, needs implementation |
| Timesheet | ✅ Implemented | Full attendance tracking functionality |
| Leave | ✅ Implemented | Leave request management |
| Approvals | ✅ Implemented | Leave approval workflow |
| Payroll | ⏳ Placeholder | Basic structure, needs implementation |
| Documents | ⏳ Placeholder | Basic structure, needs implementation |
| Projects | ⏳ Placeholder | Structure ready for full implementation |
| Chat | ✅ Implemented | Full chat interface |

## Next Steps

1. **Update Dashboard**: Modify `ProjectManagerDashboard.jsx` to route to these modules instead of rendering inline
2. **Implement Routing**: Set up React Router or navigation logic to switch between modules
3. **Enhance Modules**: Expand placeholder modules (Profile, Payroll, Documents, Projects) with full functionality
4. **API Integration**: Connect modules to backend APIs
5. **State Management**: Consider adding Redux/Context for shared state

## Development Guidelines

- Keep each module independent and self-contained
- Share common components via a `shared/` directory if needed
- Follow the existing styling patterns for consistency
- Add proper TypeScript types if migrating to TypeScript
- Write unit tests for each module
