import { SharedProfilePage } from '@/shared/components/profile';

export default function ProfilePage() {
  return (
    <SharedProfilePage 
      title="Hồ sơ cá nhân"
      breadcrumb="Cá nhân / Hồ sơ cá nhân"
      allowEdit={true}
      userRole="Project Manager"
    />
  );
}
