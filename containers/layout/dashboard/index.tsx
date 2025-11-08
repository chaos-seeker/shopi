import Header from './header';
import type { PropsWithChildren } from 'react';

export default function LayoutDashboard(props: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>{props.children}</main>
    </div>
  );
}
