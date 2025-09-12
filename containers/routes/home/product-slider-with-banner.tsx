'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ProductCard } from '@/components/product-card';
import { useShuffledArray } from '@/hooks/shuffle-array';
import { productsData } from '@/resources/products';
import { cn } from '@/utils/cn';

interface IProductSliderProps {
  image: string;
  text: string;
  path: string;
  position: 'left' | 'right';
}

export function ProductSliderWithBanner(props: IProductSliderProps) {
  const swiperRef = useRef<any>(null);

  return (
    <section className="group/section container relative z-10 col-span-full grid w-full grid-cols-5 gap-5 overflow-hidden rounded-lg">
      <Banner
        image={props.image}
        text={props.text}
        position={props.position}
        path={props.path}
      />
      <div
        className={cn('relative col-span-full md:col-span-4', {
          'md:order-2': props.position === 'left',
          'md:order-1': props.position === 'right',
        })}
      >
        <Slider swiperRef={swiperRef} />
        <Navigation swiperRef={swiperRef} />
      </div>
    </section>
  );
}

interface IBannerProps {
  image: string;
  text: string;
  position: 'left' | 'right';
  path: string;
}

const Banner = (props: IBannerProps) => {
  return (
    <Link
      href={props.path}
      className={cn(
        'col-span-full flex justify-between rounded-xl bg-red p-3 md:col-span-1 md:flex-col md:items-center',
        { 'md:order-1': props.position === 'left' },
        { 'md:order-2': props.position === 'right' },
      )}
    >
      <Image
        alt={props.text}
        src={props.image}
        width={150}
        height={150}
        className="md:w-[220px]"
      />
      <div className="flex w-fit flex-col items-center justify-center md:gap-2 md:pb-8">
        <p className="text-smp font-bold text-white lg:text-base">
          مجموعه محصولات
        </p>
        <p className="text-2xl font-bold text-white lg:text-2xl">
          {props.text}
        </p>
      </div>
    </Link>
  );
};

interface ISliderProps {
  swiperRef: any;
}

const Slider = (props: ISliderProps) => {
  const shuffledProductsData = useShuffledArray(productsData);

  return (
    <div>
      <Swiper
        slidesPerView="auto"
        spaceBetween={0}
        ref={props.swiperRef}
        modules={[Autoplay]}
        id="product-slider"
        className="rounded-xl border bg-white"
      >
        {shuffledProductsData.map((item) => {
          return (
            <SwiperSlide
              key={item.id}
              className="group !w-[268px] border-l last:border-none"
            >
              <ProductCard data={item} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

interface INavigationProps {
  swiperRef: any;
}

const Navigation = (props: INavigationProps) => {
  return (
    <div className="group/navigation hidden w-fit gap-2 transition-all group-hover/section:flex">
      <button
        className="group/navigation_btn absolute -left-4 bottom-0 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg border bg-white"
        onClick={() => props.swiperRef.current.swiper.slideNext()}
      >
        <HiChevronLeft className="size-4 fill-gray-600 group-hover/product-slider_navigation_btn:fill-gray-900" />
      </button>
      <button
        className="group/navigation_btn absolute -right-4 bottom-0 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg border bg-white"
        onClick={() => props.swiperRef.current.swiper.slidePrev()}
      >
        <HiChevronRight className="size-4 fill-gray-600 group-hover/product-slider_navigation_btn:fill-gray-900" />
      </button>
    </div>
  );
};
