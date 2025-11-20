import { getAllBrands } from '@/actions/brand/get-all-brands';
import { getAllCategories } from '@/actions/category/get-all-categories';
import { getAllProducts } from '@/actions/product/get-all-products';
import { getBestSellingProducts } from '@/actions/product/get-best-selling-products';
import { getCheapestProducts } from '@/actions/product/get-cheapest-products';
import { getMostExpensiveProducts } from '@/actions/product/get-most-expensive-products';
import { ViewportAnimation } from '@/components/viewport-animation';
import { ProductSlider } from '@/containers/routes/global/product-slider';
import { Banners } from '@/containers/routes/home/banners';
import { BrandSlider } from '@/containers/routes/home/brand-slider';
import { CategorySlider } from '@/containers/routes/home/category-slider';
import { HeroOfferSlider } from '@/containers/routes/home/hero-offer-slider';
import { HeroSlider } from '@/containers/routes/home/hero-slider';
import { ProductSliderWithBanner } from '@/containers/routes/home/product-slider-with-banner';

export default async function Page() {
  const [
    productsResult,
    cheapestProductsResult,
    mostExpensiveProductsResult,
    bestSellingProductsResult,
    categoriesResult,
    brandsResult,
  ] = await Promise.all([
    getAllProducts(),
    getCheapestProducts(),
    getMostExpensiveProducts(),
    getBestSellingProducts(),
    getAllCategories(),
    getAllBrands(),
  ]);

  return (
    <div className="flex size-full flex-col gap-6">
      <ViewportAnimation>
        <div className="container grid grid-cols-4 gap-5">
          <HeroSlider />
          <HeroOfferSlider products={productsResult.data!} />
        </div>
      </ViewportAnimation>
      <ViewportAnimation>
        <CategorySlider categories={categoriesResult.data!} isHomepage={true} />
      </ViewportAnimation>
      <ViewportAnimation>
        <Banners />
      </ViewportAnimation>
      <ViewportAnimation>
        <ProductSliderWithBanner
          text="ارزان ترین"
          position="right"
          path="/"
          image="/images/routes/home/product-slider-with-banner-laptop.png"
          products={cheapestProductsResult.data!}
        />
      </ViewportAnimation>
      <ViewportAnimation>
        <ProductSlider
          title="پرفروش ترین محصولات"
          path="/"
          products={bestSellingProductsResult.data!}
        />
      </ViewportAnimation>
      <ViewportAnimation>
        <ProductSliderWithBanner
          text="گران ترین"
          position="left"
          path="/"
          image="/images/routes/home/product-slider-with-banner-play-station.png"
          products={mostExpensiveProductsResult.data!}
        />
      </ViewportAnimation>
      <ViewportAnimation>
        <BrandSlider brands={brandsResult.data!} />
      </ViewportAnimation>
    </div>
  );
}
