import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  categoryName: string;
  imageUrl: string;
  discountPercent: number;
  totalReviews: number;
  rating: number;
  description: string;
  sku: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  totalQty: number;
  totalAmount: number;
}

const loadCartFromStorage = (): Cart => {
  const stored = localStorage.getItem("guest_cart");

  if (stored) {
    return JSON.parse(stored);
  }

  return {
    items: [],
    totalQty: 0,
    totalAmount: 0,
  };
};

const initialState: Cart = loadCartFromStorage();

const calculateTotals = (state: Cart) => {
  state.totalQty = state.items.reduce(
    (total, item) => total + item.quantity,

    0,
  );

  state.totalAmount = state.items.reduce((total, item) => {
    const discountPrice = item.discountPercent
      ? item.price * (1 - item.discountPercent / 100)
      : item.price;
    return total + discountPrice * item.quantity;
  }, 0);
};

const saveCartToLocalStorage = (state: Cart) => {
  localStorage.setItem("guest_cart", JSON.stringify(state));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload || [];
      calculateTotals(state);
      saveCartToLocalStorage(state);
    },
    addToCart: (state, action) => {

      const quantity = action.payload?.quantity ?? 1

      const isExistingItem = state.items.find(
        (each) => each.productId === action.payload.productId,
      );

      if (isExistingItem) {
        isExistingItem.quantity += quantity;
      } else {
        state.items.push({
          ...action.payload,
          quantity: quantity,
        });
      }

      calculateTotals(state);
      saveCartToLocalStorage(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (each) => each.productId !== action.payload,
      );
      calculateTotals(state);
      saveCartToLocalStorage(state);
    },

    increaseQty: (state, action) => {
      const item = state.items.find(
        (each) => each.productId === action.payload,
      );

      if (item) {
        item.quantity += 1;
      }
      calculateTotals(state);
      saveCartToLocalStorage(state);
    },

    decreaseQty: (state, action) => {
      const item = state.items.find(
        (each) => each.productId === action.payload,
      );

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (each) => each.productId !== action.payload,
          );
        }
      }

      calculateTotals(state);
      saveCartToLocalStorage(state);
    },
    clearCart: (state) => {
      ((state.items = []), (state.totalQty = 0), (state.totalAmount = 0));
      localStorage.removeItem("guest_cart");
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
