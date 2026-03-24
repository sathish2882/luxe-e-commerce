import Cart from "../screens/Cart";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { store } from "../redux/store";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../redux/cartSlice";

const renderCart = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </Provider>,
  );
};

const mockItem = {
  productId: 1,
  productName: "Test Product",
  price: 100,
  categoryName: "Test",
  imageUrl: "https://dummyimage.com/100x100",
  discountPercent: 0,
  totalReviews: 10,
  rating: 4,
  description: "Test desc",
  sku: "123",
  status: "active",
  createdAt: "",
  updatedAt: "",
  createdBy: 1,
  quantity: 2,
};

const renderCartWithItem = (qty = 2) => {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState: {
      cart: {
        items: [{ ...mockItem, quantity: qty }],
        totalQty: qty,
        totalAmount: 100 * qty,
      },
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </Provider>,
  );
};

test("Cart renders correctly", () => {
  renderCart();

  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});

test("Cart displays items when not empty", () => {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState: {
      cart: {
        items: [mockItem],
        totalQty: 2,
        totalAmount: 200,
      },
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </Provider>,
  );

  expect(screen.getByText(/test product/i)).toBeInTheDocument();
});

test("Removes item from cart", async () => {
  renderCartWithItem();

  const removeBtn = screen.getByLabelText("remove btn");
  await userEvent.click(removeBtn);

  expect(screen.queryByText(/test product/i)).not.toBeInTheDocument();
});


test("Increases item quantity", async () => {
  renderCartWithItem();

  const increaseBtn = screen.getByRole("button", { name: /\+/i });
  await userEvent.click(increaseBtn);

  expect(screen.getByText("3")).toBeInTheDocument();
});

test("Decreases item quantity", async () => {
  renderCartWithItem();

  const decreaseBtn = screen.getByRole("button", { name: /-/i });
  await userEvent.click(decreaseBtn);

  expect(screen.getByText("1")).toBeInTheDocument();
});

test("Removes item when quantity becomes 0", async () => {
  renderCartWithItem(1); 

  const decreaseBtn = screen.getByRole("button", { name: /-/i });
  await userEvent.click(decreaseBtn);

  expect(screen.queryByText(/test product/i)).not.toBeInTheDocument();
});

test("Clears the cart", async () => {
  renderCartWithItem();

  const clearBtn = screen.getByRole("button", { name: /clear cart/i });
  await userEvent.click(clearBtn);

  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});

test("Displays correct total amount", () => {
  renderCartWithItem();

  expect(screen.getByLabelText("total amount")).toHaveTextContent("200");
});
