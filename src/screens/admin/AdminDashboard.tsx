import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect } from "react";
import { fetchProducts } from "../../redux/productSlice";
import { fetchCategory } from "../../redux/categorySlice";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const products = useSelector((state: RootState) => state.products.products);
  const category = useSelector((state:RootState) => state.categories.categories)

  const handleLogout = () =>{
     navigate("/")
     Cookies.remove("token")
     Cookies.remove("userType")
  }

    useEffect(()=>{
       dispatch(fetchProducts(1)) 
       dispatch(fetchCategory()) 
    },[dispatch])
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-end">
            <Button onClick={handleLogout} type="primary" danger>Logout</Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome Back, SATHISH 👋
        </h1>

        <p className="text-gray-500 mt-2">
         This is your Admin Dashboard. Manage products, categories and monitor platform activity.
        </p>

        <span className="inline-block mt-4 px-4 py-1 bg-purple-100 text-purple-600 font-semibold rounded-full text-sm">
          ADMIN PANEL
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
          <span className="text-gray-500 text-sm">Total Products</span>
          <p className="text-2xl font-bold text-gray-800 mt-2">{products.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
          <span className="text-gray-500 text-sm">Total Categories</span>
          <p className="text-2xl font-bold text-gray-800 mt-2">{category.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
          <span className="text-gray-500 text-sm">Revenue</span>
          <p className="text-2xl font-bold text-green-600 mt-2">250000</p>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
