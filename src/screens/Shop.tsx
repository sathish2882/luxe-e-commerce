import { Button } from "antd";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

import { allProductsGrid, CardAddToCart } from "./home/homeStyle";
import { CgShoppingCart } from "react-icons/cg";
import { FaStar } from "react-icons/fa6";
import { useState } from "react";
import { useSelector} from "react-redux";
import type { RootState } from "../redux/store";
import type { AppDispatch } from "../redux/store";

const containerVariant = {
  hidden: {},
  show: {
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

const products = [
  { id: 1, title: "Headphones", category: "All" },
  { id: 2, title: "Laptop", category: "Electronics" },
  { id: 3, title: "Shoes", category: "Clothing" },
  { id: 4, title: "Watch", category: "Home & Living" },
  { id: 5, title: "Chair", category: "Accessories" },
  { id: 6, title: "Football", category: "Sports" },
];

function Shop() {
  
  const [activeCategory, setCategory] = useState<string>("All");

  const allProducts = useSelector(
    (state: RootState) => state.products.products,
  );
  console.log(allProducts);

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

        <div className="flex items-center flex-wrap gap-3">
          {products.map((each) => (
            <Button
              className={
                activeCategory === each.category
                  ? "active-category"
                  : "filter-btn"
              }
              onClick={() => setCategory(each.category)}
              type="primary"
              key={each.id}
            >
              {each.category}
            </Button>
          ))}
        </div>

        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          className={allProductsGrid}
        >
          {allProducts.map((product) => {
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
                  <button className={CardAddToCart}>
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
      </section>
    </>
  );
}

export default Shop;
