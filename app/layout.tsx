import './globals.css';
import { Providers } from './providers';
import LayoutBase from '@/containers/layout/base';
import LayoutDashboard from '@/containers/layout/dashboard';
import { cn } from '@/utils/cn';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'شاپی',
  description: 'توسعه دهنده : حمید شاهسونی',
};

const fontYekanBakh = localFont({
  src: [
    {
      path: '../public/fonts/yekanbakh/regular-fanum.woff',
      weight: '400',
    },
    {
      path: '../public/fonts/yekanbakh/medium-fanum.woff',
      weight: '500',
    },
    {
      path: '../public/fonts/yekanbakh/bold-fanum.woff',
      weight: '700',
    },
  ],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isDashboard = pathname.includes('/dashboard');

  return (
    <html
      suppressHydrationWarning
      dir="rtl"
      className="scrollbar-hide"
      lang="fa"
    >
      <body className={cn('flex flex-col h-dvh', fontYekanBakh.className)}>
        <Providers>
          {isDashboard ? (
            <LayoutDashboard>{children}</LayoutDashboard>
          ) : (
            <LayoutBase>{children}</LayoutBase>
          )}
        </Providers>
      </body>
    </html>
  );
}
