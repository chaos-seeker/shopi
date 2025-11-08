'use client';

import { userSlice } from '@/slices/user';
import { useKillua } from 'killua';
import { LogOut, Package, User } from 'lucide-react';
import toast from 'react-hot-toast';

export function ProfileSidebar() {
  const user = useKillua(userSlice);
  const userData = user.get();

  const handleLogout = () => {
    user.reducers.logout();
    toast.success('با موفقیت خارج شدید');
    window.location.href = '/';
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-white p-4">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <User className="text-gray-600" size={24} />
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-gray-900">{userData.full_name}</p>
          <p className="text-sm text-gray-500">@{userData.username}</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-900">
        <Package size={18} />
        <span>سفارش‌های من</span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 rounded-lg bg-red px-4 py-2 font-medium text-white transition-colors hover:bg-red/90"
      >
        <LogOut size={18} />
        <span>خروج</span>
      </button>
    </div>
  );
}
