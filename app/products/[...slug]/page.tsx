import { getProductBySlug } from '@/actions/product/get-product-by-slug';
import { BreadCrumb } from '@/components/bread-crumb';
import { ProductCardFooter } from '@/components/product-card-footer';
import { Category } from '@/containers/routes/single-product/category';
import { Images } from '@/containers/routes/single-product/images';
import { MiniAttributes } from '@/containers/routes/single-product/mini-attributes';
import { MiniDescription } from '@/containers/routes/single-product/mini-description';
import { Price } from '@/containers/routes/single-product/price';
import { Quantity } from '@/containers/routes/single-product/quantity';
import { Title } from '@/containers/routes/single-product/title';
import { TProduct } from '@/types/product';
import { notFound } from 'next/navigation';

interface IPageProps {
  params: Promise<{
    slug: string | string[];
  }>;
}

export default async function Page(props: IPageProps) {
  const { slug } = await props.params;
  const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  const result = await getProductBySlug(productSlug);

  if (result.error || !result.data) {
    notFound();
  }

  const product = result.data as TProduct;

  const price = product.price ?? 0;
  const discount = product.discount ?? 0;
  const priceWithoutDiscount = price;
  const priceWithDiscount = price * (1 - discount / 100);

  return (
    <div className="container">
      <div className="mb-2 flex size-full items-center gap-3">
        <BreadCrumb
          title={product.name_fa}
          link={{
            text: product.category.name_fa,
            path: `/explore?category=${product.category.slug}`,
          }}
        />
        <span className="h-px grow bg-[#e6e9ee]" />
      </div>
      <div className="gap-5 xl:flex">
        <div className="flex flex-col gap-3">
          <Images
            images={product.gallery}
            title={{ fa: product.name_fa, en: product.name_en }}
          />
          <Category
            category={{
              text: product.category.name_fa,
              image: product.category.image,
              path: `/explore?category=${product.category.slug}`,
            }}
          />
        </div>
        <div>
          <Title en={product.name_en} fa={product.name_fa} />
          <div className="gap-5 md:flex md:flex-row-reverse">
            <div className="relative z-10 h-fit min-w-[300px] rounded-xl border p-3">
              <Price
                discount={discount}
                priceWithDiscount={priceWithDiscount}
                priceWithoutDiscount={priceWithoutDiscount}
              />
              <Quantity quantity={product.quantity} />
              <ProductCardFooter type="single-product" data={product} />
            </div>
            <div className="mt-5 flex w-full flex-col gap-5 sm:flex-row-reverse md:mt-0 xl:gap-5">
              <MiniAttributes attributes={product.property} />
              <MiniDescription description={product.description} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
