import { TProduct } from '@/types/product';
import { slice } from 'killua';

export const cartSlice = slice({
  key: 'cart',
  defaultClient: [] as (TProduct & { quantity: number })[],
  defaultServer: [],
  selectors: {
    isEmpty: (value) => Boolean(!value.length),
    isInCart: (value, payload: TProduct) =>
      value.some((product) => product.id === payload.id),
    isOne: (value, payload: TProduct) =>
      value.find((product) => product.id === payload.id)?.quantity === 1,
    totalPrice: (value) =>
      value.reduce((acc, product) => {
        const price = product.price ?? 0;
        const discount = product.discount ?? 0;
        const quantity = product.quantity ?? 0;
        return acc + price * (1 - discount / 100) * quantity;
      }, 0),
    totalItems: (value) =>
      value.reduce((acc, product) => acc + product.quantity, 0),
    quantity: (value, payload: TProduct) => {
      const product = value.find((product) => product.id === payload.id);
      return product?.quantity ?? 0;
    },
  },
  reducers: {
    add: (value, payload: TProduct) => {
      const isProductInCart = value.some(
        (product) => product.id === payload.id,
      );
      if (isProductInCart) {
        return value.map((product) =>
          product.id === payload.id
            ? { ...product, quantity: product.quantity + 1 }
            : product,
        );
      }
      return [...value, { ...payload, quantity: 1 }];
    },
    remove: (value, payload: TProduct) => [
      ...value.filter((product) => product.id !== payload.id),
    ],
    increment: (value, payload: TProduct) => {
      return value.map((product) =>
        product.id === payload.id
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      );
    },
    decrement: (value, payload: TProduct) => {
      return value.map((product) =>
        product.id === payload.id
          ? { ...product, quantity: Math.max(1, product.quantity - 1) }
          : product,
      );
    },
  },
});
