import { Link } from "react-router-dom";
import { NoOrders } from "../utils/images";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { getOrdersApi } from "../services/authApi";
import { MyOrders } from "../types/authTypes";

function Orders() {
  const [orders, setOrders] = useState<MyOrders[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await getOrdersApi();
      setOrders(data)
    } catch (error: any) {
      if (error.response?.status === 404) {
      setOrders([]); 
    } else {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    }
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchOrders();
    }
  }, []);

  return (
    <section className="my-15 px-8 sm:px-10 xl:px-20 flex flex-col gap-5 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {ordersLoading && (
        <div className="flex justify-center my-4">
          <div className="loader"></div>
        </div>
      )}

      {orders.length > 0 && !ordersLoading ? (
        orders.map((order) => (
          <Link key={order.orderId} to={`/orders/${order.orderId}`} >
          
          <div className="border border-gray-300 rounded-xl p-4 shadow-lg bg-white w-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-orange-600 text-lg">
                Order #{order.orderId}
              </h3>
              <span className="text-sm text-blue-600 font-semibold">
                {order.orderStatus}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Placed on: {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <div className="flex justify-between max-sm:flex-col items-center mt-4">
              <span className="font-bold text-lg text-[var(--primary-color)]">
                ₹ {order.totalPrice}
              </span>

              <span className="text-sm text-gray-500">
                Updated: {new Date(order.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          </Link>
        ))
      ) : (
        <section className="flex flex-col items-center justify-center text-center my-15 px-8 sm:px-10 xl:px-20">
          <img src={NoOrders} alt="no orders" className="w-50 mb-6" />

          <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>

          <p className="text-gray-500 mb-6">
            Looks like you haven't placed any orders.
          </p>

          <Link
            to="/shop"
            className="bg-[var(--secondary-color)] text-white px-6 py-3 rounded-lg hover:bg-orange-400 transition"
          >
            Start Shopping
          </Link>
        </section>
      )}
    </section>
  );
}

export default Orders;
