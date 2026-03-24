import OrderDetails from "../screens/OrderDetails";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("../services/authApi", () => ({
  getOrdersItemsApi: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ orderId: "1" }),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

import { toast } from "react-toastify";
import { getOrdersItemsApi } from "../services/authApi";

beforeEach(() => {
  jest.clearAllMocks();
});

const renderOrderDetails = () => {
  render(
    <MemoryRouter>
      <OrderDetails />
    </MemoryRouter>,
  );
};

test("OrderDetails renders correctly", async () => {
  (getOrdersItemsApi as jest.Mock).mockResolvedValue([
    {
      orderItemsId: 1,
      orderId: 1,
      productId: 1,
      productName: "Test Product",
      imageUrl: "/product.jpg",
      category: "Electronics",
      price: 100,
      quantity: 1,
      totalPrice: 100,
    },
  ]);

  renderOrderDetails();

  expect(await screen.findByText(/order items/i)).toBeInTheDocument();
  expect(getOrdersItemsApi).toHaveBeenLastCalledWith(1);
});

test("renders order item details", async () => {
  (getOrdersItemsApi as jest.Mock).mockResolvedValue([
    {
      orderItemsId: 1,
      orderId: 1,
      productId: 7,
      productName: "Test Product",
      imageUrl: "/product.jpg",
      category: "Electronics",
      price: 100,
      quantity: 2,
      totalPrice: 200,
    },
  ]);

  renderOrderDetails();

  expect(await screen.findByText(/test product/i)).toBeInTheDocument();
  expect(screen.getByText(/electronics/i)).toBeInTheDocument();
  expect(screen.getByText(/quantity: 2/i)).toBeInTheDocument();
  expect(screen.getByText(/100 each/i)).toBeInTheDocument();
  expect(screen.getAllByText(/200/i).length).toBeGreaterThan(0)
});

test("shows loader while order items are loading", () => {
  (getOrdersItemsApi as jest.Mock).mockReturnValue(new Promise(() => {}));

  renderOrderDetails();

  expect(screen.getByTestId("order-details-loader")).toBeInTheDocument();
});

test("calculates subtotal and total correctly for multiple items", async () => {
  (getOrdersItemsApi as jest.Mock).mockResolvedValue([
    {
      orderItemsId: 1,
      orderId: 1,
      productId: 1,
      productName: "Phone",
      imageUrl: "/phone.jpg",
      category: "Electronics",
      price: 100,
      quantity: 1,
      totalPrice: 100,
    },
    {
      orderItemsId: 2,
      orderId: 1,
      productId: 2,
      productName: "Headset",
      imageUrl: "/headset.jpg",
      category: "Accessories",
      price: 50,
      quantity: 2,
      totalPrice: 100,
    },
  ]);

  renderOrderDetails();

  expect(await screen.findByText(/order summary/i)).toBeInTheDocument();
  expect(screen.getByText(/free/i)).toBeInTheDocument();
  expect(screen.getAllByText(/200/i).length).toBeGreaterThan(0);
});

test("renders product link to product details page", async () => {
  (getOrdersItemsApi as jest.Mock).mockResolvedValue([
    {
      orderItemsId: 1,
      orderId: 1,
      productId: 7,
      productName: "Test Product",
      imageUrl: "/product.jpg",
      category: "Electronics",
      price: 100,
      quantity: 1,
      totalPrice: 100,
    },
  ]);

  renderOrderDetails();

  const productImage = await screen.findByAltText(/test product/i);
  const productLink = productImage.closest("a");

  expect(productLink).toHaveAttribute("href", "/product-details/7");
});

test("shows error toast when fetching order items fails", async () => {
  (getOrdersItemsApi as jest.Mock).mockRejectedValue({
    response: {
      data: {
        detail: "Failed to fetch order items",
      },
    },
  });

  renderOrderDetails();

  await screen.findByText(/order items/i);

  expect(toast.error).toHaveBeenCalledWith("Failed to fetch order items");
});
