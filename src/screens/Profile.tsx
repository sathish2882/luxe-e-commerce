import { memo } from "react";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userInfoApi } from "../services/authApi";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

interface UserInfo {
  username: string;
  email: string;
}

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserInfo | null>(null);

  const fetchUser = async () => {
    console.log("Get User Called");
    try {
      const response = await userInfoApi();
      setUser(response.data);
      console.log(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    }
  };
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchUser();
    }
  }, []);

  const handleLogin = () => {
    navigate("/login");

  };

  //login

  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <div className="p-4 flex flex-col gap-3 text-gray-700">
      {user ? (
        <div>
          <h3 className="font-bold">{user.username}</h3>
          <span className="text-orange-700">
            {user.email.slice(0, 8)}***@gmail.com
          </span>
        </div>
      ) : (
        ""
      )}
      <Link to="orders">
        <button className="text-left hover:text-black cursor-pointer">
          Orders
        </button>
      </Link>
      <button className="text-left hover:text-black cursor-pointer">
        Wishlist
      </button>

      {!user ? (
        <Button
          type="primary"
          onClick={handleLogin}
          style={{ backgroundColor: "#000" }}
          className="mt-3 bg-black text-white py-2 rounded cursor-pointer"
        >
          Login / Signup
        </Button>
      ) : (
        <Button
          type="primary"
          onClick={handleLogout}
          className="mt-3 text-red-500 text-left cursor-pointer"
        >
          Logout
        </Button>
      )}
    </div>
  );
}

export default memo(Profile);
