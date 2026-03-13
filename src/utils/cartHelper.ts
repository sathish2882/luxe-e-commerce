import { getCartApi, updateCartApi } from "../services/authApi";
import { setCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { addToCart } from "../redux/cartSlice";
export const syncCartAfterLogin = async (dispatch: any) => {
  console.log("products loaded in backedn cart");

  const token = Cookies.get("token");

  if (!token) return;

  try {
    const guest_cart = JSON.parse(localStorage.getItem("guest_cart") || "{}");

    console.log(guest_cart);

    if (guest_cart.items?.length > 0) {
      const payload = guest_cart.items.map((item: any) => ({
        product_id: item.productId,
        quantity: item.quantity,
      }));

      await updateCartApi(payload);
      localStorage.removeItem("guest_cart");
    }

    const data = await getCartApi();
    console.log(data);

    dispatch(setCart(data));
  } catch (error: any) {
    const message = error?.response?.data?.detail || "Something went wrong";
    toast.error(message);
    console.log(error);
  }
};

export const addToCartHandler = async (
  product: any,
  cart: any,
  dispatch: any,
  quantity: number = 1
) => {
  const token = Cookies.get("token");

  if (!token) {
    dispatch(addToCart({...product,quantity}));
    return;
  }

  const updatedItems = cart.items.map((item:any) => ({
    product_id: item.productId,
    quantity: item.quantity,
  }));

  const existing = updatedItems.find(
    (item:any) => item.product_id === product.productId,
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    updatedItems.push({
      product_id: product.productId,
      quantity: quantity,
    });
  }

  await updateCartApi(updatedItems);

  const newCart = await getCartApi();

  dispatch(setCart(newCart));
};
