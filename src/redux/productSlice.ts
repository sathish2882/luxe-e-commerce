import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/axiosInstance";

interface Product {
  productId: number
  productName: string
  price: number
  categoryName: string
  imageUrl: string
  discountPercent: number
  totalReviews: number
  rating: number
  description: string
  sku: string
  status: string
  createdAt: string
  updatedAt: string
  createdBy: number

}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/products/all_products");
      const formattedProducts = response.data.map((product: any) => ({
        categoryName: product.category_name,

        createdAt: product.createdat,

        createdBy: product.createdby,

        description: product.description,

        discountPercent: product.discount_percent,

        imageUrl: product.image_url,

        price: product.price,

        totalReviews: product.total_reviews,

        rating: product.rating,

        productId: product.product_id,

        productName: product.product_name,

        sku: product.sku,

        status: product.status,

        updatedAt: product.updatedat,

      }));
      console.log(formattedProducts)

      return formattedProducts

    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  },
);

const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
