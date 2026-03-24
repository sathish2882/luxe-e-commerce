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

test("renders contact description text", () => {
  renderContact();

  expect(
    screen.getByText(
      /have questions about our products or orders\? feel free to reach out\./i,
    ),
  ).toBeInTheDocument();
});

test("renders contact information", () => {
  renderContact();

  expect(screen.getByText(/support@luxe\.com/i)).toBeInTheDocument();
  expect(screen.getByText(/\+91 98765 43210/i)).toBeInTheDocument();
  expect(screen.getByText(/coimbatore, tamilnadu, india/i)).toBeInTheDocument();
});

test("renders contact form fields", () => {
  renderContact();

  expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
  expect(
    screen.getByPlaceholderText(/write your message/i),
  ).toBeInTheDocument();
});

test("renders send message button", () => {
  renderContact();

  expect(
    screen.getByRole("button", { name: /send message/i }),
  ).toBeInTheDocument();
});

test("renders home link in header", () => {
  renderContact();

  const homeLink = screen.getAllByRole("link")[0];
  expect(homeLink).toHaveAttribute("href", "/");
});

