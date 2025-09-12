'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Footer } from './footer';
import { Header } from './header';

interface ILayoutProps {
  children: ReactNode;
}

export default function TemplateBase(props: ILayoutProps) {
  const pathname = usePathname();
  const isRouteAuth = pathname.includes('/auth');
  if (isRouteAuth) {
    return props.children;
  }

  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center">
        {props.children}
      </main>
      <Footer />
    </>
  );
}
