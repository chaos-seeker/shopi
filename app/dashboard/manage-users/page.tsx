'use client';

import { ViewportAnimation } from '@/components/viewport-animation';
import { ListUsers } from '@/containers/routes/dashboard/manage-users/list-users';

export default function Page() {
  return (
    <ViewportAnimation>
      <ListUsers />
    </ViewportAnimation>
  );
}
