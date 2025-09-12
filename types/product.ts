export type TProduct = {
  id: number;
  quantity: number;
  attributes: {
    key: string;
    value: string;
  }[];
  path: string;
  discount: number;
  priceWithoutDiscount: number;
  priceWithDiscount: number;
  title: {
    fa: string;
    en: string;
  };
  category: {
    text: string;
    path: string;
    image: string;
  };
  images: string[];
  description: string;
};
