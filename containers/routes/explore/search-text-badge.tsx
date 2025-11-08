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
    <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
      <span>{text}</span>
      <button
        onClick={handleRemove}
        className="flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors p-0.5"
        aria-label="حذف جستجو"
      >
        <X size={14} className="text-gray-600" />
      </button>
    </div>
  );
}

