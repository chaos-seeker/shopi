'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import { CardBorderBottom } from '@/components/card-border-bottom';
import { SliderNavigation } from '@/components/slider-navigation';
import { TBrand } from '@/types/brand';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface IBrandSliderProps {
  brands: TBrand[];
}

export function BrandSlider({ brands }: IBrandSliderProps) {
  const swiperRef = useRef<any>(null);

  return (
    <section className="group/section container relative z-10 col-span-full flex flex-col overflow-hidden">
      <Slider swiperRef={swiperRef} brands={brands} />
      <SliderNavigation swiperRef={swiperRef} />
    </section>
  );
}

interface ISliderProps {
  swiperRef: any;
  brands: TBrand[];
}

const Slider = (props: ISliderProps) => {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={13}
      ref={props.swiperRef}
      modules={[Autoplay]}
      id="brand-slider"
      className="container"
    >
      {props.brands.map((brand) => (
        <SwiperSlide key={brand.id} className="w-48!">
          <Card brand={brand} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

interface ICardProps {
  brand: TBrand;
}

const Card = (props: ICardProps) => {
  return (
    <div
      key={props.brand.id}
      className="group w-48! overflow-hidden rounded-xl border bg-white transition-all hover:border-gray-300"
    >
      <Link
        href={`/explore?brand=${props.brand.slug}`}
        className="flex flex-col items-center justify-between gap-5 p-5"
      >
        <Image
          src={props.brand.image}
          alt={props.brand.name_fa}
          width={60}
          height={60}
        />
        <div className="flex w-full items-center justify-between">
          <div>
            <p className="text-xsp font-bold text-gray-400">محصولات</p>
            <p className="text-smp font-bold">{props.brand.name_fa}</p>
          </div>
          <div className="flex gap-1">
            <p className="text-smp font-bold">{props.brand.name_en}</p>
            <ChevronLeft className="size-4 stroke-gray-500" />
          </div>
        </div>
        <CardBorderBottom />
      </Link>
    </div>
  );
};
