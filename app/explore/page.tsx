import { getAllBrands } from '@/actions/brand/get-all-brands';
import { getAllCategories } from '@/actions/category/get-all-categories';
import { getFilteredProducts } from '@/actions/product/get-filtered-products';
import { BreadCrumb } from '@/components/bread-crumb';
import { CheckboxAccordions } from '@/containers/routes/explore/checkbox-accordions';
import { FiltersLoadingProvider } from '@/containers/routes/explore/filters-loading-context';
import { Products } from '@/containers/routes/explore/products';
import { Sort } from '@/containers/routes/explore/sort';

interface PageProps {
  searchParams: {
    text?: string;
    sort?: 'newest' | 'highest' | 'lowest';
    'filter-category'?: string;
    'filter-brand'?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const text = searchParams.text || '';
  const sort = searchParams.sort || 'newest';
  const filterCategory = searchParams['filter-category'] || '';
  const filterBrand = searchParams['filter-brand'] || '';

  const categoryIds =
    filterCategory?.split(',').map(Number).filter(Boolean) || [];
  const brandIds = filterBrand?.split(',').map(Number).filter(Boolean) || [];

  const [productsResult, categoriesResult, brandsResult] = await Promise.all([
    getFilteredProducts({
      text: text || undefined,
      categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
      brandIds: brandIds.length > 0 ? brandIds : undefined,
      sort: sort || 'newest',
    }),
    getAllCategories(),
    getAllBrands(),
  ]);

  const initialProducts = productsResult?.data || [];
  const categories = categoriesResult?.data || [];
  const brands = brandsResult?.data || [];

  return (
    <FiltersLoadingProvider>
      <div className="container relative z-10 flex size-full flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <BreadCrumb title="فروشگاه" />
          <span className="h-px grow bg-[#e6e9ee]" />
          <Sort initialSort={sort} />
        </div>
        <div className="flex lg:gap-3">
          <CheckboxAccordions categories={categories} brands={brands} />
          <div className="grid flex-1 gap-3">
            <Products initialProducts={initialProducts} />
          </div>
        </div>
      </div>
    </FiltersLoadingProvider>
  );
}
