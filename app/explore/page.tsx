import { BreadCrumb } from '@/components/bread-crumb';
import { CheckboxAccordions } from '@/containers/routes/explore/checkbox-accordions';
import { Products } from '@/containers/routes/explore/products';
import { Sort } from '@/containers/routes/explore/sort';
import { CategorySlider } from '@/containers/routes/global/category-slider';

export default function Page() {
  return (
    <div className="container relative z-10 flex size-full flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <BreadCrumb title="فروشگاه" />
        <span className="h-px grow bg-[#e6e9ee]" />
        <Sort />
      </div>
      <div className="flex lg:gap-3">
        <CheckboxAccordions />
        <div className="grid flex-1 gap-3">
          <CategorySlider />
          <Products />
        </div>
      </div>
    </div>
  );
}
