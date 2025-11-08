'use client';

import { getFilteredProducts } from '@/actions/product/get-filtered-products';
import { ProductCard } from '@/components/product-card';
import { useFiltersLoading } from '@/containers/routes/explore/filters-loading-context';
import { TProduct } from '@/types/product';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface ProductsProps {
  initialProducts: TProduct[];
}

export function Products({ initialProducts }: ProductsProps) {
  const searchParams = useSearchParams();
  const { isLoading: isLoadingFromContext, setLoading } = useFiltersLoading();
  const text = searchParams.get('text') || '';
  const sort =
    (searchParams.get('sort') as 'newest' | 'highest' | 'lowest') || 'newest';
  const filterCategory = searchParams.get('filter-category') || '';
  const filterBrand = searchParams.get('filter-brand') || '';

  const categoryIds =
    filterCategory?.split(',').map(Number).filter(Boolean) || [];
  const brandIds = filterBrand?.split(',').map(Number).filter(Boolean) || [];

  // Create a stable query key
  const queryKey = [
    'filtered-products',
    text,
    sort,
    [...categoryIds].sort().join(','),
    [...brandIds].sort().join(','),
  ].join('|');

  // Track initial query key from SSR (only set once on mount)
  const initialQueryKeyRef = useRef<string | null>(null);
  const previousQueryKeyRef = useRef<string | null>(null);

  if (initialQueryKeyRef.current === null) {
    initialQueryKeyRef.current = queryKey;
    previousQueryKeyRef.current = queryKey;
  }

  const isInitialQuery = queryKey === initialQueryKeyRef.current;

  // Detect when query key changes (filter/sort applied) and show loading immediately
  useEffect(() => {
    if (
      previousQueryKeyRef.current !== null &&
      previousQueryKeyRef.current !== queryKey &&
      !isInitialQuery
    ) {
      // Query key changed, ensure loading is shown
      setLoading(true);
    }
    previousQueryKeyRef.current = queryKey;
  }, [queryKey, isInitialQuery, setLoading]);

  const {
    data: productsResult,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const result = await getFilteredProducts({
        text: text || undefined,
        categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        brandIds: brandIds.length > 0 ? brandIds : undefined,
        sort: sort || 'newest',
      });
      // Reset loading state when query completes
      setLoading(false);
      return result;
    },
    initialData: isInitialQuery ? { data: initialProducts } : undefined,
    staleTime: 0,
    refetchOnMount: true,
  });

  // Reset loading when query completes
  useEffect(() => {
    if (!isLoading && !isFetching) {
      setLoading(false);
    }
  }, [isLoading, isFetching, setLoading]);

  const products = productsResult?.data || initialProducts;
  // Show loader immediately from context (set on click) or when fetching (not initial query)
  // Prioritize isLoadingFromContext for immediate feedback
  const showLoader =
    isLoadingFromContext || ((isLoading || isFetching) && !isInitialQuery);

  if (showLoader) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center rounded-xl border py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-red" size={48} />
          <p className="text-sm font-medium text-gray-500">
            در حال بارگذاری...
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center rounded-xl border py-24">
        <p className="text-gray-500">محصولی یافت نشد</p>
      </div>
    );
  }

  return (
    <section className="grid w-full grid-cols-1 overflow-hidden rounded-xl border-r border-t sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {products.map((item) => (
        <div key={item.id} className="border-b border-l">
          <ProductCard data={item} />
        </div>
      ))}
    </section>
  );
}
