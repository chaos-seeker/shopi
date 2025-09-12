'use client';

import 'swiper/css';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { cn } from '@/utils/cn';

interface IImagesProps {
  title: {
    fa: string;
    en: string;
  };
  images: string[];
}

export function Images(props: IImagesProps) {
  const swiperImageMainRef = useRef<any>(null);
  const swiperImagesRef = useRef<any>(null);

  const [activedIndex, setActivedIndex] = useState(0);

  return (
    <section className="flex flex-col xl:max-w-[382px]">
      {/* main image */}
      <div className="my-3 flex w-full justify-center">
        <Swiper
          ref={swiperImageMainRef}
          onSwiper={(swiper) => (swiperImageMainRef.current = swiper)}
          onSlideChange={(swiper) => {
            const newIndex = swiper.activeIndex;
            swiperImagesRef.current?.slideTo(newIndex);
            setActivedIndex(newIndex);
          }}
          slidesPerView={1}
          spaceBetween={8}
          className="container"
        >
          {props.images.map((item) => (
            <SwiperSlide key={item}>
              <div className="flex w-full justify-center rounded-lg border p-2">
                <Image
                  src={item}
                  alt={props.title.fa}
                  width={260}
                  height={260}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* images */}
      <div className="flex justify-center">
        <Swiper
          slidesPerView="auto"
          onSwiper={(swiper) => (swiperImagesRef.current = swiper)}
          spaceBetween={8}
          ref={swiperImagesRef}
          id="product-images-slider"
          className="container w-fit"
        >
          {props.images.map((item, index) => (
            <SwiperSlide key={item} className="!w-[70px] rounded-lg">
              <button
                onClick={() => {
                  setActivedIndex(index);
                  swiperImagesRef.current?.slideTo(index);
                  swiperImageMainRef.current?.slideTo(index);
                }}
                className={cn('rounded-lg border p-1.5 overflow-hidden', {
                  'border-gray-300': activedIndex === index,
                })}
              >
                <Image src={item} alt={props.title.fa} width={70} height={70} />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
