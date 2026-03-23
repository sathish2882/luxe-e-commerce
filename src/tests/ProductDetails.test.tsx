import ProductDetails from "../screens/productDetails/ProductDetails";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import { getProductDetails } from "../services/authApi";

jest.mock("../services/authApi", () => ({
  getProductDetails: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ productId: "1" }),
}));

const renderProductDetails = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductDetails />
      </MemoryRouter>
    </Provider>,
  );
};

test("ProductDetails renders correctly", async () => {
  (getProductDetails as jest.Mock).mockResolvedValue({
    productId: 1,
    productName: "Test Product",
    price: 100,
    categoryName: "Electronics",
    imageUrl: "/product.jpg",
    discountPercent: 10,
    totalReviews: 10,
    rating: 4.5,
    description: "Test description",
    sku: "SKU-1",
    status: "active",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    createdBy: 1,
    tag: "New",
  });

  renderProductDetails();

  expect(await screen.findByText(/test product/i)).toBeInTheDocument();
});
