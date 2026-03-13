import API from "./axiosInstance";
import { formatProducts, mapCartApiToClient,formatOneProduct } from "../utils/cardMapper";


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



export const updateCartApi = (items:{product_id: number,quantity:number}[]) => {
  return API.post("/cart/update", { items });
};


export const getCartApi = async() => {
  const response = await API.get("/cart/my_cart");
  return mapCartApiToClient(response.data)
};

export const getPopularProducts = async() => {
  const response = await API.get("/products/get_popular_products");
  return formatProducts(response.data)
};

export const getProductDetails = async(productId:number) => {
  const response = await API.get(`/products/products/${productId}`);
  return formatOneProduct(response.data)
};






