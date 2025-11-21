import { SharedAttendancePage } from '@/shared/components/attendance';

export default function AttendanceManagementPage() {
  return (
    <SharedAttendancePage 
      title="Quản lý chấm công"
      breadcrumb="Kế toán / Quản lý chấm công"
      viewMode="management"
    />
  );
}
