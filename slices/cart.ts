import { TProduct } from '@/types/product';
import { slice } from 'killua';

type TCartItemOld = TProduct & { quantity: number };
type TCartItemNew = Omit<TProduct, 'quantity'> & {
  cartQuantity: number;
  stockQuantity: number;
};
export type TCartItem = TCartItemOld | TCartItemNew;

const getCartQuantity = (item: TCartItem): number => {
  return 'cartQuantity' in item
    ? item.cartQuantity
    : ((item as TCartItemOld).quantity ?? 0);
};

const getStockQuantity = (item: TCartItem, fallback: number): number => {
  return 'stockQuantity' in item ? item.stockQuantity : fallback;
};

const isNewStructure = (item: TCartItem): item is TCartItemNew => {
  return 'cartQuantity' in item && 'stockQuantity' in item;
};

const convertToNewStructure = (
  item: TCartItem,
  stockQuantity: number,
): TCartItemNew => {
  if (isNewStructure(item)) {
    return item;
  }
  const { quantity, ...product } = item as TCartItemOld;
  return {
    ...product,
    cartQuantity: quantity ?? 1,
    stockQuantity,
  };
};

const createCartItem = (
  product: TProduct,
  stockQuantity: number,
): TCartItemNew => {
  const { quantity, ...productWithoutQuantity } = product;
  return {
    ...productWithoutQuantity,
    cartQuantity: 1,
    stockQuantity,
  };
};

const canAddToCart = (cartQuantity: number, stockQuantity: number): boolean => {
  return cartQuantity < stockQuantity && stockQuantity > 0;
};

export const cartSlice = slice({
  key: 'cart',
  defaultClient: [] as TCartItem[],
  defaultServer: [],
  selectors: {
    isEmpty: (value) => !value.length,

    isInCart: (value, payload: TProduct) =>
      value.some((product) => product.id === payload.id),

    isOne: (value, payload: TProduct | TCartItem) => {
      const product = value.find((p) => p.id === payload.id);
      return product ? getCartQuantity(product) === 1 : false;
    },

    totalPrice: (value) =>
      value.reduce((acc, product) => {
        const price = product.price ?? 0;
        const discount = product.discount ?? 0;
        const quantity = getCartQuantity(product);
        return acc + price * (1 - discount / 100) * quantity;
      }, 0),

    totalDiscount: (value) =>
      value.reduce((acc, product) => {
        const price = product.price ?? 0;
        const discount = product.discount ?? 0;
        const quantity = getCartQuantity(product);
        return acc + ((price * discount) / 100) * quantity;
      }, 0),

    totalItems: (value) =>
      value.reduce((acc, product) => acc + getCartQuantity(product), 0),

    quantity: (value, payload: TProduct | TCartItem) => {
      const product = value.find((p) => p.id === payload.id);
      return product ? getCartQuantity(product) : 0;
    },

    canIncrement: (value, payload: TProduct | TCartItem) => {
      const cartProduct = value.find((p) => p.id === payload.id);

      if (!cartProduct) {
        const stock = 'quantity' in payload ? payload.quantity : 0;
        return stock > 0;
      }

      const cartQuantity = getCartQuantity(cartProduct);
      const productStock =
        getStockQuantity(cartProduct, 0) ||
        ('quantity' in payload ? payload.quantity : 0);

      return canAddToCart(cartQuantity, productStock);
    },
  },
  reducers: {
    add: (value, payload: TProduct) => {
      const existingProductIndex = value.findIndex((p) => p.id === payload.id);
      const stockQuantity = payload.quantity ?? 0;

      if (existingProductIndex !== -1) {
        return value.map((product, index) => {
          if (index !== existingProductIndex) return product;

          const currentQuantity = getCartQuantity(product);
          const productStock = getStockQuantity(product, stockQuantity);

          if (!canAddToCart(currentQuantity, productStock)) {
            return product;
          }

          const updatedItem = convertToNewStructure(product, productStock);
          return {
            ...updatedItem,
            cartQuantity: currentQuantity + 1,
          };
        });
      }

      if (stockQuantity <= 0) return value;

      return [...value, createCartItem(payload, stockQuantity)];
    },

    remove: (value, payload: TProduct | TCartItem) =>
      value.filter((product) => product.id !== payload.id),

    increment: (value, payload: TProduct | TCartItem) => {
      return value.map((product) => {
        if (product.id !== payload.id) return product;

        const currentQuantity = getCartQuantity(product);
        const productStock =
          getStockQuantity(product, 0) ||
          ('quantity' in payload ? payload.quantity : 0);

        if (!canAddToCart(currentQuantity, productStock)) {
          return product;
        }

        const updatedItem = convertToNewStructure(product, productStock);
        return {
          ...updatedItem,
          cartQuantity: currentQuantity + 1,
        };
      });
    },

    decrement: (value, payload: TProduct | TCartItem) => {
      return value.map((product) => {
        if (product.id !== payload.id) return product;

        const currentQuantity = getCartQuantity(product);
        const newQuantity = Math.max(1, currentQuantity - 1);

        if (isNewStructure(product)) {
          return { ...product, cartQuantity: newQuantity };
        }

        return { ...product, quantity: newQuantity } as TCartItemOld;
      });
    },
  },
});
