'use client';

import { ProfileSidebar } from '@/containers/routes/profile/profile-sidebar';
import { UserOrders } from '@/containers/routes/profile/user-orders';
import { userSlice } from '@/slices/user';
import { useKillua } from 'killua';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const user = useKillua(userSlice);
  const userData = user.get();
  const router = useRouter();

  useEffect(() => {
    if (!userData) {
      window.location.href = '/';
    }
  }, [userData, router]);

  if (!userData) {
    return null;
  }

  return (
    <div className="container py-6 h-full">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProfileSidebar />
        </div>
        <div className="lg:col-span-2">
          <UserOrders userId={userData.id} />
        </div>
      </div>
    </div>
  );
}
