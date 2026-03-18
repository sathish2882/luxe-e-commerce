import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ children }: any) => {
  const token = Cookies.get("token");
  const userType = Cookies.get("userType");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (userType !== "admin"){
     return <Navigate to="/" replace />;
  }

  return children

 
};

export default PrivateRoute;
