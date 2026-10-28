import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const mensCollection = "/assets/mens-collection.webp";
const womensCollection = "/assets/womens-collection.webp";

const collections = [
  {
    title: "Men's Collection",
    image: mensCollection,
    to: "/collections/all?gender=Men",
  },
  {
    title: "Women's Collection",
    image: womensCollection,
    to: "/collections/all?gender=Women",
  },
];

const GenderCollectionSection = () => {
  return (
    <section className="bg-[#080808] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Shop by <span className="text-orange-500">Category</span>
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {collections.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="group relative block aspect-4/5 overflow-hidden rounded-3xl bg-neutral-900 md:aspect-4/3"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute inset-x-5 bottom-5 flex items-center justify-between">
                <h3 className="text-xl font-semibold sm:text-2xl">
                  {item.title}
                </h3>
                <span className="flex size-11 items-center justify-center rounded-full bg-orange-500 text-black transition group-hover:bg-orange-400">
                  <ArrowRight size={20} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;