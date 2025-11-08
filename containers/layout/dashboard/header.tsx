'use client';

import { useModal } from '@/hooks/modal';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Header() {
  const pathname = usePathname();
  const isManageProducts = pathname?.includes('/manage-products');
  const isManageCategories = pathname?.includes('/manage-categories');
  const addProductModal = useModal('add-product');
  const addCategoryModal = useModal('add-category');

  return (
    <header>
      <div className="container rounded-b-2xl bg-white px-0 border">
        <div className="flex flex-col items-center justify-between pt-4">
          <div className="flex w-full items-center justify-between px-4">
            <button
              type="button"
              onClick={() => (window.location.href = '/')}
              className="relative z-0"
            >
              <Image
                src="/images/templates/base/header-logo-mobile.svg"
                alt="logo"
                width={90}
                height={30}
              />
            </button>
            <div className="flex items-center gap-2">
              {isManageCategories && (
                <button
                  type="button"
                  onClick={() => addCategoryModal.show()}
                  className="bg-red hover:bg-red/90 text-sm flex items-center gap-1.5 rounded-xl px-4 py-2.5 transition-all"
                >
                  <p className="text-white">افزودن دسته‌بندی</p>
                </button>
              )}
              {isManageProducts && (
                <button
                  type="button"
                  onClick={() => addProductModal.show()}
                  className="bg-red hover:bg-red/90 text-sm flex items-center gap-1.5 rounded-xl px-4 py-2.5 transition-all"
                >
                  <p className="text-white">افزودن محصول</p>
                </button>
              )}
            </div>
          </div>
          <div className="mt-3 flex w-full justify-center border-t px-4 py-4">
            <Tabs />
          </div>
        </div>
      </div>
    </header>
  );
}

const Tabs = () => {
  const pathname = usePathname();
  const activeTabRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const data = [
    { label: 'مدیریت محصولات', href: '/dashboard/manage-products' },
    { label: 'مدیریت دسته‌بندی‌ها', href: '/dashboard/manage-categories' },
    { label: 'مدیریت سفارش‌ها', href: '/dashboard/manage-orders' },
  ];

  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeTab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      if (window.innerWidth < 1024) {
        const tabRect = activeTab.getBoundingClientRect();
        const scrollLeft =
          activeTab.offsetLeft - containerRect.width / 2 + tabRect.width / 2;
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth lg:justify-center lg:overflow-x-visible"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {data.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            ref={isActive ? activeTabRef : null}
            href={item.href}
            key={item.href}
            className="shrink-0 snap-center"
          >
            <button
              className={cn(
                'rounded-xl px-4 py-2.5 text-sm font-medium',
                isActive ? 'bg-red text-white' : 'bg-transparent text-gray-500',
              )}
            >
              {item.label}
            </button>
          </Link>
        );
      })}
    </div>
  );
};
