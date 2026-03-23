import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  TagsOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { userInfoApi } from "../../services/authApi";
import { toast } from "react-toastify";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

interface UserInfo {
  username: string;
  email: string;
}

const { Sider } = Layout;

function Sidebar() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserInfo | null>(null);
  console.log(user);

  const fetchUser = async () => {
    console.log("Get User Called");
    try {
      const response = await userInfoApi();
      setUser(response.data);
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

  const handleLogout = () => {
    navigate("/");
    Cookies.remove("token");
    Cookies.remove("userType");
  };

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case "products":
        navigate("/admin-layout/admin-products");
        break;
      case "category":
        navigate("/admin-layout/admin-category");
        break;
      default:
        navigate("/admin-layout");
    }
  };

  return (
    <Sider
      collapsible
      breakpoint="md"
      width={220}
      theme="dark"
      style={{
        background: "#0f0f1a",
        borderRight: "1px solid #1c1c2e",
      }}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <Link to="/">
            <div className="px-2 py-6 border-b border-white/5">
              <h1 className="font-bold text-2xl text-white leading-none">
                LUXE<span className="text-[var(--secondary-color)]">.</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
            </div>
          </Link>

          <div className="px-3 pt-4">
            <Menu
              theme="dark"
              mode="inline"
              onClick={handleMenuClick}
              style={{ background: "transparent", border: "none" }}
              items={[
                {
                  key: "dashboard",
                  icon: <DashboardOutlined />,
                  label: "Dashboard",
                },
                {
                  key: "products",
                  icon: <AppstoreOutlined />,
                  label: "Products",
                },
                {
                  key: "category",
                  icon: <TagsOutlined />,
                  label: "Categories",
                },
              ]}
            />
          </div>
        </div>

        {user && (
          <div className="px-4 py-4 border-t border-white/5 mx-2 mb-2 rounded-xl bg-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                <span className="text-orange-400 text-sm font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="overflow-hidden">
                <p className="text-orange-400 text-sm font-medium truncate">
                  {user.username}
                </p>
                <p className="text-gray-500 text-xs truncate">
                  {user.email.slice(0, 10)}...
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              type="primary"
              danger
              block
              style={{ display: "flex", alignItems: "center" }}
              size="small"
            >
              <LogoutOutlined />
              <span className="max-md:hidden">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </Sider>
  );
}

export default Sidebar;
