import Categories from "../screens/category/Categories";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { store } from "../redux/store";
import { Provider } from "react-redux";

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) =>
    selector({
      categories: {
        categories: [{ CategoriesId: 1, name: "Sports" }],
        categoryLoading: false,
      },
    }),
}));

jest.mock("../redux/categorySlice", () => ({
  fetchCategory: jest.fn(() => () => Promise.resolve()),
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: any) => <div>{children}</div>,
  },
}));

import { fetchCategory } from "../redux/categorySlice";

const renderCategories = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    </Provider>,
  );
};

test("Categories renders correctly", () => {
  renderCategories();

  expect(screen.getByText(/categories/i)).toBeInTheDocument();
});

test("Categories redux api renders categories successfully", async () => {
  renderCategories();

  await waitFor(() => {
    expect(fetchCategory).toHaveBeenCalled();
  });

  const category = await screen.findByText(/sports/i);

  expect(category).toBeInTheDocument();
});

test("Shows loader when products is fetching", () => {
  const useSelectorMock = jest
    .spyOn(require("react-redux"), "useSelector")

    .mockImplementation((selector: any) =>
      selector({
        categories: {
          categories: [{ CategoriesId: 1, name: "Sports" }],
          categoryLoading: true,
        },
      }),
    );

  renderCategories();

  expect(screen.getByTestId("category-section-loader")).toBeInTheDocument();
  useSelectorMock.mockRestore();
});


