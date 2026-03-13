import { Button, Skeleton } from "antd";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { fetchProducts, fetchProductsByCategory } from "../redux/productSlice";
import { allProductsGrid, CardAddToCart } from "./home/homeStyle";
import { CgShoppingCart } from "react-icons/cg";
import { FaStar } from "react-icons/fa6";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import type { AppDispatch } from "../redux/store";
import { addToCartHandler } from "../utils/cartHelper";
import { fetchCategory } from "../redux/categorySlice";
import { useNavigate, useParams } from "react-router-dom";

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
  const { categoriesId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { categories, categoryLoading } = useSelector(
    (state: RootState) => state.categories,
  );

  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

  const { isLoading, products } = useSelector(
    (state: RootState) => state.products,
  );

  const cart = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchCategory());
    if (categoriesId) {
      dispatch(fetchProductsByCategory(Number(categoriesId)));
    } else {
      dispatch(fetchProducts());
    }
  }, [dispatch, categoriesId]);

  const handleAddToCart = async (product: any) => {
    setLoadingProductId(product.productId);
    try {
      await addToCartHandler(product, cart, dispatch);
    } finally {
      setLoadingProductId(null);
    }
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

        {categoryLoading ? (
          <div className="flex items-center flex-wrap gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton.Button
                key={index}
                style={{ width: 90 }}
                active
                size="default"
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center flex-wrap gap-3">
            <Button
              className={!categoriesId ? "active-category" : "filter-btn"}
              onClick={() => navigate("/shop")}
              type="primary"
            >
              All
            </Button>

            {categories.map((category) => (
              <Button
                className={
                  Number(categoriesId) === category.categoriesId
                    ? "active-category"
                    : "filter-btn"
                }
                onClick={() => navigate(`/shop/${category.categoriesId}`)}
                type="primary"
                key={category.name}
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center my-4">
            <div className="loader"></div>
          </div>
        )}

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

              const isInCart = cart.items.some(
                (item) => item.productId === product.productId,
              );

              return (
                <motion.div
                  variants={cardVariant}
                  className="cursor-pointer flex flex-col gap-2 mb-2"
                  onClick={()=> navigate(`/product-details/${product.productId}`)}
                  key={product.productId}
                >
                  <div className="group relative overflow-hidden rounded-xl">
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      className="w-full transition-transform duration-300 group-hover:scale-105 rounded-md"
                    />
                    {product.tag ? (
                      <button className="absolute left-3 top-3 bg-[var(--secondary-color)] text-white px-2 rounded-xl">
                        {product.tag}
                      </button>
                    ) : (
                      ""
                    )}
                    <button
                      onClick={(e) => {e.stopPropagation(); handleAddToCart(product)}}
                      className={CardAddToCart}
                      disabled={isInCart}
                    >
                      {loadingProductId === product.productId ? (
                        <div className="loader-btn"></div>
                      ) : (
                        <div className="flex items-center">
                          <CgShoppingCart className="text-lg mr-2" />
                          {isInCart ? "Added" : "Add to Cart"}
                        </div>
                      )}
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
