import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Classic Cotton Tee",
    price: "৳1,200",
    image: "/assets/mens-collection.webp",
  },
  {
    id: 2,
    name: "Relaxed Fit Hoodie",
    price: "৳3,500",
    image: "/assets/rabbit-hero.webp",
  },
  {
    id: 3,
    name: "Slim Denim Jacket",
    price: "৳4,800",
    image: "/assets/login.webp",
  },
  {
    id: 4,
    name: "Everyday Joggers",
    price: "৳2,200",
    image: "/assets/featured.webp",
  },
  {
    id: 5,
    name: "Linen Summer Shirt",
    price: "৳2,900",
    image: "/assets/register.webp",
  },
  {
    id: 6,
    name: "Urban Bomber Jacket",
    price: "৳5,500",
    image: "/assets/womens-collection.webp",
  },
];

const NewArrivals = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#080808] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        {/* Header with arrow buttons */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            New <span className="text-orange-500">Arrivals</span>
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="flex size-11 items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="flex size-11 items-center justify-center rounded-full bg-orange-500 text-black transition hover:bg-orange-400"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth scrollbar:none [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="relative aspect-3/4 w-64 shrink-0 snap-start overflow-hidden rounded-2xl bg-neutral-900 sm:w-72"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />

              <div className="absolute inset-x-4 bottom-4">
                <h3 className="text-base font-semibold">{product.name}</h3>
                <p className="mt-1 text-sm font-medium text-orange-400">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
