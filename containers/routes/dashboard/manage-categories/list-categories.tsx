'use client';

import { getAllCategories } from '@/actions/category/get-all-categories';
import { TCategory } from '@/types/category';
import { useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<TCategory>();

interface IListCategoriesProps {
  onEditClick?: (categoryId: number) => void;
  onDeleteClick?: (categoryId: number) => void;
}

export function ListCategories({
  onEditClick,
  onDeleteClick,
}: IListCategoriesProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const result = await getAllCategories();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('image', {
        header: 'تصویر',
        cell: (info) => (
          <div className="relative h-16 w-16 overflow-hidden rounded-md">
            <Image
              src={info.getValue()}
              alt="category"
              fill
              className="object-cover"
            />
          </div>
        ),
      }),
      columnHelper.accessor('name_fa', {
        header: 'نام فارسی',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('name_en', {
        header: 'نام انگلیسی',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('slug', {
        header: 'اسلاگ',
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'عملیات',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditClick?.(info.row.original.id)}
              className="rounded-md bg-blue-500 p-2 text-white"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDeleteClick?.(info.row.original.id)}
              className="rounded-md bg-red p-2 text-white"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      }),
    ],
    [onEditClick, onDeleteClick],
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-500">خطا در بارگذاری دسته‌بندی‌ها</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap px-4 py-3 text-sm text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-gray-500"
                >
                  دسته‌بندی‌ای یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
