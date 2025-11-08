'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import { getAllProducts } from '@/actions/product/get-all-products';
import { ProductCard } from '@/components/product-card';
import { SliderNavigation } from '@/components/slider-navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface IProductSliderProps {
  title: string;
  path: string;
}

export function ProductSlider(props: IProductSliderProps) {
  const swiperRef = useRef<any>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const result = await getAllProducts();
      if (result.error) throw new Error(result.error);
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const shuffledProducts = products
    ? [...products].sort(() => Math.random() - 0.5).slice(0, 10)
    : [];

  return (
    <section className="group/section container relative z-10 col-span-full flex flex-col gap-5 overflow-hidden">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-gray-600">{props.title}</h2>
        <span className="h-px grow bg-[#e6e9ee]" />
        <Link
          href={props.path}
          className="flex gap-1 text-sm font-bold transition-all hover:text-red"
        >
          <span>مشاهده همه</span>
          <ChevronLeft className="size-4" />
        </Link>
      </div>
      <div>
        <div className="bg-white">
          {isLoading ? null : (
            // @ts-ignore - Swiper types incompatibility with React 19
            <Swiper
              slidesPerView="auto"
              spaceBetween={13}
              ref={swiperRef}
              modules={[Autoplay]}
              id="product-slider"
            >
              {shuffledProducts.map((item) => {
                return (
                  // @ts-ignore - SwiperSlide types incompatibility with React 19
                  <SwiperSlide
                    key={item.id}
                    className="!w-[268px] rounded-xl border bg-white transition-all hover:border-gray-300"
                  >
                    <ProductCard data={item} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
        {!isLoading && <SliderNavigation swiperRef={swiperRef} />}
      </div>
    </section>
  );
}
