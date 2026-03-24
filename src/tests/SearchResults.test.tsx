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

test("Search products api renders correctly", async () => {
  (getSearchProducts as jest.Mock).mockResolvedValue([{ productId: 1 }]);
  (getProductDetails as jest.Mock).mockResolvedValue(() => ({
    productId: 1,
    productName: "Test Product",
  }));

  renderSearchResults();

  await screen.findByText(/product/i);

  expect(getSearchProducts).toHaveBeenCalled();
  expect(getProductDetails).toHaveBeenCalled();
});

test("calls search API with the query from search params", async () => {
  (getSearchProducts as jest.Mock).mockResolvedValue([{ productId: 1 }]);
  (getProductDetails as jest.Mock).mockResolvedValue({
    productId: 1,
    productName: "Test Product",
  });

  renderSearchResults();

  await screen.findByText(/product/i);

  expect(getSearchProducts).toHaveBeenCalledWith("phone");
  expect(getProductDetails).toHaveBeenCalledWith(1);
});

test("shows loader while search results are loading", async () => {
  (getSearchProducts as jest.Mock).mockImplementation(() => new Promise(() => {}));

  renderSearchResults();

  expect(screen.getByTestId("search-loader")).toBeInTheDocument();
});

test("does not render products when request fails", async () => {
  (getSearchProducts as jest.Mock).mockRejectedValue({
    response: { data: { detail: "Search failed" } },
  });

  renderSearchResults();

  expect(await screen.findByText(/search failed!/i)).toBeInTheDocument();
  expect(screen.queryByText(/product/i)).not.toBeInTheDocument();
});

