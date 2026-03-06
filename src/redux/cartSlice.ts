import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  totalQty: number;
  totalAmount: number;
}

const initialState: Cart = {
  items: [],
  totalQty: 0,
  totalAmount: 0,
};

const calculateTotals = (state: Cart) => {
  state.totalQty = state.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  state.totalAmount = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const isExistingItem = state.items.find(
        (each) => each.id === action.payload.id,
      );

      if (isExistingItem) {
        isExistingItem.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }

      calculateTotals(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((each) => each.id !== action.payload);
      calculateTotals(state);
    },

    increaseQty: (state, action) => {
      const item = state.items.find((each) => each.id === action.payload);

      if (item) {
        item.quantity += 1;
      }
      calculateTotals(state);
    },

    decreaseQty: (state, action) => {
      const item = state.items.find((each) => each.id === action.payload);

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (each) => each.id !== action.payload,
          );
        }
      }

      calculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [],
      state.totalQty = 0,
      state.totalAmount = 0
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
