'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import { getAllCategories } from '@/actions/category/get-all-categories';
import { CardBorderBottom } from '@/components/card-border-bottom';
import { SliderNavigation } from '@/components/slider-navigation';
import { TCategory } from '@/types/category';
import { cn } from '@/utils/cn';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export function CategorySlider() {
  const swiperRef = useRef<any>(null);
  const pathname = usePathname();
  const isPathnameHomepage = pathname === '/';

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const result = await getAllCategories();
      if (result.error) throw new Error(result.error);
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return null;
  }

  return (
    <section
      className={cn(
        'group/section relative z-10 col-span-full flex flex-col overflow-hidden',
        {
          container: isPathnameHomepage,
        },
      )}
    >
      <Slider swiperRef={swiperRef} categories={categories || []} />
      {isPathnameHomepage ? (
        <SliderNavigation swiperRef={swiperRef} />
      ) : null}
    </section>
  );
}

interface ISliderProps {
  swiperRef: any;
  categories: TCategory[];
}

const Slider = (props: ISliderProps) => {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={13}
      ref={props.swiperRef}
      modules={[Autoplay]}
      id="category-slider"
      className="container"
    >
      {props.categories.map((category) => (
        <SwiperSlide key={category.id} className="w-[250px]!">
          <Card category={category} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

interface ICardProps {
  category: TCategory;
}

const Card = (props: ICardProps) => {
  return (
    <SwiperSlide
      key={props.category.id}
      className="group overflow-hidden rounded-xl border bg-white transition-all hover:border-gray-300"
    >
      <Link
        href={`/explore?category=${props.category.slug}`}
        className="flex items-center justify-between gap-5 p-3"
      >
        <div className="flex items-center gap-3">
          <Image
            src={props.category.image}
            alt={props.category.name_fa}
            width={60}
            height={60}
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-smp font-bold">{props.category.name_fa}</p>
            <p className="text-sm text-gray-400">{props.category.name_en}</p>
          </div>
        </div>
        <CardBorderBottom />
      </Link>
    </SwiperSlide>
  );
};
