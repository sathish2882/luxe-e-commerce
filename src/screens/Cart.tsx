import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { GiShoppingCart } from "react-icons/gi";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { RiDeleteBinLine } from "react-icons/ri";
import Cookies from "js-cookie";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
  setCart,
} from "../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  checkoutApi,
  getCartApi,
  getMyAddress,
  updateCartApi,
} from "../services/authApi";
import { useEffect, useState } from "react";
import { Button, Radio } from "antd";
import { MyAddress } from "../types/authTypes";
import { toast } from "react-toastify";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<MyAddress[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);

  let sortedAddresses;

  if (addresses) {
    sortedAddresses = addresses.sort(
      (a, b) => Number(b.isDefault) - Number(a.isDefault),
    );
  }

  const cart = useSelector((state: RootState) => state.cart);

  const handleCheckout = async () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (selectedAddress !== null) {
      try {
        const address = addresses[selectedAddress];
        console.log(address);
        console.log(selectedAddress);
        const response = await checkoutApi(address.id);
        toast.success(response.data.msg);
        dispatch(clearCart());
      } catch (error: any) {
        console.log(error);
        const message = error?.response?.data?.detail || "Something went wrong";
        toast.error(message);
      }
    }
  };

  const handleIncreaseQty = async (product: any) => {
    const token = Cookies.get("token");

    if (!token) {
      dispatch(increaseQty(product.productId));
      return;
    }

    try {
      setLoadingProductId(product.productId);
      const updatedItems = cart.items.map((item) => ({
        product_id: item.productId,
        quantity:
          item.productId === product.productId
            ? item.quantity + 1
            : item.quantity,
      }));

      await updateCartApi(updatedItems);

      const data = await getCartApi();
      dispatch(setCart(data));
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleDecreaseQty = async (product: any) => {
    const token = Cookies.get("token");

    if (!token) {
      dispatch(decreaseQty(product.productId));
      return;
    }

    try {
      setLoadingProductId(product.productId);
      if (cart.items.length === 1 && cart.items[0].quantity === 1) {
        await updateCartApi([]);

        dispatch(clearCart());

        return;
      }
      const updatedItems = cart.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      }));

      const index = updatedItems.findIndex(
        (item) => item.product_id === product.productId,
      );

      if (index !== -1) {
        if (updatedItems[index].quantity > 1) {
          updatedItems[index].quantity -= 1;
        } else {
          updatedItems.splice(index, 1);
        }
      }

      await updateCartApi(updatedItems);

      const data = await getCartApi();

      dispatch(setCart(data));
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleRemoveItem = async (product: any) => {
    const token = Cookies.get("token");

    if (!token) {
      dispatch(removeFromCart(product.productId));
      return;
    }

    try {
      setLoadingProductId(product.productId);
      if (cart.items.length === 1) {
        await updateCartApi([]);

        dispatch(clearCart());

        return;
      }
      const updatedItems = cart.items
        .filter((item) => item.productId !== product.productId)
        .map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        }));

      await updateCartApi(updatedItems);

      const data = await getCartApi();

      dispatch(setCart(data));
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleClearCart = async () => {
    const token = Cookies.get("token");

    if (!token) {
      dispatch(clearCart());
      return;
    }

    try {
      setLoading(true);
      await updateCartApi([]);

      dispatch(clearCart());
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/address");
    } else {
      navigate("/login");
    }
  };

  const fetchAddress = async () => {
    setAddressLoading(true);
    try {
      const data = await getMyAddress();
      setAddresses(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setAddresses([]);
      } else {
        const message = error?.response?.data?.detail || "Something went wrong";
        toast.error(message);
      }
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchAddress();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Luxe | Shopping Cart</title>

        <meta
          name="description"
          content="Review the products in your shopping cart at Luxe. Manage items and proceed to secure checkout."
        />
      </Helmet>
      <section className="my-10 px-8 sm:px-10 xl:px-20">
        {cart.items.length === 0 ? (
          <div className="flex flex-col justity-center gap-5 items-center text-center pt-10">
            <GiShoppingCart className="text-[70px]" />
            <h3 className="text-2xl font-bold">Your cart is empty</h3>
            <p className="text-md text-gray-500">
              Discover amazing products in our shop.
            </p>
            <Link
              to="/shop"
              className="bg-[var(--secondary-color)] text-sm text-white py-2 px-3 rounded-3xl"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div>
            <h3 className="text-3xl font-bold">Shopping Cart</h3>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="md:col-span-2 space-y-4">
                {cart.items.map((item, index) => {
                  const discountedPrice = Math.round(
                    item.price * (1 - item.discountPercent / 100),
                  );
                  return (
                    <div
                      key={`${item.productId}-${index}`}
                      className="bg-white max-sm:flex-col rounded-xl border border-1 border-gray-300 p-4 flex gap-4 items-center w-full"
                    >
                      <div className="w-24 h-24 flex items-center justify-center">
                        <img
                          src={item.imageUrl}
                          onClick={() =>
                            navigate(`/product-details/${item.productId}`)
                          }
                          alt="img"
                          className="h-25 min-w-25 object-contain m-2 rounded-xl cursor-pointer"
                        />
                      </div>

                      <div className="w-full">
                        <p className="text-sm text-gray-500 max-sm:text-center text-left">
                          {item.categoryName}
                        </p>
                        <p className="text-md font-bold max-sm:text-center text-left">
                          {item.productName}
                        </p>

                        <div className="flex items-center justify-between max-sm:flex-col w-full">
                          <div className="flex flex-col">
                            <div className="flex justify-center max-sm:justify-center items-center gap-3 mt-3 border border-1 border-gray-200 rounded-2xl h-9 w-30">
                              <button
                                onClick={() => handleDecreaseQty(item)}
                                className="px-3 py-1 hover:bg-gray-300 rounded-2xl cursor-pointer m-[1px]"
                              >
                                -
                              </button>

                              {loadingProductId === item.productId ? (
                                <div className="loader-btn text-center"></div>
                              ) : (
                                <span className="font-semibold text-center w-[40px]">
                                  {item.quantity}
                                </span>
                              )}

                              <button
                                onClick={() => handleIncreaseQty(item)}
                                className="px-3 py-1 hover:bg-gray-300 rounded-2xl cursor-pointer m-[1px]"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <p className="text-md text-[var(--primary-color)] font-medium">
                            ₹ {discountedPrice}
                            <span className="text-md text-gray-500 ml-2 line-through">
                              ₹ {item.price}
                            </span>
                          </p>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item)}
                            className="text-red-500 hover:text-red-700 text-2xl font-semibold block mt-3 cursor-pointer"
                          >
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-10">
                <div className="bg-white rounded-xl shadow-md p-6 h-fit border border-1 flex flex-col border-gray-300">
                  <Button
                    style={{ fontSize: "18px" }}
                    onClick={handleAddAddress}
                    className="self-end"
                  >
                    Add Address
                  </Button>

                  {addressLoading && (
                    <div className="flex justify-center my-4">
                      <div className="loader"></div>
                    </div>
                  )}
                  {sortedAddresses && sortedAddresses.length > 0 ? (
                    <div className="space-y-4 mt-3">
                      {(showAll
                        ? sortedAddresses
                        : sortedAddresses.filter((each) => each.isDefault)
                      ).map((address, index) => {
                        return (
                          <label
                            key={index}
                            className={`flex gap-3 p-4 border rounded-lg cursor-pointer transition ${selectedAddress === index ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                          >
                            <Radio
                              onChange={() => setSelectedAddress(index)}
                              checked={selectedAddress === index}
                            />

                            <div className="text-sm">
                              <p className="font-semibold">
                                {address.addressLine1}
                              </p>
                              <p>{address.addressLine2}</p>
                              <p>{address.city}</p>
                              <p>
                                {address.state} - {address.pincode}
                              </p>
                              <p>{address.country}</p>

                              {address.isDefault && (
                                <span className="text-xs text-blue-700 font-semibold">
                                  Default Address
                                </span>
                              )}
                            </div>
                          </label>
                        );
                      })}

                      <Button
                        onClick={() => setShowAll(!showAll)}
                        type="primary"
                      >
                        {showAll ? "Show Default" : "View All Addresses"}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500">No Address Added Yet!</p>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 h-fit border border-1 border-gray-300">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Subtotal</span>
                      <span className="text-black-500">
                        ₹ {cart.totalAmount}{" "}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Shipping</span>
                      <span className="text-black-500">Free</span>
                    </div>

                    <hr className="text-gray-300" />

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-md">Total</span>
                      <span className="font-bold text-md">
                        ₹ {cart.totalAmount}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full mt-4 bg-[var(--secondary-color)] text-white py-2 rounded-2xl hover:bg-orange-400 transition font-semibold cursor-pointer"
                  >
                    Checkout
                  </button>

                  <button
                    onClick={handleClearCart}
                    className="w-full mt-3 text-gray-400 py-2 text-sm transition font-semibold cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex justify-center">
                        <div className="loader-btn text-center"></div>
                      </div>
                    ) : (
                      <span>Clear Cart</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default Cart;
