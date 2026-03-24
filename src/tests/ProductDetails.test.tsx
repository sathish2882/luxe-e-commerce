import ProductDetails from "../screens/productDetails/ProductDetails";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import { getProductDetails } from "../services/authApi";
import { toast } from "react-toastify";
import { addToCartHandler } from "../utils/cartHelper";

jest.mock("../services/authApi", () => ({
  getProductDetails: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ productId: "1" }),
}));

jest.mock("../utils/cartHelper", () => ({
  addToCartHandler: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const renderProductDetails = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductDetails />
      </MemoryRouter>
    </Provider>,
  );
};

test("fetches product details using the route productId", async () => {
  (getProductDetails as jest.Mock).mockResolvedValue({
    productId: 1,
    productName: "Test Product",
    price: 100,
    categoryName: "Electronics",
    imageUrl: "/product.jpg",
    discountPercent: 10,
    totalReviews: 10,
    rating: 4.5,
    description: "Test description",
    sku: "SKU-1",
    status: "active",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    createdBy: 1,
    tag: "New",
  });

  renderProductDetails();

  expect(await screen.findByText(/test product/i)).toBeInTheDocument();
  expect(getProductDetails).toHaveBeenCalledWith(1)
});

test("renders product details correctly", async () => {
  (getProductDetails as jest.Mock).mockResolvedValue({
    productId: 1,
    productName: "Test Product",
    price: 100,
    categoryName: "Electronics",
    imageUrl: "/product.jpg",
    discountPercent: 10,
    totalReviews: 10,
    rating: 4.5,
    description: "Test description",
    sku: "SKU-1",
    status: "active",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    createdBy: 1,
    tag: "New",
  });

  renderProductDetails();

  expect(await screen.findByText(/test product/i)).toBeInTheDocument();
  expect(screen.getByText(/electronics/i)).toBeInTheDocument();
  expect(screen.getByText(/test description/i)).toBeInTheDocument();
  expect(screen.getByText(/4.5/i)).toBeInTheDocument();
  expect(screen.getByText(/\(10 reviews\)/i)).toBeInTheDocument();
  expect(screen.getByText(/new/i)).toBeInTheDocument();
});

test("increases quantity before add to cart", async () => {
  (getProductDetails as jest.Mock).mockResolvedValue({
    productId: 1,
    productName: "Test Product",
    price: 100,
    categoryName: "Electronics",
    imageUrl: "/product.jpg",
    discountPercent: 10,
    totalReviews: 10,
    rating: 4.5,
    description: "Test description",
    sku: "SKU-1",
    status: "active",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    createdBy: 1,
    tag: "New",
  });

  renderProductDetails();

  await screen.findByText(/test product/i);

  const buttons = screen.getAllByRole("button");
  await userEvent.click(buttons[2]);

  expect(screen.getByText("2")).toBeInTheDocument();
});

test("calls addToCartHandler with product and qty", async () => {
  (getProductDetails as jest.Mock).mockResolvedValue({
    productId: 1,
    productName: "Test Product",
    price: 100,
    categoryName: "Electronics",
    imageUrl: "/product.jpg",
    discountPercent: 10,
    totalReviews: 10,
    rating: 4.5,
    description: "Test description",
    sku: "SKU-1",
    status: "active",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    createdBy: 1,
    tag: "New",
  });

  renderProductDetails();

  await screen.findByText(/test product/i);

  const addToCartButton = screen.getByRole("button", { name: /add to cart/i });
  await userEvent.click(addToCartButton);

  await waitFor(() => {
    expect(addToCartHandler).toHaveBeenCalled();
  });
});

test("shows error toast when fetching product details fails", async () => {
  (getProductDetails as jest.Mock).mockRejectedValue({
    response: {
      data: {
        detail: "Failed to fetch product",
      },
    },
  });

  renderProductDetails();

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("Failed to fetch product");
  });
});

test("renders back to shop link", async () => {
  (getProductDetails as jest.Mock).mockResolvedValue({
    productId: 1,
    productName: "Test Product",
    price: 100,
    categoryName: "Electronics",
    imageUrl: "/product.jpg",
    discountPercent: 10,
    totalReviews: 10,
    rating: 4.5,
    description: "Test description",
    sku: "SKU-1",
    status: "active",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    createdBy: 1,
    tag: "New",
  });

  renderProductDetails();

  await screen.findByText(/test product/i);

  const backLink = screen.getByRole("link", { name: /back to shop/i });
  expect(backLink).toHaveAttribute("href", "/");
});




