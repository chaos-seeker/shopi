'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { HiChevronLeft } from 'react-icons/hi2';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CardBorderBottom } from '@/components/card-border-bottom';
import { SliderNavigation } from '@/components/slider-navigation';
import { brandSliderData } from '@/resources/brand-slider';

export function BrandSlider() {
  const swiperRef = useRef<any>(null);

  return (
    <section className="group/section container relative z-10 col-span-full flex flex-col overflow-hidden">
      <Slider swiperRef={swiperRef} />
      <SliderNavigation swiperRef={swiperRef} />
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
      id="brand-slider"
      className="container"
    >
      {brandSliderData.map((item) => (
        <SwiperSlide key={item.id} className="!w-48">
          <Card data={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

interface ICardProps {
  data: (typeof brandSliderData)[0];
}

const Card = (props: ICardProps) => {
  return (
    <div
      key={props.data.id}
      className="group !w-48 overflow-hidden rounded-xl border bg-white transition-all hover:border-gray-300"
    >
      <Link
        href={props.data.path}
        className="flex flex-col items-center justify-between gap-5 p-5"
      >
        <Image
          src={props.data.image}
          alt={props.data.text.fa}
          width={60}
          height={60}
        />
        <div className="flex w-full items-center justify-between">
          <div>
            <p className="text-xsp font-bold text-gray-400">محصولات</p>
            <p className="text-smp font-bold">{props.data.text.fa}</p>
          </div>
          <div className="flex gap-1">
            <p className="text-smp font-bold">{props.data.text.en}</p>
            <HiChevronLeft className="size-4 fill-gray-500" />
          </div>
        </div>
        <CardBorderBottom />
      </Link>
    </div>
  );
};
