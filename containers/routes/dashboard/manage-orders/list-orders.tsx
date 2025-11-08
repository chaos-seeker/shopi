'use client';

import { getAllOrders } from '@/actions/order/get-all-orders';
import { TOrder } from '@/types/order';
import { useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<TOrder>();

export function ListOrders() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const result = await getAllOrders();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'شناسه سفارش',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('user', {
        header: 'نام و نام خانوادگی',
        cell: (info) => {
          const user = info.getValue();
          return user?.full_name || '-';
        },
      }),
      columnHelper.accessor('original_amount', {
        header: 'مبلغ',
        cell: (info) => {
          const originalAmount = info.getValue();
          return `${originalAmount.toLocaleString('fa-IR')} تومان`;
        },
      }),
      columnHelper.accessor('discount', {
        header: 'مقدار تخفیف',
        cell: (info) => {
          const discountValue = info.getValue();
          return discountValue > 0
            ? `${discountValue.toLocaleString('fa-IR')} تومان`
            : '-';
        },
      }),
      columnHelper.accessor('amount', {
        header: 'مبلغ نهایی',
        cell: (info) => `${info.getValue().toLocaleString('fa-IR')} تومان`,
      }),
      columnHelper.accessor('created_at', {
        header: 'تاریخ ثبت',
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString('fa-IR');
        },
      }),
    ],
    [],
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
        <p className="text-red-500">خطا در بارگذاری سفارش‌ها</p>
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
                  سفارشی یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
