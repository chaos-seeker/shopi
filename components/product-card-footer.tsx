'use client';

import { useKillua } from 'killua';
import { FiShoppingBag } from 'react-icons/fi';
import { HiTrash } from 'react-icons/hi2';
import { cartSlice } from '@/slices/cart';
import { TProduct } from '@/types/product';
import { cn } from '@/utils/cn';

type TProductCardType = 'offer-slider' | 'product-slider' | 'single-product';
interface IProductCardActionsProps {
  data: TProduct;
  type: TProductCardType;
  priceComponent?: React.ReactNode;
}

export function ProductCardPrice({ data }: { data: TProduct }) {
  return (
    <div>
      <del className="absolute bottom-8 left-20 text-smp text-gray-50">
        {data.priceWithDiscount.toLocaleString('fa-IR')}
      </del>
      <div>
        <p className="absolute bottom-1 left-8 text-2xl font-bold text-white">
          {data.priceWithoutDiscount.toLocaleString('fa-IR')}
        </p>
        <p className="absolute bottom-5 left-2 -rotate-90 text-xs font-bold text-white">
          تومان
        </p>
        <div className="absolute bottom-9 left-8 flex h-[22px] gap-1 rounded-full rounded-bl-none bg-white px-2">
          <p className="pt-0.5 font-bold text-red">{data.discount}</p>
          <p className="pt-1 text-sm font-bold text-red">%</p>
        </div>
      </div>
    </div>
  );
}

export function ProductCardButton({
  type,
  handleAdd,
}: {
  type: TProductCardType;
  handleAdd: () => void;
}) {
  if (type === 'single-product') {
    return (
      <button
        className="flex w-full items-center justify-between rounded-lg bg-green p-4 text-lg font-bold"
        onClick={handleAdd}
      >
        <p className="text-white">افزودن به سبد خرید</p>
        <p className="text-white">+</p>
      </button>
    );
  }
  return (
    <button
      className={cn('rounded-lg p-2 absolute bottom-4 right-4', {
        'bg-white': type === 'offer-slider',
        'bg-red': type === 'product-slider',
      })}
      onClick={handleAdd}
    >
      <FiShoppingBag
        size={20}
        className={cn({
          'stroke-red': type === 'offer-slider',
          'stroke-white': type === 'product-slider',
        })}
      />
    </button>
  );
}

export function ProductCardFooter({
  data,
  type,
  priceComponent,
}: IProductCardActionsProps) {
  const localstorageCart = useKillua(cartSlice);
  const isInCart = localstorageCart.selectors.isInCart(data);
  const quantity = localstorageCart.selectors.quantity(data);

  const handleAdd = () => localstorageCart.reducers.add(data);
  const handleIncrement = () => localstorageCart.reducers.increment(data);
  const handleDecrement = () => localstorageCart.reducers.decrement(data);
  const handleRemove = () => localstorageCart.reducers.remove(data);

  if (isInCart) {
    return (
      <div
        className={cn(
          'flex w-full justify-between rounded-lg font-bold text-gray-900',
          {
            'absolute -bottom-0.5 p-4': type !== 'single-product',
          },
        )}
      >
        <div
          className={cn(
            'flex w-full justify-between rounded-lg border bg-white fill-gray-700 text-lg text-gray-700',
            {
              'p-4': type === 'single-product',
              'p-2': type !== 'single-product',
            },
          )}
        >
          <button onClick={handleIncrement}>+</button>
          <span>{quantity}</span>
          {quantity === 1 ? (
            <button onClick={handleRemove}>
              <HiTrash size={20} />
            </button>
          ) : (
            <button onClick={handleDecrement} className="text-lg">
              -
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {priceComponent}
      <ProductCardButton type={type} handleAdd={handleAdd} />
    </>
  );
}
