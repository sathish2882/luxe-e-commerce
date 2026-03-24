import { Button, Pagination, Skeleton } from "antd";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { fetchProducts, fetchProductsByCategory } from "../redux/productSlice";
import { allProductsGrid } from "./home/HomeStyle";
import ProductCard from "../components/card/ProductCard";
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

function Shop() {
  const { categoriesId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { categories, categoryLoading } = useSelector(
    (state: RootState) => state.categories,
  );

  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

  const { isLoading, products,totalCount,currentPage } = useSelector(
    (state: RootState) => state.products,
  );

  const cart = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchCategory());
    if (categoriesId) {
      dispatch(fetchProductsByCategory(Number(categoriesId)));
    } else {
      dispatch(fetchProducts(1));
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
          <div data-testid="category-skeleton" className="flex items-center flex-wrap gap-3">
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
            <div data-testid="shop-loader" className="loader"></div>
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
            {products.map((product, index) => (
              <ProductCard
                key={`${product.productId}-${index}`}
                product={product}
                loadingProductId={loadingProductId}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </motion.div>
        )}
        

        {!categoriesId && <div className="flex justify-center mt-6">
            <Pagination

               total={totalCount}
               current={currentPage}
               pageSize={10}
               onChange={(page)=>{
                 dispatch(fetchProducts(page))
                 window.scrollTo(0,0)
               }}
             />
        </div>}
        

      </section>
    </>
  );
}

export default Shop;
