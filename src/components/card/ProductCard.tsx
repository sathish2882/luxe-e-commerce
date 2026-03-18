import { motion } from "framer-motion";
import { Product } from "../../types/authTypes";
import { CardAddToCart } from "../../screens/home/HomeStyle";
import { CgShoppingCart } from "react-icons/cg";
import { FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

interface CardProps {
  product: Product;
  loadingProductId: number | null;
  handleAddToCart: (product: Product) => void;
}

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

function ProductCard({
  product,
  loadingProductId,
  handleAddToCart,
}: CardProps) {
  const navigate = useNavigate();

  const cart = useSelector((state: RootState) => state.cart);

  const {
    imageUrl,
    tag,
    categoryName,
    productName,
    rating,
    price,
    totalReviews,
    productId,
    discountPercent,
  } = product;

  const discountedPrice = Math.round(price * (1 - discountPercent / 100));
  const isInCart = cart.items.some((item) => item.productId === productId);

  return (
    <motion.div
      
      onClick={() => navigate(`/product-details/${productId}`)}
      variants={cardVariant}
      className="cursor-pointer flex flex-col gap-2 mb-2"
    >
      <div className="group relative overflow-hidden rounded-xl aspect-square">
        <img
          src={imageUrl}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-md"
        />

        {tag ? (
          <button className="absolute left-3 top-3 bg-[var(--secondary-color)] text-white px-2 rounded-xl">
            {tag}
          </button>
        ) : (
          ""
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(product);
          }}
          className={CardAddToCart}
          disabled={isInCart}
        >
          {loadingProductId === productId ? (
            <div className="loader-btn"></div>
          ) : (
            <div className="flex items-center">
              <CgShoppingCart className="text-lg mr-2" />
              {isInCart ? "Added" : "Add to Cart"}
            </div>
          )}
        </button>
      </div>
      <span className="block text-gray-500 text-sm">{categoryName}</span>
      <p className="text-sm text-[var(--primary-color)] font-bold">
        {productName}
      </p>
      <p className="flex items-center text-gray-500 text-sm">
        <FaStar className="text-[var(--secondary-color)] text-md mr-1" />{" "}
        {rating} ({totalReviews})
      </p>
      <p className="text-md text-[var(--primary-color)] font-medium">
        ₹ {discountedPrice}
        <span className="text-md text-gray-500 ml-2 line-through">
          ₹ {price}
        </span>
      </p>
    </motion.div>
  );
}

export default ProductCard;
