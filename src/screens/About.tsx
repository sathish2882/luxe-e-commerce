import { AboutImg } from "../utils/images";

function About() {
  return (
    <section className="my-15 px-8 sm:px-10 xl:px-20">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

    
        <div>
          <img
            src={AboutImg}
            alt="about luxe"
            className="rounded-xl shadow-lg w-full object-cover"
          />
        </div>

   
        <div className="flex flex-col gap-5">

          <h2 className="text-4xl font-bold text-gray-900">
            About <span className="text-[var(--secondary-color)]">Luxe</span>
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Luxe is your destination for discovering premium products with a
            seamless shopping experience. Our platform brings together a
            curated collection of fashion, electronics, and lifestyle products
            designed to meet modern needs.
          </p>

          <p className="text-gray-600 leading-relaxed">
            We focus on quality, reliability, and style to ensure every product
            you purchase delivers great value. With secure checkout, fast
            delivery, and a user-friendly interface, Luxe makes online shopping
            simple and enjoyable.
          </p>

          <button className="w-fit bg-[var(--secondary-color)] text-white px-6 py-2 rounded-3xl hover:bg-orange-500 transition">
            Explore Products
          </button>

        </div>

      </div>

    </section>
  );
}

export default About;