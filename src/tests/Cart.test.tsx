import Cart from "../screens/Cart";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { store } from "../redux/store";
import { Provider } from "react-redux";



const renderCart = () => {

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
