import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { CategoryGrid, CategoryImg } from "./categoriesStyle";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../redux/categorySlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";

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

function Categories() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { categoryLoading, categories } = useSelector(
    (state: RootState) => state.categories,
  );

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

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

        {categoryLoading && (
          <div className="flex justify-center my-4">
            <div data-testid="category-section-loader" className="loader"></div>
          </div>
        )}

        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          className={CategoryGrid}
        >
          {categories.map((category) => (
            <motion.div
              variants={cardVariant}
              key={category.categoriesId}
              className="cursor-pointer flex flex-col gap-2 mb-2"
            >
              <div className="group relative overflow-hidden rounded-xl h-64">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  aria-label="category img"
                  className={CategoryImg}
                  onClick={()=>{navigate(`/shop/${category.categoriesId}`)}}
                />
                <h3 className="text-orange-500 text-2xl font-bold absolute left-5 bottom-5">
                  {category.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}

export default Categories;
