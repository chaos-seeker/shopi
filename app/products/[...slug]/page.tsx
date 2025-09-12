import { BreadCrumb } from '@/components/bread-crumb';
import { ProductCardFooter } from '@/components/product-card-footer';
import { Category } from '@/containers/routes/single-product/category';
import { Images } from '@/containers/routes/single-product/images';
import { MiniAttributes } from '@/containers/routes/single-product/mini-attributes';
import { MiniDescription } from '@/containers/routes/single-product/mini-description';
import { Price } from '@/containers/routes/single-product/price';
import { Quantity } from '@/containers/routes/single-product/quantity';
import { Title } from '@/containers/routes/single-product/title';
import { productsData } from '@/resources/products';

interface IPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page(props: IPageProps) {
  const { slug } = await props.params;
  const data = productsData[Number(slug[0]) - 1];

  return (
    <div className="container">
      <div className="mb-2 flex size-full items-center gap-3">
        <BreadCrumb title="فروشگاه" link={data.category} />
        <span className="h-px grow bg-[#e6e9ee]" />
      </div>
      <div className="gap-5 xl:flex">
        <div className="flex flex-col gap-3">
          <Images images={data.images} title={data.title} />
          <Category category={data.category} />
        </div>
        <div>
          <Title en={data.title.en} fa={data.title.fa} />
          <div className="gap-5 md:flex md:flex-row-reverse">
            <div className="relative z-10 h-fit min-w-[300px] rounded-xl border p-3">
              <Price
                discount={data.discount}
                priceWithDiscount={data.priceWithDiscount}
                priceWithoutDiscount={data.priceWithoutDiscount}
              />
              <Quantity quantity={data.quantity} />
              <ProductCardFooter type="single-product" data={data} />
            </div>
            <div className="mt-5 flex w-full flex-col gap-5 sm:flex-row-reverse md:mt-0 xl:gap-5">
              <MiniAttributes attributes={data.attributes} />
              <MiniDescription description={data.description} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
