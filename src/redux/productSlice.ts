import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/axiosInstance";
import { Product } from "../types/authTypes";
import { formatProducts } from "../utils/cardMapper";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
}

interface ProductResponse {
  data: Product[],
  current_page:  number,
  total_count: number
}

export const fetchProducts = createAsyncThunk<ProductResponse,number>(
  "products/fetchProducts",
  async (page= 1, thunkAPI) => {
    try {
      const response = await API.get(`/products/all_products?page=${page}`);
      console.log(response);
      return {
        data: formatProducts(response.data.data),
        current_page: response.data.current_page,
        total_count: response.data.total_count,
      };
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  },
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (categoryId: number | null, thunkAPI) => {
    try {
      const response = await API.get(
        `/products/products/category/${categoryId}`,
      );
      return formatProducts(response.data);
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
  currentPage: 1,
  totalCount: 0,
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
        state.products = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalCount = action.payload.total_count;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
