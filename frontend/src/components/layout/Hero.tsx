import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-[#080808] text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24 lg:px-12">
        {/* Left content */}
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-orange-400">
            New Season Collection
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Define Your <span className="text-orange-500">Own Style.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-neutral-400 sm:text-lg">
            Discover premium fashion designed for your everyday life.
            Timeless essentials and modern styles made for you.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
            >
              Shop Collection
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/new-arrivals"
              className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white/5"
            >
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Right image */}
        <div className="mx-auto w-full max-w-lg h-100 overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1787047040601-fac11116c62a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
            alt="Nexora fashion collection"
            className="aspect-4/5 w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;