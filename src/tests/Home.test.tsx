import Home from "../screens/home/Home";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import { toast } from "react-toastify";

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) =>
    selector({
      products: {
        products: [{ productId: 1, productName: "Phone" }],
        isLoading: false,
        error: null,
      },
      cart: {
        items: [],
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

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
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

beforeEach(() => {
  jest.clearAllMocks();
});

test("Home renders correctly", () => {
  renderHome();

  expect(screen.getByText(/Popular Right Now/i)).toBeInTheDocument();
});

test("Popular products api renders correctly", async () => {
  (getPopularProducts as jest.Mock).mockResolvedValue([]);

  renderHome();
  await waitFor(() => {
    expect(getPopularProducts).toHaveBeenCalled();
  });
});

test("Popular products api calling correctly", async () => {
  (getPopularProducts as jest.Mock).mockResolvedValue([
    { productId: 1, productName: "Mobile" },
  ]);

  renderHome();

  await waitFor(() => {
    expect(getPopularProducts).toHaveBeenCalled();
  });

  const items = await screen.findAllByText("Product");
  expect(items.length).toBeGreaterThan(0);
});

test("Popular products api fails", async () => {
  (getPopularProducts as jest.Mock).mockRejectedValue({
    response: {
      data: { detail: "Failed" },
    },
  });

  renderHome();

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("Failed");
  });
});

test("Popular products loading when api calling", async () => {
  (getPopularProducts as jest.Mock).mockImplementation(
    () => new Promise(() => {}),
  );

  renderHome();

  expect(screen.getByTestId("loader-popular")).toBeInTheDocument();
});

test("Home redux api renders successfully", async () => {
  renderHome();

  await waitFor(() => {
    expect(fetchProducts).toHaveBeenCalledWith(1);
  });

  const items = await screen.findAllByText("Product");
  expect(items.length).toBeGreaterThan(0);
});

test("Shows loader when products is fetching", () => {
  const useSelectorMock = jest
    .spyOn(require("react-redux"), "useSelector")

    .mockImplementation((selector: any) =>
      selector({
        products: {
          products: [{ productId: 1, productName: "Phone" }],
          isLoading: true,
        },
      }),
    );

  renderHome();

  expect(screen.getByTestId("loader-all")).toBeInTheDocument();
  useSelectorMock.mockRestore();
});

test("Displays correct heading text", () => {
  renderHome();

  expect(screen.getByText(/Popular Right Now/i)).toBeInTheDocument();
  expect(screen.getByText(/NEW COLLECTION 2026/i)).toBeInTheDocument();
});

test("Shows Shop Now and Explore buttons", () => {
  renderHome();

  expect(screen.getByRole("button", { name: /shop now/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /explore/i })).toBeInTheDocument();
});
