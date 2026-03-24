import Orders from "../screens/Orders";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
}));

jest.mock("../services/authApi", () => ({
  getOrdersApi: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

import Cookies from "js-cookie";
import { getOrdersApi } from "../services/authApi";
import { toast } from "react-toastify";

const renderOrders = () => {
  render(
    <MemoryRouter>
      <Orders />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

test("Orders renders correctly", () => {
  renderOrders();

  expect(screen.getByText(/my orders/i)).toBeInTheDocument();
});

test("fetches orders when token exists", async () => {
  (Cookies.get as jest.Mock).mockReturnValue("token");
  (getOrdersApi as jest.Mock).mockResolvedValue([
    {
      orderId: 1,
      shippingAddress: 1,
      status: "paid",
      updatedAt: "2024-01-02T00:00:00.000Z",
      userId: 1,
      totalPrice: 2500,
      orderStatus: "Delivered",
      createdAt: "2024-01-01T00:00:00.000Z",
      createdBy: "1",
    },
  ]);

  renderOrders();

  expect(await screen.findByText(/order #1/i)).toBeInTheDocument();
  expect(getOrdersApi).toHaveBeenCalled();
});

test("does not fetch orders when token is missing", () => {
  (Cookies.get as jest.Mock).mockReturnValue(undefined);

  renderOrders();

  expect(getOrdersApi).not.toHaveBeenCalled();
});

test("shows loader while orders are loading", () => {
  (Cookies.get as jest.Mock).mockReturnValue("token");
  (getOrdersApi as jest.Mock).mockReturnValue(new Promise(() => {}));

  renderOrders();

  expect(screen.getByTestId("orders-loader")).toBeInTheDocument();
});

test("shows error toast and fallback empty state when fetching orders fails", async () => {
  (Cookies.get as jest.Mock).mockReturnValue("token");
  (getOrdersApi as jest.Mock).mockRejectedValue({
    response: {
      status: 500,
      data: { detail: "Failed to fetch orders" },
    },
  });

  renderOrders();

  expect(await screen.findByText(/no orders yet/i)).toBeInTheDocument();

  expect(toast.error).toHaveBeenCalledWith("Failed to fetch orders");
});
