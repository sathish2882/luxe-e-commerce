import Contact from "../screens/Contact";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const renderContact = () => {
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>,
  );
};

test("Contact renders correctly", () => {
  renderContact();

  expect(screen.getByText(/contact us/i)).toBeInTheDocument();
});
