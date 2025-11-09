'use client';

import { Footer } from './footer';
import { Header } from './header';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ILayoutProps {
  children: ReactNode;
}

export default function LayoutBase(props: ILayoutProps) {
  const pathname = usePathname();
  const isRouteAuth = pathname.includes('/auth');
  if (isRouteAuth) {
    return props.children;
  }

  return (
    <>
      <Header />
      <main className="flex flex-1 justify-center">{props.children}</main>
      <Footer />
    </>
  );
}
