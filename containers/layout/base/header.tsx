'use client';

import { createOrder } from '@/actions/order/create-order';
import { ToggleSection } from '@/components/toggle-section';
import { useToggleUrlState } from '@/hooks/toggle-url-state';
import { cartSlice } from '@/slices/cart';
import { userSlice } from '@/slices/user';
import { cn } from '@/utils/cn';
import { useKillua } from 'killua';
import {
  Filter,
  LayoutGrid,
  Search,
  ShoppingCart,
  Trash2,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function Header() {
  return (
    <header className="mb-3">
      <Mobile />
      <Desktop />
    </header>
  );
}

const Mobile = () => {
  return (
    <div className="container lg:hidden">
      <div className="border-b py-3">
        <MobileTop />
        <MobileBottom />
      </div>
    </div>
  );
};

const MobileTop = () => {
  return (
    <div className="flex justify-between pb-2">
      <MobileTopAuth />
      <MobileTopLogo />
    </div>
  );
};

const MobileTopLogo = () => {
  return (
    <Link href="/">
      <Image
        src="/images/templates/base/header-logo-mobile.svg"
        alt="لوگو"
        width={80}
        height={20}
      />
    </Link>
  );
};

const MobileBottom = () => {
  return (
    <div className="flex items-center justify-between border-t pt-3">
      <MobileBottomSearch />
      <div className="flex items-center gap-2">
        <MobileBottomFilter />
        <MobileBottomDashboard />
        <MobileBottomCart />
      </div>
    </div>
  );
};

const MobileTopAuth = () => {
  const user = useKillua(userSlice);
  const userData = user.get();

  return (
    <Link href={userData ? '/profile' : '/auth'}>
      <User size={22} />
    </Link>
  );
};

const MobileBottomSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (query) {
      router.push(`/explore?text=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div>
      <div className="flex items-center">
        <button onClick={handleSearch} type="button">
          <Search size={20} />
        </button>
        <input
          type="text"
          placeholder="جستجوی محصول"
          className="px-2.5 text-sm font-bold placeholder:text-xsp"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(e as any);
            }
          }}
        />
      </div>
    </div>
  );
};

const MobileBottomCart = () => {
  const mobileCartToggleUrlState = useToggleUrlState('mobile-cart');
  const localstorageCart = useKillua(cartSlice);
  const user = useKillua(userSlice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();

    const userData = user.get();
    if (!userData) {
      toast.error('لطفا وارد حساب کاربری خود شوید');
      mobileCartToggleUrlState.hide();
      return;
    }

    const cartItems = localstorageCart.get();
    if (cartItems.length === 0) {
      toast.error('سبد خرید شما خالی است');
      return;
    }

    setIsSubmitting(true);
    try {
      const totalPrice = localstorageCart.selectors.totalPrice();
      const totalDiscount = localstorageCart.selectors.totalDiscount();
      // Calculate original amount (before discount)
      const originalAmount = totalPrice + totalDiscount;
      // Round all values to 2 decimal places
      const roundedOriginalAmount = Math.round(originalAmount * 100) / 100;
      const roundedDiscount = Math.round(totalDiscount * 100) / 100;
      const roundedAmount = Math.round(totalPrice * 100) / 100;
      const result = await createOrder({
        user: userData,
        original_amount: roundedOriginalAmount,
        discount: roundedDiscount,
        amount: roundedAmount,
      });

      if (result.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      toast.success('سفارش با موفقیت ثبت شد');
      localstorageCart.set([]);
      mobileCartToggleUrlState.hide();
      setIsSubmitting(false);
    } catch {
      toast.error('خطایی در ثبت سفارش رخ داد');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={() => mobileCartToggleUrlState.show()}
        className="relative pr-1.5"
      >
        <ShoppingCart size={22} />
        <p className="absolute -top-1.5 right-0.5 flex h-3.5 items-center justify-center rounded-[3px] bg-red px-[3px] text-[11px] font-bold text-white">
          {localstorageCart.selectors.totalItems()}
        </p>
      </button>
      <ToggleSection
        title="سبد خرید"
        isShow={mobileCartToggleUrlState.isShow}
        onClose={() => mobileCartToggleUrlState.hide()}
        className="absolute left-0 top-[110px] z-50 h-4 w-screen"
      >
        {localstorageCart.selectors.isEmpty() ? (
          <div className="flex flex-col items-center py-3">
            <Image
              src="/images/templates/base/empty-cart.svg"
              height={125}
              width={125}
              alt="سبد خرید خالی"
            />
            <p className="text-smp font-medium">سبد خرید خالی است!</p>
          </div>
        ) : (
          <div>
            {localstorageCart.get().map((item) => (
              <div
                key={item.id}
                className="relative mt-3 flex items-center gap-5 px-3"
              >
                <button
                  className="absolute top-0 rounded-md bg-red p-[3px]"
                  onClick={() => localstorageCart.reducers.remove(item)}
                >
                  <X size={15} className="stroke-white" />
                </button>
                <Image
                  alt={item.name_fa}
                  src={
                    item.gallery && item.gallery.length > 0
                      ? item.gallery[0]
                      : ''
                  }
                  width={60}
                  height={60}
                />
                <div className="mb-4 w-full">
                  <p className="mb-2 text-smp font-bold">{item.name_fa}</p>
                  <div className="relative flex flex-col items-end">
                    <div className="flex w-24 justify-between rounded-lg border bg-white px-3 py-1.5 font-bold text-gray-700">
                      <button
                        onClick={() =>
                          localstorageCart.reducers.increment(item)
                        }
                        disabled={
                          !localstorageCart.selectors.canIncrement(item)
                        }
                        className={cn({
                          'opacity-50 cursor-not-allowed':
                            !localstorageCart.selectors.canIncrement(item),
                        })}
                      >
                        +
                      </button>
                      <p>{localstorageCart.selectors.quantity(item)}</p>
                      {localstorageCart.selectors.isOne(item) ? (
                        <button
                          onClick={() => localstorageCart.reducers.remove(item)}
                        >
                          <Trash2 size={16} className="stroke-gray-700" />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            localstorageCart.reducers.decrement(item)
                          }
                          className="text-gray-700"
                        >
                          -
                        </button>
                      )}
                    </div>
                    <div className="flex">
                      {(() => {
                        const price = item.price ?? 0;
                        const discount = item.discount ?? 0;
                        const priceWithDiscount = price * (1 - discount / 100);
                        return (
                          <>
                            <del
                              className={cn(
                                'absolute bottom-[20px] left-[118px] text-sm text-gray-400',
                                {
                                  hidden: Boolean(discount === 0),
                                },
                              )}
                            >
                              {price.toLocaleString('fa-IR')}
                            </del>
                            <p className="absolute bottom-3 left-[100px] -rotate-90 text-[10px] font-bold text-black/40">
                              تومان
                            </p>
                            <p className="absolute bottom-0 left-[120px] text-lg font-bold text-black">
                              {priceWithDiscount.toLocaleString('fa-IR')}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                    <div
                      className={cn(
                        'absolute bottom-2 left-[210px] flex h-[22px] gap-1 rounded-md bg-red px-2',
                        {
                          hidden: Boolean((item.discount ?? 0) === 0),
                        },
                      )}
                    >
                      <p className="pt-0.5 text-xsp font-bold text-white">
                        {item.discount ?? 0}
                      </p>
                      <p className="pt-1 text-xs font-bold text-white">%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t py-3">
              <div className="relative flex w-fit flex-col px-4">
                <p className="text-xsp font-bold">مبلغ قابل پرداخت</p>
                <p className="text-xl font-bold text-black">
                  {localstorageCart.selectors
                    .totalPrice()
                    .toLocaleString('fa-IR')}
                </p>
                <p className="absolute -left-1 bottom-3 -rotate-90 text-[10px] font-bold text-black/40">
                  تومان
                </p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="ml-4 rounded-lg bg-red px-4 py-2 text-white disabled:opacity-50"
              >
                {isSubmitting ? 'در حال ثبت...' : 'ثبت سفارش'}
              </button>
            </div>
          </div>
        )}
      </ToggleSection>
    </div>
  );
};

const MobileBottomFilter = () => {
  const filterToggleUrlState = useToggleUrlState('filter');
  const pathname = usePathname();

  if (pathname !== '/explore') return;

  return (
    <button
      onClick={() => filterToggleUrlState.show()}
      className="relative border-l pl-1 pr-2"
    >
      <Filter size={20} />
    </button>
  );
};

const MobileBottomDashboard = () => {
  const handleDashboardClick = () => {
    window.location.href = '/dashboard/manage-products';
  };

  return (
    <button onClick={handleDashboardClick} className="relative pr-1.5">
      <LayoutGrid size={22} />
    </button>
  );
};

const Desktop = () => {
  return (
    <div className="container hidden flex-col py-3 lg:flex">
      <DesktopTop />
      <DesktopBottom />
    </div>
  );
};

const DesktopTop = () => {
  return (
    <div className="relative mb-8 mt-6 flex">
      <DesktopTopAuth />
      <DesktopTopLogo />
      <DesktopTopCall />
    </div>
  );
};

const DesktopTopAuth = () => {
  const user = useKillua(userSlice);
  const userData = user.get();

  return (
    <Link
      href={userData ? '/profile' : '/auth'}
      className="group flex items-center gap-1 text-black transition-all hover:text-red"
    >
      <User className="size-5 lg:size-6" />
      <span className="font-bold">
        {userData ? userData.full_name : 'وارد شوید'}
      </span>
    </Link>
  );
};

const DesktopTopCall = () => {
  return (
    <Link
      href="tel:021-12345678"
      className="absolute left-52 flex items-center gap-1"
    >
      <p className="text-lg font-bold text-red">12345678</p>
      <p className="text-xs font-bold text-gray-400">021</p>
    </Link>
  );
};

const DesktopTopLogo = () => {
  return (
    <div>
      <Link href="/">
        <Image
          src="/images/templates/base/header-logo-desktop.svg"
          alt="لوگو"
          width={130}
          height={80}
          className="absolute left-0 z-10"
        />
      </Link>
      <Image
        src="/images/templates/base/bg-logo-wave.png"
        alt="لوگو"
        width={350}
        height={130}
        className="absolute left-0"
      />
    </div>
  );
};

const DesktopBottom = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <DesktopBottomCart />
      </div>
      <div className="ml-48 flex gap-4 items-stretch">
        <DesktopBottomSearch />
        <DesktopBottomDashboard />
      </div>
    </div>
  );
};

const DesktopBottomDashboard = () => {
  const handleDashboardClick = () => {
    window.location.href = '/dashboard/manage-products';
  };

  return (
    <button
      onClick={handleDashboardClick}
      className="flex items-center relative z-10 justify-center rounded-2xl bg-red px-4 text-white font-bold transition-all hover:bg-red/90 self-stretch"
    >
      داشبورد
    </button>
  );
};

const DesktopBottomCart = () => {
  const desktopCartToggleUrlState = useToggleUrlState('desktop-cart');
  const localstorageCart = useKillua(cartSlice);
  const user = useKillua(userSlice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();

    const userData = user.get();
    if (!userData) {
      toast.error('لطفا وارد حساب کاربری خود شوید');
      desktopCartToggleUrlState.hide();
      return;
    }

    const cartItems = localstorageCart.get();
    if (cartItems.length === 0) {
      toast.error('سبد خرید شما خالی است');
      return;
    }

    setIsSubmitting(true);
    try {
      const totalPrice = localstorageCart.selectors.totalPrice();
      const totalDiscount = localstorageCart.selectors.totalDiscount();
      // Calculate original amount (before discount)
      const originalAmount = totalPrice + totalDiscount;
      // Round all values to 2 decimal places
      const roundedOriginalAmount = Math.round(originalAmount * 100) / 100;
      const roundedDiscount = Math.round(totalDiscount * 100) / 100;
      const roundedAmount = Math.round(totalPrice * 100) / 100;
      const result = await createOrder({
        user: userData,
        original_amount: roundedOriginalAmount,
        discount: roundedDiscount,
        amount: roundedAmount,
      });

      if (result.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      toast.success('سفارش با موفقیت ثبت شد');
      localstorageCart.set([]);
      desktopCartToggleUrlState.hide();
      setIsSubmitting(false);
    } catch {
      toast.error('خطایی در ثبت سفارش رخ داد');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => desktopCartToggleUrlState.show()}
      onMouseLeave={() => desktopCartToggleUrlState.hide()}
    >
      <button className="flex items-center justify-between gap-3 rounded-xl border p-3.5">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-gray-700" size={24} />
          <p className="font-bold text-gray-700">سبد خرید</p>
        </div>
        <p className="flex size-6 items-center justify-center rounded-full bg-red font-bold text-white">
          {localstorageCart.selectors.totalItems()}
        </p>
      </button>
      <div
        className={cn(
          'absolute z-50 right-0 top-[70px] w-[400px] transition-all',
          {
            show: desktopCartToggleUrlState.isShow,
            hide: !desktopCartToggleUrlState.isShow,
          },
        )}
      >
        <div className="rounded-2xl border bg-white">
          {localstorageCart.selectors.isEmpty() ? (
            <div className="flex flex-col items-center py-3">
              <Image
                src="/images/templates/base/empty-cart.svg"
                height={125}
                width={125}
                alt="سبد خرید خالی"
              />
              <p className="text-smp font-medium">سبد خرید خالی است!</p>
            </div>
          ) : (
            <div>
              {localstorageCart.get().map((item) => (
                <div
                  key={item.id}
                  className="relative mt-3 flex items-center gap-5 px-3"
                >
                  <button
                    className="absolute top-0 rounded-md bg-red p-[3px]"
                    onClick={() => localstorageCart.reducers.remove(item)}
                  >
                    <X size={15} className="stroke-white" />
                  </button>
                  <Image
                    alt={item.name_fa}
                    src={
                      item.gallery && item.gallery.length > 0
                        ? item.gallery[0]
                        : ''
                    }
                    width={60}
                    height={60}
                  />
                  <div className="mb-4 w-full">
                    <p className="mb-2 text-smp font-bold">{item.name_fa}</p>
                    <div className="relative flex flex-col items-end">
                      <div className="flex w-24 justify-between rounded-lg border bg-white px-3 py-1.5 font-bold text-gray-700">
                        <button
                          onClick={() =>
                            localstorageCart.reducers.increment(item)
                          }
                        >
                          +
                        </button>
                        <p>{localstorageCart.selectors.quantity(item)}</p>
                        {localstorageCart.selectors.isOne(item) ? (
                          <button
                            onClick={() =>
                              localstorageCart.reducers.remove(item)
                            }
                          >
                            <Trash2 size={16} className="stroke-gray-700" />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              localstorageCart.reducers.decrement(item)
                            }
                            className="text-gray-700"
                          >
                            -
                          </button>
                        )}
                      </div>
                      <div className="flex">
                        {(() => {
                          const price = item.price ?? 0;
                          const discount = item.discount ?? 0;
                          const priceWithDiscount =
                            price * (1 - discount / 100);
                          return (
                            <>
                              <del
                                className={cn(
                                  'absolute bottom-[20px] left-[118px] text-sm text-gray-400',
                                  {
                                    hidden: Boolean(discount === 0),
                                  },
                                )}
                              >
                                {price.toLocaleString('fa-IR')}
                              </del>
                              <p className="absolute bottom-3 left-[100px] -rotate-90 text-[10px] font-bold text-black/40">
                                تومان
                              </p>
                              <p className="absolute bottom-0 left-[120px] text-lg font-bold text-black">
                                {priceWithDiscount.toLocaleString('fa-IR')}
                              </p>
                            </>
                          );
                        })()}
                      </div>
                      <div
                        className={cn(
                          'absolute bottom-2 left-[210px] flex h-[22px] gap-1 rounded-md bg-red px-2',
                          {
                            hidden: Boolean((item.discount ?? 0) === 0),
                          },
                        )}
                      >
                        <p className="pt-0.5 text-xsp font-bold text-white">
                          {item.discount ?? 0}
                        </p>
                        <p className="pt-1 text-xs font-bold text-white">%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t py-3">
                <div className="relative flex w-fit flex-col px-4">
                  <p className="text-xsp font-bold">مبلغ قابل پرداخت</p>
                  <p className="text-xl font-bold text-black">
                    {localstorageCart.selectors
                      .totalPrice()
                      .toLocaleString('fa-IR')}
                  </p>
                  <p className="absolute -left-1 bottom-3 -rotate-90 text-[10px] font-bold text-black/40">
                    تومان
                  </p>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="ml-4 rounded-lg bg-red px-4 py-2 text-white disabled:opacity-50"
                >
                  {isSubmitting ? 'در حال ثبت...' : 'ثبت سفارش'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DesktopBottomSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (query) {
      router.push(`/explore?text=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative w-72">
      <div className="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-gray p-4 transition-all focus-within:border-gray-200 focus-within:bg-white">
        <input
          className="bg-transparent text-xsp font-bold"
          type="text"
          placeholder="جستجوی محصول ..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(e as any);
            }
          }}
        />
        <button onClick={handleSearch} type="button" className="z-10 flex">
          <Search size={20} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};
