import { CardBorderBottom } from './card-border-bottom';
import { ProductCardFooter } from './product-card-footer';
import { TProduct } from '@/types/product';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';

interface IProps {
  data: TProduct;
}

export function ProductCard(props: IProps) {
  return (
    <div key={props.data.id} className="group overflow-hidden">
      <div className="relative flex h-[330px] w-full flex-col items-center justify-center overflow-hidden p-5">
        <ImageWithText data={props.data} />
        <ProductCardFooter
          data={props.data}
          type="product-slider"
          priceComponent={<Price data={props.data} />}
        />
        <CardBorderBottom />
      </div>
    </div>
  );
}

const ImageWithText = (props: IProps) => {
  const imageUrl =
    props.data.gallery && props.data.gallery.length > 0
      ? props.data.gallery[0]
      : '';

  return (
    <Link
      href={`/products/${props.data.slug}`}
      className="mb-10 flex flex-col items-center gap-3"
    >
      {imageUrl && (
        <div className="relative size-[175px]">
          <Image src={imageUrl} alt={props.data.name_fa} fill />
        </div>
      )}
      <p className="line-clamp-2 font-bold">{props.data.name_fa}</p>
    </Link>
  );
};

const Price = (props: IProps) => {
  const price = props.data.price ?? 0;
  const discount = props.data.discount ?? 0;
  const priceWithoutDiscount = price;
  const priceWithDiscount = price * (1 - discount / 100);

  return (
    <div>
      <del
        className={cn('absolute bottom-9 left-[80px] text-smp text-gray-400', {
          hidden: Boolean(discount === 0),
        })}
      >
        {priceWithoutDiscount.toLocaleString('fa-IR')}
      </del>
      <div>
        <p className="absolute bottom-2 left-8 text-2xl font-bold text-black">
          {priceWithDiscount.toLocaleString('fa-IR')}
        </p>
        <p className="absolute bottom-5 left-3 -rotate-90 text-[10px] font-bold text-gray-500">
          تومان
        </p>
        <div
          className={cn(
            'absolute bottom-10 left-8 flex h-[22px] gap-1 rounded-full rounded-bl-none bg-red px-2',
            {
              hidden: Boolean(discount === 0),
            },
          )}
        >
          <p className="pt-0.5 font-bold text-white">{discount}</p>
          <p className="pt-1 text-sm font-bold text-white">%</p>
        </div>
      </div>
    </div>
  );
};
