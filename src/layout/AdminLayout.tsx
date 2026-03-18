import { Layout } from "antd"
import Sidebar from "../components/sidebar/Sidebar"
import { Outlet } from "react-router-dom"

const { Content } = Layout

function AdminLayout(){

  return(

    <Layout className="admin" style={{ minHeight: "100vh" }}>

      <Sidebar/>

      <Layout>

        <Content style={{ padding: "24px" }}>
          <Outlet />
        </Content>

      </Layout>

    </Layout>

  )
}

export default AdminLayout