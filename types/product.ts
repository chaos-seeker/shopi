import { TCategory } from './category';

export type TProduct = {
  id: number;
  image: string;
  gallery: string[];
  category: TCategory;
  name_fa: string;
  name_en: string;
  slug: string;
  quantity: number;
  property: {
    key: string;
    value: string;
  }[];
  description: string;
  price: number;
  discount: number;
  created_at: string;
  updated_at: string;
};
