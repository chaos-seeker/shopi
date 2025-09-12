'use client';

import { useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

export function Sort() {
  const searchParams = useSearchParams();
  const querySort = searchParams.get('sort') || 'newest';
  const [, setNuqsStateSort] = useQueryState('sort');
  const [activedSort, setActivedSort] = useState(querySort);
  useEffect(() => {
    setActivedSort(querySort);
  }, [querySort]);

  const handleSort = (value: string) => {
    setNuqsStateSort(value);
  };

  return (
    <div>
      <ul className="flex gap-2 text-sm font-medium text-gray-500">
        {[
          { title: 'جدید ترین', value: 'newest' },
          { title: 'گران ترین', value: 'highest' },
          { title: 'ارزان ترین', value: 'lowest' },
        ].map((item) => (
          <li key={item.value} className="hover:text-green">
            <button
              className={cn({
                'text-green font-bold': activedSort === item.value,
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
