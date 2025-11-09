'use client';

import { ViewportAnimation } from '@/components/viewport-animation';
import { ProfileSidebar } from '@/containers/routes/profile/profile-sidebar';
import { UserOrders } from '@/containers/routes/profile/user-orders';
import { userSlice } from '@/slices/user';
import { useKillua } from 'killua';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const user = useKillua(userSlice);
  const userData = user.get();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!userData) {
        router.push('/');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [userData, router]);

  if (isChecking) {
    return null;
  }

  if (!userData) {
    return null;
  }

  return (
    <ViewportAnimation>
      <div className="container w-full">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ViewportAnimation className="lg:col-span-1">
            <ProfileSidebar />
          </ViewportAnimation>
          <ViewportAnimation className="lg:col-span-2">
            <UserOrders userId={userData.id} />
          </ViewportAnimation>
        </div>
      </div>
    </ViewportAnimation>
  );
}
