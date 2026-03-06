import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { LuMenu } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import { LuX } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { CgShoppingCart } from "react-icons/cg";
import { Profile } from "../../screens/Profile";
import { SearchInput, ProfileView, MobileView, Icons, CloseMenu } from "./NavbarStyle";
import { span } from "framer-motion/client";

export const Navlink = ({ isActive }: any) =>
  isActive
    ? "text-[var(--secondary-color)] font-medium"
    : "text-[#6b6c6c] font-medium";

function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  const handleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);


  let totalQty = 4
  return (
    <>
      <header className="sticky z-40 top-0 backdrop-blur-md bg-[rgb(249,248,245)]/80">
        <nav className="flex items-center justify-between h-16 px-10 sm:px-10 xl:px-20">
          <button className="md:hidden text-xl" onClick={handleMenu}>
            <LuMenu />
          </button>
          <Link to="/">
            <h1 className="font-bold text-2xl leading-none">
              LUXE<span className="text-[var(--secondary-color)]">.</span>
            </h1>
          </Link>
          <div className="flex items-center gap-7 max-md:hidden">
            <NavLink className={Navlink} to="/">
              Home
            </NavLink>
            <NavLink className={Navlink} to="/shop">
              Shop
            </NavLink>
            <NavLink className={Navlink} to="/categories">
              Categories
            </NavLink>
            <NavLink className={Navlink} to="/about">
              About
            </NavLink>
          </div>

          <div className="flex items-center gap-3 md:gap-4 lg:gap-7">
            <button className="flex items-center" onClick={handleSearch}>
              {isSearchOpen ? (
                <LuX className={Icons} />
              ) : (
                <IoSearch className={Icons} />
              )}
            </button>

            <div className="relative group">
              <FaRegUser className={Icons} />
              <div className={ProfileView}>
                <Profile />
              </div>
            </div>

            <div className="relative">
            <Link to="/cart">
              <CgShoppingCart className={`max-sm:hidden ${Icons}`} />
            </Link>
               {totalQty > 0 && (
                <span className="hidden sm:flex absolute md:-top-1 sm:-top-2 md:-right-1 sm:-right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full items-center justify-center">{totalQty}</span>
               )}
            </div>
          </div>
        </nav>

        <div
          className={
            isSearchOpen ? "flex items-center justify-center mb-3" : ""
          }
        >
          <input
            className={isSearchOpen ? `${SearchInput}` : "hidden"}
            placeholder="Search products..."
            type="search"
          />
        </div>
      </header>

      <div
        className={`fixed inset-0 bg-black/70 z-50 transition-opacity duration-300 md:hidden
  ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={handleMenu}
      ></div>

      <div
        className={`${MobileView}
  ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="font-bold text-xl">
                LUXE<span className="text-[var(--secondary-color)]">.</span>
              </h1>
            </Link>
            <LuX
              className={CloseMenu}
              onClick={handleMenu}
            />
          </div>

          <div className="flex flex-col gap-6 text-lg mt-5 ">
            <NavLink className={Navlink} to="/" onClick={handleMenu}>
              Home
            </NavLink>
            <NavLink className={Navlink} to="/shop" onClick={handleMenu}>
              Shop
            </NavLink>
            <NavLink className={Navlink} to="/categories" onClick={handleMenu}>
              Categories
            </NavLink>
            <NavLink className={Navlink} to="/about" onClick={handleMenu}>
              About
            </NavLink>
            <NavLink className={`${Navlink} flex items-center`} to="/cart" onClick={handleMenu}>
              Cart {totalQty > 0 && (
                <span className="sm:hidden flex bg-orange-500 text-white text-xs w-5 h-5 rounded-full items-center justify-center ml-1">{totalQty}</span>
               )}
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
