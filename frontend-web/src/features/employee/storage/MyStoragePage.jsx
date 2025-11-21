import { SharedStoragePage } from '@/shared/components/storage';

export default function MyStoragePage() {
  return (
    <SharedStoragePage 
      title="File của tôi"
      breadcrumb="Cá nhân / File của tôi"
      viewMode="personal"
    />
  );
}
