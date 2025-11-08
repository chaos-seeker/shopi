import { getAllBrands } from '@/actions/brand/get-all-brands';
import { getAllCategories } from '@/actions/category/get-all-categories';
import { getFilteredProducts } from '@/actions/product/get-filtered-products';
import { BreadCrumb } from '@/components/bread-crumb';
import { CheckboxAccordions } from '@/containers/routes/explore/checkbox-accordions';
import { FiltersLoadingProvider } from '@/containers/routes/explore/filters-loading-context';
import { Products } from '@/containers/routes/explore/products';
import { SearchTextBadge } from '@/containers/routes/explore/search-text-badge';
import { Sort } from '@/containers/routes/explore/sort';

interface PageProps {
  searchParams: {
    text?: string;
    sort?: 'newest' | 'highest' | 'lowest';
    'category'?: string;
    'brand'?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const text = searchParams.text || '';
  const sort = searchParams.sort || 'newest';
  const filterCategory = searchParams['category'] || '';
  const filterBrand = searchParams['brand'] || '';

  const categorySlugs = filterCategory?.split(',').filter(Boolean) || [];
  const brandSlugs = filterBrand?.split(',').filter(Boolean) || [];

  const [productsResult, categoriesResult, brandsResult] = await Promise.all([
    getFilteredProducts({
      text: text || undefined,
      categorySlugs: categorySlugs.length > 0 ? categorySlugs : undefined,
      brandSlugs: brandSlugs.length > 0 ? brandSlugs : undefined,
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
          <div className="flex items-center gap-3">
            <SearchTextBadge />
            <Sort initialSort={sort} />
          </div>
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
