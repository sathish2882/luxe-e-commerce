import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/axiosInstance";

interface Product {
    id: number,
    title:string,
    price: number,
    category: string,
    image: string
}

interface ProductState {
    products: Product[],
    isLoading: boolean,
    error: string | null
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/products");
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue("Something went wrong")
    }
  },
);

const initialState: ProductState = {
        products:[],
        isLoading: false,
        error: null
}        

const productSlice = createSlice({
    name:"products",
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(fetchProducts.pending, (state)=>{
            state.isLoading = true
            state.error = null
        })
        .addCase(fetchProducts.fulfilled, (state,action)=>{
            state.isLoading = false
            state.products = action.payload
            
        })
        .addCase(fetchProducts.rejected, (state,action)=>{
            state.isLoading = false
            state.error = action.payload as string
        })
    }
})

export default productSlice.reducer
