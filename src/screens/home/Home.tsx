import { Link } from "react-router-dom";
import { HomeImg, ProImg } from "../../utils/images";
import Cookies from "js-cookie";
import { CgShoppingCart } from "react-icons/cg";
import { FaStar } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import {
  ShopNowBtn,
  exploreBtn,
  HomeTop,
  HomeImgInsideContainer,
  PopularGrid,
  CardAddToCart,
  allProductsGrid,
} from "./homeStyle";
import { motion } from "framer-motion";

const containerVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
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

console.log(Cookies.get("token"));

function Home() {
  return (
    <>
      <section className={HomeTop}>
        {/* <div className="loader"></div> */}
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

        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className={PopularGrid}
        >
          <Link to="/product-details">
            <motion.div
              variants={cardVariant}
              className="cursor-pointer flex flex-col gap-2 mb-2"
            >
              <div className="group relative overflow-hidden rounded-xl">
                <img
                  src={ProImg}
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
              <span className="block text-gray-500 text-sm">ELECTRONICS</span>
              <p className="text-sm text-[var(--primary-color)] font-bold">
                Wireless Noise-Cancelling Headphones
              </p>
              <p className="flex items-center text-gray-500 text-sm">
                <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
                4.8 (2,341)
              </p>
              <p className="text-md text-[var(--primary-color)] font-medium">
                $249.99<span className="text-md text-gray-500 line-through ml-2"> $349.99</span>
              </p>
            </motion.div>
          </Link>
          <motion.div
            variants={cardVariant}
            className="cursor-pointer flex flex-col gap-2 mb-2"
          >
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={ProImg}
                className="w-full transition-transform duration-300 group-hover:scale-105 rounded-md"
              />

              <button className={CardAddToCart}>
                <CgShoppingCart className="text-lg" />
                Add to Cart
              </button>
            </div>
            <span className="block text-gray-500 text-sm">ELECTRONICS</span>
            <p className="text-sm text-[var(--primary-color)] font-bold">
              Wireless Noise-Cancelling Headphones
            </p>
            <p className="flex items-center text-gray-500 text-sm">
              <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
              4.8 (2,341)
            </p>
            <p className="text-md text-[var(--primary-color)] font-medium">
              $249.99<span className="text-md text-gray-500 ml-2"> $349.99</span>
            </p>
          </motion.div>
          <motion.div
            variants={cardVariant}
            className="cursor-pointer flex flex-col gap-2 mb-2"
          >
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={ProImg}
                className="w-full transition-transform duration-300 group-hover:scale-105 rounded-md"
              />
              <button className="absolute left-3 top-3 bg-[var(--secondary-color)] text-white px-2 rounded-xl">
                Eco-Friendly
              </button>
              <button className={CardAddToCart}>
                <CgShoppingCart className="text-lg" />
                Add to Cart
              </button>
            </div>
            <span className="block text-gray-500 text-sm">ELECTRONICS</span>
            <p className="text-sm text-[var(--primary-color)] font-bold">
              Wireless Noise-Cancelling Headphones
            </p>
            <p className="flex items-center text-gray-500 text-sm">
              <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
              4.8 (2,341)
            </p>
            <p className="text-md text-[var(--primary-color)] font-medium">
              $249.99<span className="text-md text-gray-500 ml-2"> $349.99</span>
            </p>
          </motion.div>
          <motion.div
            variants={cardVariant}
            className="cursor-pointer flex flex-col gap-2 mb-2"
          >
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={ProImg}
                className="w-full transition-transform duration-300 group-hover:scale-105 rounded-md"
              />

              <button className={CardAddToCart}>
                <CgShoppingCart className="text-lg" />
                Add to Cart
              </button>
            </div>
            <span className="block text-gray-500 text-sm">ELECTRONICS</span>
            <p className="text-sm text-[var(--primary-color)] font-bold">
              Wireless Noise-Cancelling Headphones
            </p>
            <p className="flex items-center text-gray-500 text-sm">
              <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
              4.8 (2,341)
            </p>
            <p className="text-md text-[var(--primary-color)] font-medium">
              $249.99<span className="text-md text-gray-500 ml-2"> $349.99</span>
            </p>
          </motion.div>
        </motion.div>
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

        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className={allProductsGrid}
        >
          <motion.div
            variants={cardVariant}
            className="cursor-pointer flex flex-col gap-2 mb-2"
          >
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={ProImg}
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
            <span className="block text-gray-500 text-sm">ELECTRONICS</span>
            <p className="text-sm text-[var(--primary-color)] font-bold">
              Wireless Noise-Cancelling Headphones
            </p>
            <p className="flex items-center text-gray-500 text-sm">
              <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
              4.8 (2,341)
            </p>
            <p className="text-md text-[var(--primary-color)] font-medium">
              $249.99<span className="text-md text-gray-500 ml-2"> $349.99</span>
            </p>
          </motion.div>

          <motion.div
            variants={cardVariant}
            className="cursor-pointer flex flex-col gap-2 mb-2"
          >
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={ProImg}
                className="w-full transition-transform duration-300 group-hover:scale-105 rounded-md"
              />

              <button className={CardAddToCart}>
                <CgShoppingCart className="text-lg" />
                Add to Cart
              </button>
            </div>
            <span className="block text-gray-500 text-sm">ELECTRONICS</span>
            <p className="text-sm text-[var(--primary-color)] font-bold">
              Wireless Noise-Cancelling Headphones
            </p>
            <p className="flex items-center text-gray-500 text-sm">
              <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
              4.8 (2,341)
            </p>
            <p className="text-md text-[var(--primary-color)] font-medium">
              $249.99<span className="text-md text-gray-500 ml-2"> $349.99</span>
            </p>
          </motion.div>
          <motion.div
            variants={cardVariant}
            className="cursor-pointer flex flex-col gap-2 mb-2"
          >
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={ProImg}
                className="w-full transition-transform duration-300 group-hover:scale-105 rounded-md"
              />
              <button className="absolute left-3 top-3 bg-[var(--secondary-color)] text-white px-2 rounded-xl">
                Eco-Friendly
              </button>
              <button className={CardAddToCart}>
                <CgShoppingCart className="text-lg" />
                Add to Cart
              </button>
            </div>
            <span className="block text-gray-500 text-sm">ELECTRONICS</span>
            <p className="text-sm text-[var(--primary-color)] font-bold">
              Wireless Noise-Cancelling Headphones
            </p>
            <p className="flex items-center text-gray-500 text-sm">
              <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
              4.8 (2,341)
            </p>
            <p className="text-md text-[var(--primary-color)] font-medium">
              $249.99<span className="text-md text-gray-500 ml-2"> $349.99</span>
            </p>
          </motion.div>
          <motion.div
            variants={cardVariant}
            className="cursor-pointer flex flex-col gap-2 mb-2"
          >
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={ProImg}
                className="w-full transition-transform duration-300 group-hover:scale-105 rounded-md"
              />

              <button className={CardAddToCart}>
                <CgShoppingCart className="text-lg" />
                Add to Cart
              </button>
            </div>
            <span className="block text-gray-500 text-sm">ELECTRONICS</span>
            <p className="text-sm text-[var(--primary-color)] font-bold">
              Wireless Noise-Cancelling Headphones
            </p>
            <p className="flex items-center text-gray-500 text-sm">
              <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
              4.8 (2,341)
            </p>
            <p className="text-md text-[var(--primary-color)] font-medium">
              $249.99<span className="text-md text-gray-500 ml-2"> $349.99</span>
            </p>
          </motion.div>
          <motion.div
            variants={cardVariant}
            className="cursor-pointer flex flex-col gap-2 mb-2"
          >
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={ProImg}
                className="w-full transition-transform duration-300 group-hover:scale-105 rounded-md"
              />
              <button className="absolute left-3 top-3 bg-[var(--secondary-color)] text-white px-2 rounded-xl">
                Handcrafted
              </button>
              <button className={CardAddToCart}>
                <CgShoppingCart className="text-lg" />
                Add to Cart
              </button>
            </div>
            <span className="block text-gray-500 text-sm">ELECTRONICS</span>
            <p className="text-sm text-[var(--primary-color)] font-bold">
              Wireless Noise-Cancelling Headphones
            </p>
            <p className="flex items-center text-gray-500 text-sm">
              <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
              4.8 (2,341)
            </p>
            <p className="text-md text-[var(--primary-color)] font-medium">
              $249.99<span className="text-md text-gray-500 ml-2"> $349.99</span>
            </p>
          </motion.div>
          <motion.div
            variants={cardVariant}
            className="cursor-pointer flex flex-col gap-2 mb-2"
          >
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={ProImg}
                className="w-full transition-transform duration-300 group-hover:scale-105 rounded-md"
              />
              <button className="absolute left-3 top-3 bg-[var(--secondary-color)] text-white px-2 rounded-xl">
                20% Off
              </button>
              <button className={CardAddToCart}>
                <CgShoppingCart className="text-lg" />
                Add to Cart
              </button>
            </div>
            <span className="block text-gray-500 text-sm">ELECTRONICS</span>
            <p className="text-sm text-[var(--primary-color)] font-bold">
              Wireless Noise-Cancelling Headphones
            </p>
            <p className="flex items-center text-gray-500 text-sm">
              <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
              4.8 (2,341)
            </p>
            <p className="text-md text-[var(--primary-color)] font-medium">
              $249.99<span className="text-md text-gray-500 ml-2"> $349.99</span>
            </p>
          </motion.div>
          <motion.div
            variants={cardVariant}
            className="cursor-pointer flex flex-col gap-2 mb-2"
          >
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={ProImg}
                className="w-full transition-transform duration-300 group-hover:scale-105 rounded-md"
              />

              <button className={CardAddToCart}>
                <CgShoppingCart className="text-lg" />
                Add to Cart
              </button>
            </div>
            <span className="block text-gray-500 text-sm">ELECTRONICS</span>
            <p className="text-sm text-[var(--primary-color)] font-bold">
              Wireless Noise-Cancelling Headphones
            </p>
            <p className="flex items-center text-gray-500 text-sm">
              <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
              4.8 (2,341)
            </p>
            <p className="text-md text-[var(--primary-color)] font-medium">
              $249.99<span className="text-md text-gray-500 ml-2"> $349.99</span>
            </p>
          </motion.div>
          <motion.div
            variants={cardVariant}
            className="cursor-pointer flex flex-col gap-2 mb-2"
          >
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={ProImg}
                className="w-full transition-transform duration-300 group-hover:scale-105 rounded-md"
              />

              <button className={CardAddToCart}>
                <CgShoppingCart className="text-lg" />
                Add to Cart
              </button>
            </div>
            <span className="block text-gray-500 text-sm">ELECTRONICS</span>
            <p className="text-sm text-[var(--primary-color)] font-bold">
              Wireless Noise-Cancelling Headphones
            </p>
            <p className="flex items-center text-gray-500 text-sm">
              <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
              4.8 (2,341)
            </p>
            <p className="text-md text-[var(--primary-color)] font-medium">
              $249.99<span className="text-md text-gray-500 ml-2"> $349.99</span>
            </p>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

export default Home;
