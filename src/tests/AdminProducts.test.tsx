import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminProducts from "../screens/admin/AdminProducts";
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
        products: [
          {
            productId: 1,
            productName: "Phone",
            categoryName: "Electronics",
            price: 1000,
            discountPercent: 10,
            status: "active",
          },
        ],
        isLoading: false,
        currentPage: 1,
        totalCount: 1,
      },
    }),
}));

jest.mock("../redux/productSlice", () => ({
  fetchProducts: jest.fn(() => () => Promise.resolve()),
}));

jest.mock("../services/authApi", () => ({
  addProduct: jest.fn(),
}));

jest.mock("../components/table/Table", () => () => <div>Products Table</div>);

import { fetchProducts } from "../redux/productSlice";
import { addProduct } from "../services/authApi";

const renderAdminProducts = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <AdminProducts />
      </MemoryRouter>
    </Provider>,
  );

beforeEach(() => {
  jest.clearAllMocks();
});

test("AdminProducts renders correctly", () => {
  renderAdminProducts();

  expect(screen.getByText(/^products$/i)).toBeInTheDocument();
  expect(screen.getByText(/add product/i)).toBeInTheDocument();
});

test("AdminProducts dispatches redux actions", async () => {
  renderAdminProducts();

  await waitFor(() => {
    expect(fetchProducts).toHaveBeenCalledWith(1);
  });
});

test("AdminProducts shows table when loading is false", () => {
  renderAdminProducts();

  expect(screen.getByText(/products table/i)).toBeInTheDocument();
});

test("AdminProducts shows loader when products are loading", () => {
  const useSelectorMock = jest
    .spyOn(require("react-redux"), "useSelector")

    .mockImplementation((selector: any) =>
      selector({
        products: {
          products: [
            {
              productId: 1,
              productName: "Phone",
              categoryName: "Electronics",
              price: 1000,
              discountPercent: 10,
              status: "active",
            },
          ],
          isLoading: true,
          currentPage: 1,
          totalCount: 1,
        },
      }),
    );

  renderAdminProducts();

  expect(screen.getByTestId("products-table-loader")).toBeInTheDocument();
  useSelectorMock.mockRestore();
});

test("opens add product modal when Add Product is clicked", async () => {
  renderAdminProducts();

  await userEvent.click(screen.getByText(/add product/i));

  expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
  expect(screen.getByText(/category id/i)).toBeInTheDocument();
  expect(screen.getByText(/product price/i)).toBeInTheDocument();
  expect(screen.getByText(/discount percent/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/product description/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
});

test("submits add product form with valid data", async () => {
  (addProduct as jest.Mock).mockResolvedValue({ data: { message: "success" } });

  renderAdminProducts();

  fireEvent.click(screen.getByLabelText("add product"));

  fireEvent.change(screen.getByLabelText(/product name/i), {
    target: { value: "Phone" },
  });
  fireEvent.change(screen.getByLabelText(/product description/i), {
    target: { value: "Nice phone" },
  });
  fireEvent.change(screen.getByLabelText(/status/i), {
    target: { value: "active" },
  });

  const spinbuttons = screen.getAllByRole("spinbutton");

  fireEvent.change(spinbuttons[0], { target: { value: "1" } });
  fireEvent.change(spinbuttons[1], { target: { value: "1000" } });
  fireEvent.change(spinbuttons[2], { target: { value: "10" } });

  fireEvent.click(screen.getByLabelText("add product form"));

  await waitFor(() => {
    expect(addProduct).toHaveBeenCalled();
  });
});
