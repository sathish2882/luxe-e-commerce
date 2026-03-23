import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import userEvent from "@testing-library/user-event";
import { store } from "../redux/store";
import { Provider } from "react-redux";

jest.mock("../screens/Profile", () => ({
  __esModule: true,
  default: () => <div>Mock Profile</div>,
}));

const renderNavbar = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>,
  );
};

test("renders navbar logo", () => {
  renderNavbar();
  expect(screen.getAllByText(/LUXE/i)[0]).toBeInTheDocument();
});

test("renders navigation links", () => {
  renderNavbar();

  expect(screen.getAllByText("Home")[0]).toBeInTheDocument();
  expect(screen.getAllByText("Shop")[0]).toBeInTheDocument();
  expect(screen.getAllByText("Categories")[0]).toBeInTheDocument();
  expect(screen.getAllByText("About")[0]).toBeInTheDocument();
});

test("search input appears when search icon clicked", async () => {
  renderNavbar();

  const searchBtn = screen.getByLabelText("search btn");
  await userEvent.click(searchBtn);

  const searchInput = screen.getByPlaceholderText(/Search products/i);
  expect(searchInput).toBeInTheDocument();
});

test("menu items appears when menu icon clicked", async () => {
  renderNavbar();

  const menuBtn = screen.getByLabelText("menu btn");
  await userEvent.click(menuBtn);

  const closeIcon = screen.getByLabelText("close icon");
  expect(closeIcon).toBeInTheDocument();
});
