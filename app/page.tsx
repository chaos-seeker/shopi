import { getAllBrands } from '@/actions/brand/get-all-brands';
import { getAllCategories } from '@/actions/category/get-all-categories';
import { getAllProducts } from '@/actions/product/get-all-products';
import { CategorySlider } from '@/containers/routes/global/category-slider';
import { ProductSlider } from '@/containers/routes/global/product-slider';
import { Banners } from '@/containers/routes/home/banners';
import { BrandSlider } from '@/containers/routes/home/brand-slider';
import { HeroOfferSlider } from '@/containers/routes/home/hero-offer-slider';
import { HeroSlider } from '@/containers/routes/home/hero-slider';
import { ProductSliderWithBanner } from '@/containers/routes/home/product-slider-with-banner';

export default async function Page() {
  const [productsResult, categoriesResult, brandsResult] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllBrands(),
  ]);

  const products = productsResult.data || [];
  const categories = categoriesResult.data || [];
  const brands = brandsResult.data || [];

  return (
    <div className="flex size-full flex-col gap-6">
      <div className="container grid grid-cols-4 gap-5">
        <HeroSlider />
        <HeroOfferSlider products={products} />
      </div>
      <CategorySlider categories={categories} isHomepage={true} />
      <Banners />
      <ProductSliderWithBanner
        text="ارزان ترین"
        position="right"
        path="/"
        image="/images/routes/home/product-slider-with-banner-laptop.png"
        products={products}
      />
      <ProductSlider title="پرفروش ترین محصولات" path="/" products={products} />
      <ProductSliderWithBanner
        text="گران ترین"
        position="left"
        path="/"
        image="/images/routes/home/product-slider-with-banner-play-station.png"
        products={products}
      />
      <BrandSlider brands={brands} />
    </div>
  );
}
