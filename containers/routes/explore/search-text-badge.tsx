'use client';

import { useFiltersLoading } from '@/containers/routes/explore/filters-loading-context';
import { X } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { startTransition } from 'react';

export function SearchTextBadge() {
  const { setLoading } = useFiltersLoading();
  const [text, setText] = useQueryState('text', {
    defaultValue: '',
    shallow: false,
  });

  if (!text) {
    return null;
  }

  const handleRemove = () => {
    setLoading(true);
    startTransition(() => {
      setText(null);
    });
  };

  return (
    <section className="rounded-lg border lg:rounded-xl">
      <div className="flex items-center justify-between p-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className="text-sm text-gray-900 lg:text-smp truncate flex-1"
            title={text}
          >
            {text}
          </span>
        </div>
        <button
          onClick={handleRemove}
          className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors p-1 flex-shrink-0"
          aria-label="حذف جستجو"
          type="button"
        >
          <X size={16} className="text-gray-600" />
        </button>
      </div>
    </section>
  );
}
