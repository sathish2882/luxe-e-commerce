import { Button } from "antd";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { fetchProducts } from "../redux/productSlice";
import { allProductsGrid, CardAddToCart } from "./home/homeStyle";
import { CgShoppingCart } from "react-icons/cg";
import { FaStar } from "react-icons/fa6";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import type { AppDispatch } from "../redux/store";
import { addToCart, setCart } from "../redux/cartSlice";
import Cookies from "js-cookie";
import { getCartApi, updateCartApi } from "../services/authApi";

const containerVariant = {
  hidden: {},
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

function Shop() {
  const dispatch = useDispatch<AppDispatch>();

  // const [activeCategory, setCategory] = useState<string>("All");

  const { isLoading, products } = useSelector(
    (state: RootState) => state.products,
  );

  console.log("products:", products);
  console.log("loading:", isLoading);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = async (product: any) => {
    const token = Cookies.get("token");

    if (!token) {
      dispatch(addToCart(product));
      return;
    }

    const currentCart = await getCartApi();

    const updatedItems = currentCart.map((item: any) => ({
      product_id: item.productId,
      quantity: item.quantity,
    }));

    const existing = updatedItems.find(
      (item) => item.product_id === product.productId,
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      updatedItems.push({
        product_id: product.productId,
        quantity: 1,
      });
    }

    await updateCartApi(updatedItems);

    const newCart = await getCartApi();

    dispatch(setCart(newCart));
  };

  return (
    <>
      <Helmet>
        <title>Luxe | Shop Products</title>
        <meta
          name="description"
          content="Browse all products at Luxe including electronics, fashion, and lifestyle items. Find premium products with great deals."
        />
      </Helmet>
      <section className="my-15 px-8 sm:px-10 xl:px-20">
        <h3 className="text-4xl font-bold mb-3 text-black">Shop</h3>

        <p className="text-gray-500 text-md mb-8">
          Browse our curated collection of premium products.
        </p>

        {isLoading && (
          <div className="flex justify-center my-4">
            <div className="loader"></div>
          </div>
        )}

        {/* <div className="flex items-center flex-wrap gap-3">
          {products.map((each) => (
            <Button
              className={
                activeCategory === each.categoryName
                  ? "active-category"
                  : "filter-btn"
              }
              onClick={() => setCategory(each.categoryName)}
              type="primary"
              key={each.categoryName}
            >
              {each.categoryName}
            </Button>
          ))}
        </div> */}

        {products.length > 0 && (
          <motion.div
            variants={containerVariant}
            initial="hidden"
           animate="show"
            viewport={{ once: true }}
            className={allProductsGrid}
          >
            {products.map((product) => {
              const discountedPrice = Math.round(
                product.price * (1 - product.discountPercent / 100),
              );

              return (
                <motion.div
                  variants={cardVariant}
                  className="cursor-pointer flex flex-col gap-2 mb-2"
                  key={product.productId}
                >
                  <div className="group relative overflow-hidden rounded-xl">
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      className="w-full transition-transform duration-300 group-hover:scale-105 rounded-md"
                    />
                    <button className="absolute left-3 top-3 bg-[var(--secondary-color)] text-white px-2 rounded-xl">
                      Best Seller
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={CardAddToCart}
                    >
                      <CgShoppingCart className="text-lg" />
                      Add to Cart
                    </button>
                  </div>
                  <span className="block text-gray-500 text-sm">
                    {product.categoryName}
                  </span>
                  <p className="text-sm text-[var(--primary-color)] font-bold">
                    {product.productName}
                  </p>
                  <p className="flex items-center text-gray-500 text-sm">
                    <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
                    {product.rating} ({product.totalReviews})
                  </p>
                  <p className="text-md text-[var(--primary-color)] font-medium">
                    ₹ {discountedPrice}
                    <span className="text-md text-gray-500 ml-2 line-through">
                      ₹ {product.price}
                    </span>
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
    </>
  );
}

export default Shop;
