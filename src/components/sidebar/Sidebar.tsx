import { Layout, Menu} from "antd";
import {
  AppstoreOutlined,
  TagsOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Sider } = Layout;

function Sidebar() {
  const navigate = useNavigate();

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
    <Sider collapsible breakpoint="md" width={220} className="sider" theme="dark">
      <div>
      <Link to="/">
        <h1 className="font-bold text-2xl text-white leading-none max-md:px-1 py-7 px-7">
          LUXE<span className="text-[var(--secondary-color)]">.</span>
        </h1>
      </Link>
      <Menu
        theme="dark"
        mode="inline"
        onClick={handleMenuClick}
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
    </Sider>
  );
}

export default Sidebar;
