import { createHashRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../screens/home/Home";
import Shop from "../screens/Shop";
import Categories from "../screens/category/Categories";
import About from "../screens/About";
import Login from "../screens/auth/Login";
import ForgotPassword from "../screens/auth/ForgotPassword";
import Signup from "../screens/auth/Signup";
import ProtectedRoute from "./ProtectedRoute";
import ProductDetails from "../screens/ProductDetails";
import Cart from "../screens/Cart";

export const router = createHashRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "/product-details",
        element: <ProductDetails />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);
