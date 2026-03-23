import OrderDetails from "../screens/OrderDetails";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getOrdersItemsApi } from "../services/authApi";

jest.mock("../services/authApi", () => ({
  getOrdersItemsApi: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ orderId: "1" }),
}));

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
});
