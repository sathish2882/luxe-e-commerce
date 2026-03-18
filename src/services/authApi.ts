import API from "./axiosInstance";
import {
  formatProducts,
  mapCartApiToClient,
  formatOneProduct,
  formatProductIds,
  formatAddress,
  formatOrders,
  formatOrderItems,
} from "../utils/cardMapper";

export const loginApi = (data: FormData) => {
  return API.post("/login", data);
};
export const signupApi = (data: FormData) => {
  return API.post("/signup", data);
};

export const userInfoApi = () => {
  return API.post("/getuserinfo");
};

export const forgotPasswordApi = (data: FormData) => {
  return API.post("/forgot_password", data);
};
export const verifyOtpApi = (data: FormData) => {
  return API.post("/verify_forgot_otp", data);
};
export const resetPasswordApi = (data: FormData) => {
  return API.post("/set_new_password", data);
};
export const resendOtpApi = (data: FormData) => {
  return API.post("/resend_otp", data);
};

export const verifyOtpFor2FA = (data: FormData) => {
  return API.post("/verify_otp", data);
};

export const createAddress = (data: FormData) => {
  return API.post("/address/create_address", data);
};

export const getMyAddress = async () => {
  const response = await API.get("/address/my");
  return formatAddress(response.data);
};

export const updateCartApi = (
  items: { product_id: number; quantity: number }[],
) => {
  return API.post("/cart/update", { items });
};

export const getCartApi = async () => {
  const response = await API.get("/cart/my_cart");
  return mapCartApiToClient(response.data);
};

export const getPopularProducts = async () => {
  const response = await API.get("/products/get_popular_products");
  return formatProducts(response.data);
};

export const getOrdersApi = async () => {
  const response = await API.get("/orders/my");
  return formatOrders(response.data);
};

export const getOrdersItemsApi = async (orderId: number) => {
  const response = await API.get(`/order-items/${orderId}`);
  return formatOrderItems(response.data);
};

export const getSearchProducts = async (query: string | null) => {
  const searchQuery = query ?? "";
  const response = await API.get(
    `/products/search_products?product_name=${searchQuery}`,
  );
  return formatProductIds(response.data);
};

export const getProductDetails = async (productId: number) => {
  const response = await API.get(`/products/products/${productId}`);
  return formatOneProduct(response.data);
};

export const checkoutApi = (shipping_address: number) => {
  return API.post("/checkout", { shipping_address });
};

export const updateProduct = (data: FormData, productId: number) => {
  return API.put(`/products/update/${productId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const addProduct = (data: FormData) => {
  return API.post("/products/create_product", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = (productId: number) => {
  return API.delete("/products/delete", {
    params: {
      product_id: productId,
    },
  });
};

export const updateCategory = (data: FormData, categoriesId: number) => {
  return API.put(`/category/update/${categoriesId}`, data,  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const addCategory = (data: FormData) => {
  return API.post("/category/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteCategory = (categoriesId: number) => {
  return API.delete("/category/delete", {
    params: {
      categories_id: categoriesId,
    },
  });
};
