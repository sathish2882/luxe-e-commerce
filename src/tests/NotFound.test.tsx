import NotFound from "../screens/NotFound";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const renderNotFound = () => {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>,
  );
};

test("NotFound renders correctly", () => {
  renderNotFound();

  expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  expect(
    screen.getByText(/the page you are looking for doesn't exist/i),
  ).toBeInTheDocument();
});

test("NotFound shows the not found image", () => {
  renderNotFound();

  expect(screen.getByAltText(/not found/i)).toBeInTheDocument();
});

test("NotFound renders link back to home", () => {
  renderNotFound();

  const homeLink = screen.getByRole("link", { name: /go back home/i });
  expect(homeLink).toHaveAttribute("href", "/");
});

