import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminCategory from "../screens/admin/AdminCategory";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { MemoryRouter } from "react-router-dom";

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) =>
    selector({
      categories: {
        categories: [{ categoriesId: 1, name: "Electronics" }],
        categoryLoading: false,
      },
    }),
}));

jest.mock("../redux/categorySlice", () => ({
  fetchCategory: jest.fn(() => () => Promise.resolve()),
}));

jest.mock("../services/authApi", () => ({
  addCategory: jest.fn(),
}));

jest.mock("../components/table/Table", () => () => <div>Category Table</div>);

import { fetchCategory } from "../redux/categorySlice";
import { addCategory } from "../services/authApi";

const renderAdminCategory = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <AdminCategory />
      </MemoryRouter>
    </Provider>,
  );

beforeEach(() => {
  jest.clearAllMocks();
});

test("AdminCategory renders correctly", () => {
  renderAdminCategory();

  expect(screen.getByText(/^categories$/i)).toBeInTheDocument();
  expect(screen.getByText(/add category/i)).toBeInTheDocument();
});

test("AdminCategory dispatches redux actions", async () => {
  renderAdminCategory();

  await waitFor(() => {
    expect(fetchCategory).toHaveBeenCalled();
  });
});

test("AdminCategory shows table when loading is false", () => {
  renderAdminCategory();

  expect(screen.getByText(/category table/i)).toBeInTheDocument();
});

test("AdminCategory shows loader when category are loading", () => {
  const useSelectorMock = jest
    .spyOn(require("react-redux"), "useSelector")

    .mockImplementation((selector: any) =>
      selector({
        categories: {
          categories: [{ categoriesId: 1, name: "Electronics" }],
          categoryLoading: true,
        },
      }),
    );

  renderAdminCategory();

  expect(screen.getByTestId("category-table-loader")).toBeInTheDocument();
  useSelectorMock.mockRestore();
});

test("opens add category modal when Add category is clicked", async () => {
  renderAdminCategory();

  await userEvent.click(screen.getByText(/add category/i));

  expect(screen.getByLabelText(/category name/i)).toBeInTheDocument();
  expect(screen.getByText(/parent id/i)).toBeInTheDocument();
});

test("submits add category form with valid data", async () => {
  (addCategory as jest.Mock).mockResolvedValue({
    data: { message: "success" },
  });

  renderAdminCategory();

  await userEvent.click(screen.getByLabelText("add category"));

  await userEvent.type(screen.getByLabelText(/category name/i), "games");

  const spinbuttons = screen.getAllByRole("spinbutton");
  await userEvent.clear(spinbuttons[0]);
  await userEvent.type(spinbuttons[0], "3");

  const button = screen.getByLabelText("add category form");
  await userEvent.click(button);

  await waitFor(() => {
    expect(addCategory).toHaveBeenCalled();
  });
});
