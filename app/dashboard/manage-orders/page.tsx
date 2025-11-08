'use client';

import { ViewportAnimation } from '@/components/viewport-animation';
import { ListOrders } from '@/containers/routes/dashboard/manage-orders/list-orders';

export default function Page() {
  return (
    <ViewportAnimation>
      <ListOrders />
    </ViewportAnimation>
  );
}
