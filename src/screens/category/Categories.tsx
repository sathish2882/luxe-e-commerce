import { motion } from "framer-motion";
import { categoryGrid } from "./categoriesStyle";
import { ProImg } from "../../utils/images";

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

const products = [
  { id: 1, title: "Headphones", category: "All" },
  { id: 2, title: "Laptop", category: "Electronics" },
  { id: 3, title: "Shoes", category: "Clothing" },
  { id: 4, title: "Watch", category: "Home & Living" },
  { id: 5, title: "Chair", category: "Accessories" },
  { id: 5, title: "Chair", category: "Sports" },
];

function Categories() {
  return (
    <section className="my-15 px-8 sm:px-10 xl:px-20">
      <h3 className="text-4xl font-bold mb-3 text-black">Categories</h3>

      <p className="text-gray-500 text-md mb-8">Browse products by category.</p>

      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={categoryGrid}
      >
        {products.map((each) =>
          each.category !== "All" ? (
            <motion.div
              variants={cardVariant}
              className="cursor-pointer flex flex-col gap-2 mb-2"
            >
              <div className="group relative overflow-hidden rounded-xl">
                <img
                  src={ProImg}
                  className="w-full transition-transform duration-300 group-hover:scale-110 rounded-md"
                />
                <h3 className="text-white text-2xl font-bold absolute left-5 bottom-5">
                  {each.category}
                </h3>
              </div>
            </motion.div>
          ) : (
            ""
          ),
        )}
      </motion.div>
    </section>
  );
}

export default Categories;
