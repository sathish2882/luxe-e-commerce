import { Helmet } from "react-helmet-async";
import { FaArrowLeft } from "react-icons/fa";
import { CgShoppingCart } from "react-icons/cg";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { FiMinus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { AddToCart } from "./ProductDetailsStyle";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getProductDetails } from "../../services/authApi";
import { useParams } from "react-router-dom";
import { Product } from "../../types/authTypes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addToCartHandler } from "../../utils/cartHelper";

function ProductDetails() {
  const dispatch = useDispatch();
  const { productId } = useParams<{ productId: string }>();
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [qty, setQty] = useState<number>(1);

  const cart = useSelector((state: RootState) => state.cart);

  const discountedPrice = product
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : 0;

  const isInCart = cart.items.some(
    (item) => item.productId === product?.productId,
  );

  useEffect(() => {
    if (product) {
      const cartItem = cart.items.find(
        (item) => item.productId === product.productId,
      );

      if (cartItem) {
        setQty(cartItem.quantity);
      }
    }
  }, [product, cart]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);

      const data = await getProductDetails(Number(productId));

      setProduct(data);
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: any) => {
    setLoadingProductId(product.productId);
    try {
      await addToCartHandler(product, cart, dispatch, qty);
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleIncreaseQty = () => {
    setQty((prev) => prev + 1);
  };

  const handleDecreaseQty = () => {
    setQty((prev) => prev - 1);
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Luxe | Wireless Noise-Cancelling Headphones</title>
        <meta
          name="description"
          content={`Buy Wireless Noise-Cancelling Headphones at Luxe with premium sound quality and modern design.`}
        />
      </Helmet>
      <section className="my-15 px-8 sm:px-10 xl:px-20">
        <Link to="/" className="text-gray-500 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to shop
        </Link>

        {loading && (
          <div className="flex justify-center my-6">
            <div className="loader"></div>
          </div>
        )}

        <div className="cursor-pointer flex max-lg:flex-col gap-10 my-5 items-center">
          <div className="max-w-160">
            <img
              src={product?.imageUrl}
              className="w-full duration-300 rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <span className="block text-[var(--secondary-color)] font-bold tracking-[2px] text-[15px]">
              {product?.categoryName}
            </span>
            {product?.tag ? (
              <button className="absolute left-3 top-3 bg-[var(--secondary-color)] text-white px-2 rounded-xl">
                {product.tag}
              </button>
            ) : (
              ""
            )}
            <h3 className="text-4xl text-[var(--primary-color)] font-bold max-w-150 my-4">
              {product?.productName}
            </h3>
            <p className="text-lg">{product?.description}</p>
            <p className="flex items-center text-gray-500 gap-1 text-sm">
              <FaStar className="text-[var(--secondary-color)] mb-[2px] text-md mr-1" />{" "}
              <span className="text-black text-lg">{product?.rating}</span> (
              {product?.totalReviews} reviews)
            </p>

            <p className="text-3xl text-[var(--primary-color)] font-bold">
              ₹ {discountedPrice}
              <span className="text-[20px] font-medium line-through text-gray-500 ml-2">
                {" "}
                ₹ {product?.price}
              </span>
            </p>
            <div className="flex items center gap-4">
              <div className="flex items-center gap-2 border border-1 border-[rgb(244,240,240)] rounded-3xl h-10">
                <Button
                  style={{
                    border: "none",
                    background: "transparent",
                    borderWidth: "none",
                    
                  }}
                  disabled={isInCart}
                  onClick={handleDecreaseQty}
                >
                  <FiMinus />
                </Button>
                <span>{qty}</span>
                <Button
                  style={{
                    border: "none",
                    background: "transparent",
                    borderWidth: "none",
                  }}
                  disabled={isInCart}
                  onClick={handleIncreaseQty}
                >
                  <FaPlus />
                </Button>
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                className={AddToCart}
                disabled={isInCart}
              >
                {loadingProductId === product?.productId ? (
                  <div className="loader-btn"></div>
                ) : (
                  <div className="flex items-center">
                    <CgShoppingCart className="text-lg mr-2" />
                    {isInCart ? "Added" : "Add to Cart"}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductDetails;
