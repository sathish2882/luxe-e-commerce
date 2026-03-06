import { FaArrowLeft } from "react-icons/fa";
import { ProImg } from "../../utils/images";
import { CgShoppingCart } from "react-icons/cg";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { FiMinus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { AddToCart } from "./productDetailsStyle";

function ProductDetails() {
  return (
    <section className="my-15 px-8 sm:px-10 xl:px-20">
      <Link to="/" className="text-gray-500 flex items-center">
        <FaArrowLeft className="mr-2" /> Back to shop
      </Link>

      <div className="cursor-pointer flex max-lg:flex-col gap-10 my-5 items-center">
        <div className="group relative overflow-hidden rounded-xl">
          <img src={ProImg} className="w-full duration-300 rounded-md" />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <span className="block text-[var(--secondary-color)] font-bold tracking-[2px] text-[13px]">
            ELECTRONICS
          </span>
          <button className="bg-[var(--secondary-color)] w-25 text-white text-sm px-2 rounded-xl">
            Best Seller
          </button>
          <h3 className="text-4xl text-[var(--primary-color)] font-bold max-w-150 my-4">
            Wireless Noise-Cancelling Headphones
          </h3>
          <p className="flex items-center text-gray-500 gap-1 text-sm">
            <FaStar className="text-[var(--secondary-color)] mb-[2px] text-md mr-1" />{" "}
            <span className="text-black text-lg">4.8</span> (2,341 reviews)
          </p>

          <p className="text-3xl text-[var(--primary-color)] font-bold">
            $249.99
            <span className="text-[20px] font-medium line-through text-gray-500 ml-2">
              {" "}
              $349.99
            </span>
          </p>
          <div className="flex items center gap-4">
            <div className="flex items-center gap-2 border border-1 border-[rgb(244,240,240)] rounded-3xl h-10">
              <Button style={{ border: "none",background:"transparent",borderWidth:"none" }}>
                <FiMinus />
              </Button>
              <span>1</span>
              <Button style={{ border: "none",background:"transparent",borderWidth:"none"  }}>
                <FaPlus />
              </Button>
            </div>
            <button className={AddToCart}>
              <CgShoppingCart className="text-lg mr-1 mt-[2px]" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
