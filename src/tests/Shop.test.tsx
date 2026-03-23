import Shop from "../screens/Shop";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../redux/store";

const mockDispatch = jest.fn();
const mockUseParams = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) =>
    selector({
      products: {
        products: [{ productId: 1, productName: "Phone" }],
        isLoading: false,
      },
      categories: {
        categories: [{ categoriesId: 90001, name: "Sports" }],
        categoryLoading: false,
      },
    }),
}));

jest.mock("../redux/productSlice", () => ({
  fetchProducts: jest.fn(() => () => Promise.resolve()),
  fetchProductsByCategory: jest.fn(() => () => Promise.resolve()),
}));

jest.mock("../redux/categorySlice", () => ({
  fetchCategory: jest.fn(() => () => Promise.resolve()),
}));

jest.mock("../components/card/ProductCard", () => () => <div>Product</div>);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => mockUseParams(),
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: any) => <div>{children}</div>,
  },
}));

import { fetchProducts, fetchProductsByCategory } from "../redux/productSlice";
import { fetchCategory } from "../redux/categorySlice";

const renderShop = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Shop />
      </MemoryRouter>
    </Provider>,
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

test("Shop renders correctly", () => {
  mockUseParams.mockReturnValue({});
  renderShop();

  expect(screen.getByText(/shop/i)).toBeInTheDocument();
});

test("Shop redux api renders products successfully", async () => {
  mockUseParams.mockReturnValue({});
  renderShop();

  await waitFor(() => {
    expect(fetchProducts).toHaveBeenCalledWith(1);
  });

  const items = await screen.findAllByText("Product");
  expect(items.length).toBeGreaterThan(0);
});

test("Shop redux api renders categories successfully", async () => {
  renderShop();

  await waitFor(() => {
    expect(fetchCategory).toHaveBeenCalled();
  });

  const category = await screen.findByText(/sports/i);

  expect(category).toBeInTheDocument();
});

test("Shop redux api renders products by category", async () => {
  mockUseParams.mockReturnValue({ categoriesId: "90001" });
  renderShop();

  await waitFor(() => {
    expect(fetchProductsByCategory).toHaveBeenCalledWith(90001);
  });

  const items = await screen.findAllByText("Product");
  expect(items.length).toBeGreaterThan(0);
});
