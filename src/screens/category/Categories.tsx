import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { CategoryGrid, CategoryImg } from "./categoriesStyle";
import { ProImg } from "../../utils/images";

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

const products = [
  { id: 1, title: "Headphones", category: "All" },
  { id: 2, title: "Laptop", category: "Electronics" },
  { id: 3, title: "Shoes", category: "Clothing" },
  { id: 4, title: "Watch", category: "Home & Living" },
  { id: 5, title: "Chair", category: "Accessories" },
  { id: 6, title: "Football", category: "Sports" },
];

function Categories() {
  return (
    <>
      <Helmet>
        <title>Luxe | Product Categories</title>

        <meta
          name="description"
          content="Browse product categories at Luxe including electronics, clothing, accessories, sports, and home products."
        />
      </Helmet>
      <section className="my-15 px-8 sm:px-10 xl:px-20">
        <h3 className="text-4xl font-bold mb-3 text-black">Categories</h3>

        <p className="text-gray-500 text-md mb-8">
          Browse products by category.
        </p>

        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className={CategoryGrid}
        >
          {products.map((each) =>
            each.category !== "All" ? (
              <motion.div
                variants={cardVariant}
                key={each.id}
                className="cursor-pointer flex flex-col gap-2 mb-2"
              >
                <div className="group relative overflow-hidden rounded-xl max-h-75">
                  <img src={ProImg} className={CategoryImg} />
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
    </>
  );
}

export default Categories;
