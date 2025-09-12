'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ProductCardFooter } from '@/components/product-card-footer';
import { useShuffledArray } from '@/hooks/shuffle-array';
import { productsData } from '@/resources/products';
import { TProduct } from '@/types/product';
import { cn } from '@/utils/cn';

export function HeroOfferSlider() {
  const shuffledProductsData = useShuffledArray(productsData);
  const swiperRef = useRef<any>(null);

  return (
    <section className="group/section relative z-10 col-span-full overflow-hidden xl:col-span-1">
      {/* slider */}
      <div className="bg-white">
        <Swiper
          slidesPerView="auto"
          spaceBetween={13}
          ref={swiperRef}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          id="hero-offer-slider"
          breakpoints={{
            1024: {
              slidesPerView: 1,
            },
          }}
        >
          {shuffledProductsData.map((item) => {
            return (
              <SwiperSlide
                key={item.id}
                className="!w-[268px] rounded-xl bg-red xl:size-full xl:!h-[372px] xl:!w-[297px]"
              >
                <div className="flex !h-[380px] flex-col items-center justify-center p-5 xl:pb-10">
                  {/* navigation - desktop */}
                  <NavigationDesktop swiperRef={swiperRef} />
                  {/* timer */}
                  <Timer />
                  {/* image / title */}
                  <Link
                    href={item.path}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="relative size-[175px] bg-[url('/images/routes/home/hero-offer-slider-wave-bg.svg')] bg-center bg-no-repeat">
                      <Image src={item.images[0]} alt={item.title.fa} fill />
                    </div>
                    <p className="line-clamp-2 font-bold text-white">
                      {item.title.fa}
                    </p>
                  </Link>
                  {/* price/actions */}
                  <ProductCardFooter
                    data={item}
                    type="offer-slider"
                    priceComponent={<OfferSliderCardPrice item={item} />}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <NavigationMobile swiperRef={swiperRef} />
    </section>
  );
}

function OfferSliderCardPrice({ item }: { item: TProduct }) {
  return (
    <div>
      <del className="absolute bottom-8 left-20 text-smp text-gray-50">
        {item.priceWithDiscount.toLocaleString('fa-IR')}
      </del>
      <div>
        <p className="absolute bottom-1 left-8 text-2xl font-bold text-white">
          {item.priceWithoutDiscount.toLocaleString('fa-IR')}
        </p>
        <p className="absolute bottom-5 left-2 -rotate-90 text-xs font-bold text-white">
          تومان
        </p>
        <div className="absolute bottom-9 left-8 flex h-[22px] gap-1 rounded-full rounded-bl-none bg-white px-2">
          <p className="pt-0.5 font-bold text-red">{item.discount}</p>
          <p className="pt-1 text-sm font-bold text-red">%</p>
        </div>
      </div>
    </div>
  );
}

interface INavigationProps {
  swiperRef: any;
}

const NavigationDesktop = (props: INavigationProps) => {
  return (
    <div className="hidden xl:block">
      <div className="absolute left-4 top-4 flex w-fit gap-2">
        <button
          className="group/navigation_btn flex size-6 items-center justify-center rounded-md bg-white"
          onClick={() => props.swiperRef.current.swiper.slidePrev()}
        >
          <HiChevronRight className="fill-gray-600 group-hover/navigation_btn:fill-gray-900" />
        </button>
        <button
          className="group/navigation_btn flex size-6 items-center justify-center rounded-md bg-white"
          onClick={() => props.swiperRef.current.swiper.slideNext()}
        >
          <HiChevronLeft className="fill-gray-600 group-hover/navigation_btn:fill-gray-900" />
        </button>
      </div>
    </div>
  );
};

const NavigationMobile = (props: INavigationProps) => {
  return (
    <div className="hidden w-fit gap-2 transition-all group-hover/section:flex">
      <button
        className="group/navigation_btn absolute bottom-0 right-1 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg border bg-white xl:hidden xl:size-9"
        onClick={() => props.swiperRef.current.swiper.slideNext()}
      >
        <HiChevronRight className="size-4 fill-gray-600 group-hover/navigation_btn:fill-gray-900" />
      </button>
      <button
        className="group/navigation_btn absolute bottom-0 left-1 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg border bg-white xl:hidden xl:size-9"
        onClick={() => props.swiperRef.current.swiper.slidePrev()}
      >
        <HiChevronLeft className="size-4 fill-gray-600 group-hover/navigation_btn:fill-gray-900" />
      </button>
    </div>
  );
};

const Timer = () => {
  // countdown timer
  const [timeLeftFromDay, setTimeLeftFromDay] = useState([0, 0, 0]);
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime: any = new Date();
      const endOfDay: any = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const timeDiff = endOfDay - currentTime;
      const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeDiff / (1000 * 60)) % 60);
      const secondsLeft = Math.floor((timeDiff / 1000) % 60);
      setTimeLeftFromDay([hoursLeft, minutesLeft, secondsLeft]);
      if (timeDiff < 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute right-4 top-4">
      <div
        className={cn(
          'flex items-center gap-1 transition-all invisible opacity-0',
          {
            'visible opacity-100': timeLeftFromDay,
          },
        )}
      >
        <div className="flex size-7 items-center justify-center rounded-md bg-gray-600/30 p-3 text-sm font-bold text-white">
          {String(timeLeftFromDay[2]).padStart(2, '0')}
        </div>
        <p className="font-black text-white">:</p>
        <div className="flex size-7 items-center justify-center rounded-md bg-gray-600/30 p-3 text-sm font-bold text-white">
          {String(timeLeftFromDay[1]).padStart(2, '0')}
        </div>
        <p className="font-black text-white">:</p>
        <div className="flex size-7 items-center justify-center rounded-md bg-gray-600/30 p-3 text-sm font-bold text-white">
          {String(timeLeftFromDay[0]).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};
