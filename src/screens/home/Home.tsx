import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../redux/productSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import type { AppDispatch } from "../../redux/store";
import { Helmet } from "react-helmet-async";
import { HomeImg } from "../../utils/images";
import { FaArrowRight } from "react-icons/fa";
import {
  ShopNowBtn,
  exploreBtn,
  HomeTop,
  HomeImgInsideContainer,
  PopularGrid,
  allProductsGrid,
} from "./HomeStyle";
import { motion } from "framer-motion";

import { addToCartHandler } from "../../utils/cartHelper";
import { Product } from "../../types/authTypes";
import { getPopularProducts } from "../../services/authApi";
import { toast } from "react-toastify";
import ProductCard from "../../components/card/ProductCard";

const containerVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function Home() {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);
  const [popularLoading, setPopularLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, products } = useSelector(
    (state: RootState) => state.products,
  );

  const cart = useSelector((state: RootState) => state.cart);

  const slicedProducts = products.slice(0, 8);

  useEffect(() => {
    dispatch(fetchProducts(1));
  }, [dispatch]);

  const handleAddToCart = async (product: any) => {
    setLoadingProductId(product.productId);
    try {
      await addToCartHandler(product, cart, dispatch);
    } finally {
      setLoadingProductId(null);
    }
  };

  const fetchPopularProducts = async () => {
    setPopularLoading(true);
    try {
      const data = await getPopularProducts();

      setPopularProducts(data);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setPopularLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Luxe | Modern Online Shopping</title>
        <meta
          name="description"
          content="Discover premium electronics, fashion, and lifestyle products at Luxe. Shop modern products with great deals and fast delivery."
        />
      </Helmet>
      <section className={HomeTop}>
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="my-auto flex-1 flex flex-col gap-6"
        >
          <span className="block text-[var(--secondary-color)] text-[14px] tracking-[3px] font-bold">
            NEW COLLECTION 2026
          </span>
          <h2 className="text-7xl font-bold max-w-120">
            Curated for{" "}
            <span className="text-[var(--secondary-color)]">modern</span> living
          </h2>
          <p className="max-w-120 text-gray-500 text-lg">
            Discover handpicked products that blend style, quality, and
            sustainability. Elevate your everyday.
          </p>
          <div className="flex gap-3">
            <Link to="/shop">
              <button type="button" className={ShopNowBtn}>
                Shop Now <FaArrowRight className="text-md" />
              </button>
            </Link>
            <Link to="/about">
              <button type="button" className={exploreBtn}>
                Explore
              </button>
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-1 max-md:hidden"
        >
          <div className="relative">
            <img
              src={HomeImg}
              className="w-full rounded-2xl h-auto transition-all ease duration-300"
              alt="home-img"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, ease: "linear" }}
              className={HomeImgInsideContainer}
            >
              <span className="font-bold text-lg">10K+</span>
              <p className="text-sm text-gray-500">Happy Customers</p>
            </motion.div>
          </div>
        </motion.div>
      </section>
      <section>
        <span className="block text-[var(--secondary-color)] text-[15px] font-semibold tracking-[2px] text-center mt-12">
          FEATURED
        </span>
        <h3 className="text-black-700 text-4xl font-bold text-center mt-2">
          Popular Right Now
        </h3>

        {popularLoading && (
          <div className="flex justify-center my-4">
            <div data-testid="loader" className="loader"></div>
          </div>
        )}

        {popularProducts.length > 0 && (
          <motion.div
            variants={containerVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={PopularGrid}
          >
            {popularProducts.map((product, index) => (
              <ProductCard
                key={`${product.productId}-${index}`}
                product={product}
                loadingProductId={loadingProductId}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </motion.div>
        )}
      </section>
      <section className="bg-[var(--secondary-color)] text-white text-center py-18">
        <h3 className="text-4xl font-bold mb-3">
          Free Shipping on Orders Over $100
        </h3>
        <span className="block text-white opacity-85">
          Plus easy 30-day returns on all purchases.
        </span>
      </section>

      <section className="my-15 px-8 sm:px-10 xl:px-20">
        <h3 className="text-3xl font-bold mb-3 text-black">All Products</h3>

        {isLoading && (
          <div className="flex justify-center my-4">
            <div className="loader"></div>
          </div>
        )}

        {products.length > 0 && (
          <motion.div
            variants={containerVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={allProductsGrid}
          >
            {slicedProducts.map((product, index) => (
              <ProductCard
                key={`${product.productId}-${index}`}
                product={product}
                loadingProductId={loadingProductId}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
}

export default Home;
