import { useSearchParams } from "react-router-dom";
import { Product } from "../types/authTypes";
import { useEffect, useState } from "react";
import { addToCartHandler } from "../utils/cartHelper";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/card/ProductCard";
import { allProductsGrid } from "./home/HomeStyle";
import { motion } from "framer-motion";
import { getProductDetails, getSearchProducts } from "../services/authApi";
import { toast } from "react-toastify";
import { NoOrders } from "../utils/images";

const containerVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function SearchResults() {
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const query = params.get("q");
  const [products, setProducts] = useState<Product[]>([]);
  const [error,setError] = useState<string>("")
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const cart = useSelector((state: RootState) => state.cart);

  const fetchSearchProductIds = async () => {
    setLoading(true);
    setError("")
    setProducts([])
    try {
      if (!query) return;

      const data = await getSearchProducts(query);
      const fullProducts = await Promise.all(
        data.map((p) => {
          return getProductDetails(p.productId);
        }),
      );

      setProducts(fullProducts);

      console.log(fullProducts);

      console.log("searchProducts", data);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message)
      setError(message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchSearchProductIds();
    }
  }, [query]);

  const handleAddToCart = async (product: any) => {
    setLoadingProductId(product.productId);
    try {
      await addToCartHandler(product, cart, dispatch);
    } finally {
      setLoadingProductId(null);
    }
  };

  console.log(error)
  console.log(products)

  return (
    <section className="px-8 sm:px-10 xl:px-20 py-15">
      {loading && (
        <div className="flex justify-center my-4">
          <div className="loader"></div>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center">
          <div className="my-30">
            <img src={NoOrders} className="w-50 mb-6" alt="not found" />
            <p className="font-semibold text-2xl">{error}!</p>;
          </div>
        </div>
      )}
      {!loading && !error && products.length > 0 && (
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
      )  }
    </section>
  );
}

export default SearchResults;
