import { getAllBrands } from '@/actions/brand/get-all-brands';
import { getAllCategories } from '@/actions/category/get-all-categories';
import { getAllProducts } from '@/actions/product/get-all-products';
import { ViewportAnimation } from '@/components/viewport-animation';
import { ProductSlider } from '@/containers/routes/global/product-slider';
import { Banners } from '@/containers/routes/home/banners';
import { BrandSlider } from '@/containers/routes/home/brand-slider';
import { CategorySlider } from '@/containers/routes/home/category-slider';
import { HeroOfferSlider } from '@/containers/routes/home/hero-offer-slider';
import { HeroSlider } from '@/containers/routes/home/hero-slider';
import { ProductSliderWithBanner } from '@/containers/routes/home/product-slider-with-banner';

export default async function Page() {
  const [productsResult, categoriesResult, brandsResult] = await Promise.all([
    getAllProducts(),
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
          products={productsResult.data!}
        />
      </ViewportAnimation>
      <ViewportAnimation>
        <ProductSlider
          title="پرفروش ترین محصولات"
          path="/"
          products={productsResult.data!}
        />
      </ViewportAnimation>
      <ViewportAnimation>
        <ProductSliderWithBanner
          text="گران ترین"
          position="left"
          path="/"
          image="/images/routes/home/product-slider-with-banner-play-station.png"
          products={productsResult.data!}
        />
      </ViewportAnimation>
      <ViewportAnimation>
        <BrandSlider brands={brandsResult.data!} />
      </ViewportAnimation>
    </div>
  );
}
