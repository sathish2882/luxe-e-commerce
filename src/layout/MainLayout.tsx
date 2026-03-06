import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";
import FooterSection from "../components/footer/Footer";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
      <FooterSection />
    </div>
  );
}

export default MainLayout;
