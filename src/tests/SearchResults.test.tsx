import SearchResults from "../screens/SearchResults";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { store } from "../redux/store";
import { Provider } from "react-redux";

jest.mock("../components/card/ProductCard", () => () => <div>Product</div>);

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: any) => <div>{children}</div>,
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: () => [new URLSearchParams("q=phone")],
}));

jest.mock("../services/authApi", () => ({
  getProductDetails: jest.fn(),
  getSearchProducts: jest.fn(),
}));

import { getProductDetails, getSearchProducts } from "../services/authApi";

const renderSearchResults = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <SearchResults />
      </MemoryRouter>
    </Provider>,
  );
};


test("Search products api renders correctly", async() => {
  (getSearchProducts as jest.Mock).mockResolvedValue([{ productId: 1 }]);
  (getProductDetails as jest.Mock).mockResolvedValue(() => ({
    productId: 1,
    productName: "Test Product",
  }));

  renderSearchResults();

  await screen.findByText(/product/i)

  expect(getSearchProducts).toHaveBeenCalled();
  expect(getProductDetails).toHaveBeenCalled();
});
