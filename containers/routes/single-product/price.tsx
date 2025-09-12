import { cn } from '@/utils/cn';

interface IPriceProps {
  discount: number;
  priceWithDiscount: number;
  priceWithoutDiscount: number;
}

export function Price(props: IPriceProps) {
  const hasDiscount = props.discount !== 0;

  return (
    <section
      className={cn('flex h-16 items-center justify-between px-3', {
        'h-12': !hasDiscount,
      })}
    >
      <div>
        <del
          className={cn('text-sm font-bold text-gray-500', {
            hidden: !hasDiscount,
          })}
        >
          قیمت قبل :
        </del>
        <p className="font-bold text-gray-600">
          قیمت{' '}
          <span
            className={cn({
              hidden: !hasDiscount,
            })}
          >
            با تخفیف
          </span>{' '}
          :
        </p>
      </div>
      <div>
        <div className={cn('flex gap-1', { hidden: !hasDiscount })}>
          <del className="text-sm font-medium text-gray-400">
            {props.priceWithoutDiscount.toLocaleString('fa-IR')}
          </del>
          <div className="flex h-[22px] w-fit gap-1 rounded-full rounded-bl-none bg-red px-2">
            <p className="pt-0.5 font-bold text-white">{props.discount}</p>
            <p className="pt-1 text-sm font-bold text-white">%</p>
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-black">
            {props.priceWithDiscount.toLocaleString('fa-IR')}
          </p>
          <p className="relative -left-16 top-4 -rotate-90 text-[10px] font-bold text-gray-500">
            تومان
          </p>
        </div>
      </div>
    </section>
  );
}
