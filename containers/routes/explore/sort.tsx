'use client';

import { useFiltersLoading } from '@/containers/routes/explore/filters-loading-context';
import { cn } from '@/utils/cn';
import { useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { startTransition, useEffect, useState } from 'react';

interface SortProps {
  initialSort?: 'newest' | 'highest' | 'lowest';
}

export function Sort({ initialSort = 'newest' }: SortProps) {
  const searchParams = useSearchParams();
  const { setLoading } = useFiltersLoading();
  const [sort, setSort] = useQueryState('sort', {
    defaultValue: initialSort,
    parse: (value) => (value as 'newest' | 'highest' | 'lowest') || initialSort,
    shallow: false,
  });

  const urlSort = searchParams.get('sort') || sort || initialSort;
  const [activeSort, setActiveSort] = useState<'newest' | 'highest' | 'lowest'>(
    urlSort as 'newest' | 'highest' | 'lowest',
  );

  useEffect(() => {
    if (urlSort) {
      setActiveSort(urlSort as 'newest' | 'highest' | 'lowest');
    }
  }, [urlSort]);

  const handleSort = (value: 'newest' | 'highest' | 'lowest') => {
    setActiveSort(value);
    setLoading(true);
    startTransition(() => {
      setSort(value);
    });
  };

  const currentSort = activeSort;

  const sortOptions: Array<{
    title: string;
    value: 'newest' | 'highest' | 'lowest';
  }> = [
    { title: 'جدید ترین', value: 'newest' },
    { title: 'گران ترین', value: 'highest' },
    { title: 'ارزان ترین', value: 'lowest' },
  ];

  return (
    <div>
      <ul className="flex gap-2 text-sm font-medium text-gray-500">
        {sortOptions.map((item) => (
          <li key={item.value} className="hover:text-green">
            <button
              className={cn({
                'text-green font-bold': currentSort === item.value,
              })}
              onClick={() => handleSort(item.value)}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
