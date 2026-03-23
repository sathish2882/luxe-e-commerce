import Address from "../screens/Address";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const renderAddress = () => {
  render(
    <MemoryRouter>
      <Address />
    </MemoryRouter>,
  );
};

test("Address renders correctly", () => {
  renderAddress();

  expect(screen.getByText(/add new address/i)).toBeInTheDocument();
});
