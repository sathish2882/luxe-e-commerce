import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../redux/productSlice";
import { fetchCategory } from "../../redux/categorySlice";
import Cookies from "js-cookie";
import { getAllOrdersApi, userInfoApi } from "../../services/authApi";
import { toast } from "react-toastify";

interface UserInfo {
  username: string;
  email: string;
}

function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.products);
  const category = useSelector(
    (state: RootState) => state.categories.categories,
  );

  const [user, setUser] = useState<UserInfo | null>(null);
  const [revenueItems, setRevenueItems] = useState<any | null>(null);

  let revenue = 0;
  if (revenueItems) {
    revenueItems.map((each: any) => (revenue += each.price * each.quantity));
  }

  const fetchUser = async () => {
    try {
      const response = await userInfoApi();
      setUser(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    }
  };
  const fetchRevenue = async () => {
    try {
      const response = await getAllOrdersApi();
      setRevenueItems(response);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    }
  };
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchUser();
      fetchRevenue();
    }
  }, []);

  useEffect(() => {
    dispatch(fetchProducts(1));
    dispatch(fetchCategory());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome Back, {user?.username?.toUpperCase()} 👋
        </h1>

        <p className="text-gray-500 mt-2">
          This is your Admin Dashboard. Manage products, categories and monitor
          platform activity.
        </p>

        <span className="inline-block mt-4 px-4 py-1 bg-purple-100 text-purple-600 font-semibold rounded-full text-sm">
          ADMIN PANEL
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
          <span className="text-gray-500 text-sm">Total Products</span>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {products.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
          <span className="text-gray-500 text-sm">Total Categories</span>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {category.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
          <span className="text-gray-500 text-sm">Revenue</span>
          <p className="text-2xl font-bold text-green-600 mt-2">{revenue}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
