import { SharedPayrollPage } from '@/shared/components/payroll';

export default function MyPayrollPage() {
  return (
    <SharedPayrollPage 
      title="Phiếu lương"
      breadcrumb="Cá nhân / Phiếu lương"
      viewMode="personal"
    />
  );
}
