import About from "../screens/About";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const renderAbout = () => {
  render(
    <MemoryRouter>
      <About />
    </MemoryRouter>,
  );
};

test("About renders correctly", () => {
  renderAbout();

  expect(screen.getByText(/about/i)).toBeInTheDocument();
});
