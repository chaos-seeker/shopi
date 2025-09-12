import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

interface ISliderNavigationProps {
  swiperRef: any;
}

export function SliderNavigation(props: ISliderNavigationProps) {
  return (
    <div className="group/navigation top-4 hidden w-fit gap-2 transition-all group-hover/section:flex">
      <button
        className="group/navigation_btn absolute bottom-0 left-1 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg border bg-white"
        onClick={() => props.swiperRef.current.swiper.slideNext()}
      >
        <HiChevronLeft className="size-4 fill-gray-600 group-hover/category-slider_navigation_btn:fill-gray-900" />
      </button>
      <button
        className="group/navigation_btn absolute bottom-0 right-1 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg border bg-white"
        onClick={() => props.swiperRef.current.swiper.slidePrev()}
      >
        <HiChevronRight className="size-4 fill-gray-600 group-hover/category-slider_navigation_btn:fill-gray-900" />
      </button>
    </div>
  );
}
