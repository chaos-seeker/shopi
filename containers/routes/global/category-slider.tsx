'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CardBorderBottom } from '@/components/card-border-bottom';
import { SliderNavigation } from '@/components/slider-navigation';
import { categorySliderData } from '@/resources/category-slider';
import { cn } from '@/utils/cn';

export function CategorySlider() {
  const swiperRef = useRef<any>(null);
  const pathname = usePathname();
  const isPathnameHomepage = pathname === '/';

  return (
    <section
      className={cn(
        'group/section relative z-10 col-span-full flex flex-col overflow-hidden',
        {
          container: isPathnameHomepage,
        },
      )}
    >
      <Slider swiperRef={swiperRef} />
      {isPathnameHomepage ? <SliderNavigation swiperRef={swiperRef} /> : null}
    </section>
  );
}

interface ISliderProps {
  swiperRef: any;
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
      {categorySliderData.map((item) => (
        <SwiperSlide key={item.id} className="!w-[250px]">
          <Card data={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

interface ICardProps {
  data: (typeof categorySliderData)[0];
}

const Card = (props: ICardProps) => {
  return (
    <SwiperSlide
      key={props.data.id}
      className="group overflow-hidden rounded-xl border bg-white transition-all hover:border-gray-300"
    >
      <Link
        href={props.data.path}
        className="flex items-center justify-between gap-5 p-3"
      >
        <div className="flex items-center gap-3">
          <Image
            src={props.data.image}
            alt={props.data.text.fa}
            width={60}
            height={60}
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-smp font-bold">{props.data.text.fa}</p>
            <p className="text-sm text-gray-400">{props.data.text.en}</p>
          </div>
        </div>
        <CardBorderBottom />
      </Link>
    </SwiperSlide>
  );
};
