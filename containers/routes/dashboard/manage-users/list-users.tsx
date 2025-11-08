'use client';

import { getAllUsers } from '@/actions/user/get-all-users';
import { TUser } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<TUser>();

export function ListUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const result = await getAllUsers();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('full_name', {
        header: 'نام و نام خانوادگی',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('username', {
        header: 'نام کاربری',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('created_at', {
        header: 'تاریخ ایجاد',
        cell: (info) => {
          const dateValue = info.getValue();
          if (!dateValue) return '-';
          const date = new Date(dateValue);
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
        <p className="text-red-500">خطا در بارگذاری کاربران</p>
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
                  کاربری یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
