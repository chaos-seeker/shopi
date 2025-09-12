import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ReactNode } from 'react';
import TemplateBase from '@/containers/templates/base';
import { cn } from '@/utils/cn';
import Providers from './providers';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      dir="rtl"
      className="scrollbar-hide"
      lang="fa"
    >
      <body className={cn('flex flex-col h-dvh', fontYekanBakh.className)}>
        <Providers>
          <TemplateBase>{children}</TemplateBase>
        </Providers>
      </body>
    </html>
  );
}
