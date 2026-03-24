import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { OrderItems } from "../types/authTypes";
import { getOrdersItemsApi } from "../services/authApi";
import { toast } from "react-toastify";

function OrderDetails() {
  const { orderId } = useParams();

  const [orderItems, setOrderItems] = useState<OrderItems[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrderItems = async () => {
    try {
      setLoading(true);

      const data = await getOrdersItemsApi(Number(orderId));
      setOrderItems(data);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderItems();
  }, []);

  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <section className="my-15 px-8 sm:px-10 xl:px-20 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Order #{orderId}</h1>

      {loading && (
        <div className="flex justify-center my-4">
          <div data-testid="order-details-loader" className="loader"></div>
        </div>
      )}

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Order Items</h2>

        <div className="flex flex-col gap-6">
          {orderItems.map((item) => (
            <div
              key={item.orderItemsId}
              className="flex flex-col sm:flex-row gap-4 border-b pb-5"
            >
              <Link to={`/product-details/${item.productId}`}>
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-lg"
                />
              </Link>

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.productName}</h3>

                <p className="text-gray-500 text-sm">{item.category}</p>

                <p className="text-sm mt-2">Quantity: {item.quantity}</p>
              </div>

              <div className="text-right">
                <p className="text-gray-600">₹ {item.price} each</p>

                <p className="font-bold text-lg text-[var(--primary-color)]">
                  ₹ {item.totalPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        <div className="flex justify-between text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>₹ {subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-600 mb-2">
          <span>Shipping</span>
          <span>Free</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>

          <span className="text-[var(--primary-color)]">₹ {subtotal}</span>
        </div>
      </div>
    </section>
  );
}

export default OrderDetails;
