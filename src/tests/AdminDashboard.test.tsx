import { render, screen, waitFor } from "@testing-library/react";
import AdminDashboard from "../screens/admin/AdminDashboard";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { MemoryRouter } from "react-router-dom";

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) =>
    selector({
      products: {
        products: [{ productId: 1, productName: "Phone" }],
      },
      categories: {
        categories: [{ categoriesId: 1, name: "sports" }],
      },
    }),
}));

jest.mock("../redux/productSlice", () => ({
  fetchProducts: jest.fn(() => () => Promise.resolve()),
}));

jest.mock("../redux/categorySlice", () => ({
  fetchCategory: jest.fn(() => () => Promise.resolve()),
}));

jest.mock("../services/authApi", () => ({
  userInfoApi: jest.fn(() =>
    Promise.resolve({
      data: {
        username: "admin",
        email: "admin@gmail.com",
      },
    }),
  ),
  getAllOrdersApi: jest.fn(() =>
    Promise.resolve([
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 },
    ]),
  ),
}));

jest.mock("js-cookie", () => ({
  get: jest.fn(() => "token"),
}));

import { fetchProducts } from "../redux/productSlice";
import { fetchCategory } from "../redux/categorySlice";

const renderAdminDashboard = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    </Provider>,
  );

beforeEach(() => {
  jest.clearAllMocks();
});

test("AdminDashboard renders correctly", () => {
  renderAdminDashboard();

  expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/admin panel/i)).toBeInTheDocument();
  expect(screen.getByText(/total products/i)).toBeInTheDocument();
  expect(screen.getByText(/total categories/i)).toBeInTheDocument();
  expect(screen.getByText(/revenue/i)).toBeInTheDocument();
});

test("AdminDashboard dispatches redux actions", async () => {
  renderAdminDashboard();

  await waitFor(() => {
    expect(fetchProducts).toHaveBeenCalledWith(1);
    expect(fetchCategory).toHaveBeenCalled();
  });
});

test("AdminDashboard shows product and category counts", () => {
  renderAdminDashboard();

  const counts = screen.getAllByText("1");
  expect(counts).toHaveLength(2);
});

test("AdminDashboard shows welcome message", () => {
  renderAdminDashboard();

  expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  expect(
    screen.getByText(
      /this is your admin dashboard\. manage products, categories and monitor platform activity\./i,
    ),
  ).toBeInTheDocument();
});

test("AdminDashboard shows username when user api succeeds", async() => {
  renderAdminDashboard();

   expect(await screen.findByText(/welcome back, admin/i)).toBeInTheDocument();
});

test("AdminDashboard calculates revenue from orders", async() => {
  renderAdminDashboard();

   expect(await screen.findByText("250")).toBeInTheDocument();
});
