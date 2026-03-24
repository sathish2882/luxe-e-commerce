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

test("Displays About heading correctly", () => {
  renderAbout();

  expect(
    screen.getByRole("heading", { name: /about luxe/i }),
  ).toBeInTheDocument();
});

test("Clicking Explore Products navigates to /shop", async () => {
  renderAbout();

  const link = screen.getByRole("link", { name: /explore products/i });

  expect(link).toHaveAttribute("href", "/shop");
});
