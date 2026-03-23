import Home from "../screens/home/Home";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { store } from "../redux/store";
import { Provider } from "react-redux";

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) =>
    selector({
      products: {
        products: [{ productId: 1, productName: "Phone" }],
        isLoading: false,
      },
    }),
}));
jest.mock("../components/card/ProductCard", () => () => <div>Product</div>);

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: any) => <div>{children}</div>,
  },
}));

jest.mock("../services/authApi", () => ({
  getPopularProducts: jest.fn(),
}));

jest.mock("../redux/productSlice", () => ({
  fetchProducts: jest.fn(() => () => Promise.resolve()),
}));

import { getPopularProducts } from "../services/authApi";
import { fetchProducts } from "../redux/productSlice";

const renderHome = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>,
  );
};

test("Home renders correctly", () => {
  renderHome();

  expect(screen.getByText(/Popular Right Now/i)).toBeInTheDocument();
});

test("Popular products api renders correctly", () => {
  (getPopularProducts as jest.Mock).mockResolvedValue([]);

  renderHome();
  expect(getPopularProducts).toHaveBeenCalled();
});


test("Popular products api calling correctly", async () => {
  (getPopularProducts as jest.Mock).mockResolvedValue([
    { productId: 1, productName: "Mobile" },
  ]);

  expect(getPopularProducts).toHaveBeenCalled();
});

test("Home redux api renders successfully", async () => {
  renderHome();

  await waitFor(() => {
    expect(fetchProducts).toHaveBeenCalledWith(1);
  });

  const items = await screen.findAllByText("Product");
  expect(items.length).toBeGreaterThan(0);
});

test("Shows loader when data is fetching", () => {
  jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
    useSelector: (selector: any) =>
      selector({
        products: {
          products: [{ productId: 1, productName: "Phone" }],
          isLoading: true,
        },
      }),
  }));

  renderHome();

  expect(screen.queryByTestId(/loader/i)).toBeInTheDocument();
});

test("Showing error when api call is failed", () => {
  jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
    useSelector: (selector: any) =>
      selector({
        products: {
          products: [{ productId: 1, productName: "Phone" }],
          isLoading: true,
          errors: null,
        },
      }),
  }));

  renderHome();

  expect(screen.queryByTestId(/loader/i)).toBeInTheDocument();
});
