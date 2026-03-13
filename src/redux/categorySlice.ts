import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/axiosInstance";
import { formatCategory } from "../utils/cardMapper";
import { Category } from "../types/authTypes";



interface CategoryState {
  categories: Category[];
  categoryLoading: boolean;
  error: string | null;
}

export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/category/all");
      return formatCategory(response.data)

    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  },
);

const initialState: CategoryState = {
  categories: [],
  categoryLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.categoryLoading = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
