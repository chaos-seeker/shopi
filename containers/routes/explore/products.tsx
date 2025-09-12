'use client';

import { ProductCard } from '@/components/product-card';
import { useShuffledArray } from '@/hooks/shuffle-array';
import { productsData } from '@/resources/products';

export function Products() {
  const shuffledProducsData = useShuffledArray(productsData);

  return (
    <section className="grid w-full grid-cols-1 overflow-hidden rounded-xl border-r border-t sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {shuffledProducsData.map((item) => (
        <div key={item.id} className="border-b border-l">
          <ProductCard data={item} />
        </div>
      ))}
    </section>
  );
}
