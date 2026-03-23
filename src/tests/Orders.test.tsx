import Orders from "../screens/Orders";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const renderOrders = () => {
  render(
    <MemoryRouter>
      <Orders />
    </MemoryRouter>,
  );
};

test("Orders renders correctly", () => {
  renderOrders();

  expect(screen.getByText(/my orders/i)).toBeInTheDocument();
});
