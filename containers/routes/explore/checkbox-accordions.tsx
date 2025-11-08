'use client';

import { ToggleSection } from '@/components/toggle-section';
import { useFiltersLoading } from '@/containers/routes/explore/filters-loading-context';
import { SearchTextBadge } from '@/containers/routes/explore/search-text-badge';
import { useToggleUrlState } from '@/hooks/toggle-url-state';
import { TBrand } from '@/types/brand';
import { TCategory } from '@/types/category';
import { cn } from '@/utils/cn';
import { Check, ChevronDown } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { startTransition, useState } from 'react';

interface CheckboxAccordionsProps {
  categories: TCategory[];
  brands: TBrand[];
}

export function CheckboxAccordions({
  categories,
  brands,
}: CheckboxAccordionsProps) {
  const filterToggleUrlState = useToggleUrlState('filter');

  return (
    <div className="lg:relative">
      <div className="sticky top-3 flex flex-col gap-3 overflow-y-auto">
        <div className="hidden min-w-64 lg:block">
          <div className="flex flex-col gap-3">
            <SearchTextBadge />
            <CategoriesAccordion categories={categories} />
            <BrandsAccordion brands={brands} />
          </div>
        </div>
      </div>
      <ToggleSection
        title="فیلتر"
        isShow={filterToggleUrlState.isShow}
        onClose={() => filterToggleUrlState.hide()}
        className="absolute left-0 top-0 z-50 w-screen"
      >
        <div className="flex flex-col gap-2.5 p-2.5">
          <div className="flex flex-col gap-3">
            <SearchTextBadge />
            <CategoriesAccordion categories={categories} />
            <BrandsAccordion brands={brands} />
          </div>
        </div>
      </ToggleSection>
    </div>
  );
}

interface CategoriesAccordionProps {
  categories: TCategory[];
}

const CategoriesAccordion = ({ categories }: CategoriesAccordionProps) => {
  const [isShow, setIsShow] = useState(true);

  return (
    <section className="rounded-lg border lg:rounded-xl">
      <button
        onClick={() => setIsShow((prev) => !prev)}
        className="flex w-full items-center justify-between p-2.5 text-smp font-medium"
      >
        <p className="text-sm text-gray-600 lg:text-smp">دسته‌بندی</p>
        <ChevronDown
          size={18}
          className={cn('transition-all', {
            'rotate-180': isShow,
          })}
        />
      </button>
      <div
        className={cn('h-0 opacity-0 transition-all overflow-hidden', {
          'h-auto opacity-100': isShow,
        })}
      >
        <div className="flex flex-col gap-1.5 border-t p-2.5">
          {categories.length > 0 ? (
            categories.map((category) => (
              <CheckboxItem
                key={category.id}
                slug={category.slug}
                text={category.name_fa}
                query="category"
              />
            ))
          ) : (
            <p className="py-2 text-center text-xs text-gray-400">
              دسته‌بندی یافت نشد
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

interface BrandsAccordionProps {
  brands: TBrand[];
}

const BrandsAccordion = ({ brands }: BrandsAccordionProps) => {
  const [isShow, setIsShow] = useState(true);

  return (
    <section className="rounded-lg border lg:rounded-xl">
      <button
        onClick={() => setIsShow((prev) => !prev)}
        className="flex w-full items-center justify-between p-2.5 text-smp font-medium"
      >
        <p className="text-sm text-gray-600 lg:text-smp">برند</p>
        <ChevronDown
          size={18}
          className={cn('transition-all', {
            'rotate-180': isShow,
          })}
        />
      </button>
      <div
        className={cn('h-0 opacity-0 transition-all overflow-hidden', {
          'h-auto opacity-100': isShow,
        })}
      >
        <div className="flex flex-col gap-1.5 border-t p-2.5">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <CheckboxItem
                key={brand.id}
                slug={brand.slug}
                text={brand.name_fa}
                query="brand"
              />
            ))
          ) : (
            <p className="py-2 text-center text-xs text-gray-400">
              برند یافت نشد
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

interface ICheckboxItemProps {
  slug: string;
  text: string;
  query: 'category' | 'brand';
}

const CheckboxItem = ({ slug, text, query }: ICheckboxItemProps) => {
  const { setLoading } = useFiltersLoading();
  const queryKey = `${query}`;
  const [filterValue, setFilterValue] = useQueryState(queryKey, {
    defaultValue: '',
    shallow: false,
  });

  const selectedSlugs = filterValue?.split(',').filter(Boolean) || [];
  const isChecked = selectedSlugs.includes(slug);

  const handleCheck = () => {
    // Show loading immediately before URL update
    setLoading(true);
    // Use startTransition to make URL update non-blocking
    startTransition(() => {
      if (isChecked) {
        const updated = selectedSlugs.filter(
          (selectedSlug) => selectedSlug !== slug,
        );
        setFilterValue(updated.length > 0 ? updated.join(',') : null);
      } else {
        const updated = [...selectedSlugs, slug];
        setFilterValue(updated.join(','));
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCheck}
        className={cn(
          'size-[18px] rounded-md border transition-all border-gray-200 bg-gray flex items-center justify-center',
          { 'bg-green': isChecked },
        )}
      >
        {isChecked ? <Check className="stroke-white p-0.5" size={14} /> : null}
      </button>
      <p className="text-xsp text-gray-600 lg:text-smp">{text}</p>
    </div>
  );
};
