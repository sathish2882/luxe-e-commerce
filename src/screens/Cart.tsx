import { useNavigate } from "react-router-dom";
import { GiShoppingCart } from "react-icons/gi";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { RiDeleteBinLine } from "react-icons/ri";
import { ProImg } from "../utils/images";

function Cart() {
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate("/place-order");
  };

  return (
    <>
      <Helmet>
        <title>Luxe | Shopping Cart</title>

        <meta
          name="description"
          content="Review the products in your shopping cart at Luxe. Manage items and proceed to secure checkout."
        />
      </Helmet>
      <section className="my-10 px-8 sm:px-10 xl:px-20">
        {/* <div className="flex flex-col justity-center gap-5 items-center text-center pt-10">
             <GiShoppingCart className="text-[70px]" />
             <h3 className="text-2xl font-bold">Your cart is empty</h3>
             <p className="text-md text-gray-500">Discover amazing products in our shop.</p>
             <Link to="/shop" className="bg-[var(--secondary-color)] text-sm text-white py-2 px-3 rounded-3xl">Continue Shopping</Link>
        
         </div> */}

        <h3 className="text-3xl font-bold">Shopping Cart</h3>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white max-sm:flex-col rounded-xl border border-1 border-gray-300 p-4 flex gap-4 items-center w-full">
              <div className="w-24 h-24 flex items-center justify-center">
                <img
                  src={ProImg}
                  alt="img"
                  className="h-25 min-w-25 object-contain m-2 rounded-xl"
                />
              </div>

              <div className="w-full">
                <p className="text-sm text-gray-500 max-sm:text-center text-left">
                  Electronics
                </p>
                <p className="text-md font-bold max-sm:text-center text-left">
                  Wireless Noise-Cancelling Headphones
                </p>

                <div className="flex items-center justify-between max-sm:flex-col w-full">
                  <div className="flex flex-col">
                    <div className="flex justify-start max-sm:justify-center items-center gap-3 mt-3 border border-1 border-gray-200 rounded-2xl">
                      <button className="px-3 py-1 hover:bg-gray-300 rounded-2xl cursor-pointer m-[1px]">
                        -
                      </button>

                      <span className="font-semibold">1</span>

                      <button className="px-3 py-1 hover:bg-gray-300 rounded-2xl cursor-pointer m-[1px]">
                        +
                      </button>
                    </div>
                  </div>

                  <p className="block mt-3 text-md font-bold">$249.99</p>

                  <button className="text-red-500 hover:text-red-700 text-2xl font-semibold block mt-3 cursor-pointer">
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 h-fit border border-1 border-gray-300">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Subtotal</span>
                <span className="text-black-500">$249.99</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Shipping</span>
                <span className="text-black-500">Free</span>
              </div>

              <hr className="text-gray-300" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-md">Total</span>
                <span className="font-bold text-md">$249.99</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-[var(--secondary-color)] text-white py-2 rounded-2xl hover:bg-orange-400 transition font-semibold cursor-pointer"
            >
              Checkout
            </button>

            <button className="w-full mt-3 text-gray-400 py-2 text-sm transition font-semibold cursor-pointer">
              Clear Cart
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Cart;
