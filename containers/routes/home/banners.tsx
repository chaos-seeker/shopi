'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { bannersData } from '@/resources/banners';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';

export function Banners() {
  return (
    <section className="container grid grid-cols-1 gap-4 lg:grid-cols-3">
      {bannersData.map((item, index) => (
        <Link
          href={item.path}
          key={item.id}
          className={cn({
            'hidden lg:grid': index !== 0,
          })}
        >
          <div className="relative aspect-[3/1] overflow-hidden rounded-xl bg-gray-100 sm:aspect-[2.5/1]">
            <Image
              fill
              src={item.image}
              className="block size-full object-cover object-center"
              alt="تصویر بنر"
            />
          </div>
        </Link>
      ))}
    </section>
  );
}
