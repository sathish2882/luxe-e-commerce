import { Link } from "react-router-dom";
import { FooterTop, FooterLink } from "./FooterStyle";

function FooterSection() {
  return (
    <footer>
      <div className={FooterTop}>
        <div className="flex flex-col gap-3">
          <Link to="/">
            <h1 className="font-bold text-xl">
              LUXE<span className="text-[var(--secondary-color)]">.</span>
            </h1>
          </Link>
          <p className="text-gray-500 text-sm">
            Curated products for modern living. Quality meets style.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <span className="block font-bold text-sm">Shop</span>
          <Link className={FooterLink} to="#">
            All Products
          </Link>
          <Link className={FooterLink} to="#">
            New Arrivals
          </Link>
          <Link className={FooterLink} to="#">
            Best Sellers
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <span className="block font-bold text-sm">Support</span>
          <Link className={FooterLink} to="#">
            Contact Us
          </Link>
          <Link className={FooterLink} to="#">
            FAQ
          </Link>
          <Link className={FooterLink} to="#">
            Shipping
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <span className="block font-bold text-sm">Legal</span>
          <Link className={FooterLink} to="#">
            Privacy Policy
          </Link>
          <Link className={FooterLink} to="#">
            Terms of Service
          </Link>
        </div>
      </div>
      <p className="text-center py-4 text-gray-600 text-sm">
        © 2026 LUXE. All rights reserved.
      </p>
    </footer>
  );
}

export default FooterSection;
