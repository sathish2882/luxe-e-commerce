import { MdEmail } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Contact() {
  return (
    <>
      <Helmet>
        <title>Luxe | Contact Us</title>

        <meta
          name="description"
          content="Get in touch with Luxe for product inquiries, support, or feedback. Contact our team for assistance with your orders and shopping experience."
        />
      </Helmet>
      <section className="bg-gray-50 min-h-screen py-16 px-8 sm:px-10 xl:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Link to="/">
              <h1 className="font-bold text-3xl leading-none mb-6">
                LUXE<span className="text-[var(--secondary-color)]">.</span>
              </h1>
            </Link>
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-500 mb-6">
              Have questions about our products or orders? Feel free to reach
              out. Our team will respond as soon as possible.
            </p>

            <div className="space-y-3 text-gray-700">
              <a
                href="#"
                className="flex items-center text-[#000] hover:text-blue-600 hover:underline max-w-[200px]"
              >
                <MdEmail className="text-xl text-[var(--secondary-color)] mr-1" />{" "}
                support@luxe.com
              </a>
              <a
                href="#"
                className="flex items-center text-[#000] hover:text-blue-600 hover:underline max-w-[200px]"
              >
                <IoMdCall className="text-xl text-[var(--secondary-color)] mr-1" />{" "}
                +91 98765 43210
              </a>
              <a
                href="#"
                className="flex items-center text-[#000] hover:text-blue-600 hover:underline max-w-[200px]"
              >
                <IoLocation className="text-xl text-[var(--secondary-color)] mr-1" />{" "}
                Coimbatore, Tamilnadu, India
              </a>
            </div>
          </div>

          <form className="bg-white p-8 rounded-lg shadow-lg space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows={4}
                placeholder="Write your message..."
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--secondary-color)] shadow-lg text-white py-2 rounded-md hover:bg-orange-400 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Contact;
