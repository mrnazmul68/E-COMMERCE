
import { useState } from "react";
import { Heart, Star } from "lucide-react";

const products = [
    {
      id: 1,
      name: "Classic Oxford Button-Down Shirt",
      category: "Men · Shirts",
      price: 2_950,
      originalPrice: 3_450,
      rating: "4.9",
      reviews: 28,
      image: "https://picsum.photos/500/500?random=39",
      badge: "BESTSELLER",
    },
    {
      id: 2,
      name: "Slim-Fit Stretch Shirt",
      category: "Men · Shirts",
      price: 2_450,
      originalPrice: 2_950,
      rating: "4.8",
      reviews: 19,
      image: "https://picsum.photos/500/500?random=41",
      badge: "JUST IN",
    },
    {
      id: 3,
      name: "Casual Denim Shirt",
      category: "Men · Denim",
      price: 3_650,
      originalPrice: null,
      rating: "4.7",
      reviews: 14,
      image: "https://picsum.photos/500/500?random=43",
      badge: null,
    },
    {
      id: 4,
      name: "Printed Resort Shirt",
      category: "Men · Shirts",
      price: 2_250,
      originalPrice: 2_750,
      rating: "4.9",
      reviews: 32,
      image: "https://picsum.photos/500/500?random=45",
      badge: "POPULAR",
    },
];

const formatPrice = (price: number) => `৳${price.toLocaleString("en-BD")}`;

const YouMayAlsoLike = () => {
    const [savedProducts, setSavedProducts] = useState<number[]>([]);

    const toggleSaved = (productId: number) => {
      setSavedProducts((saved) =>
        saved.includes(productId)
          ? saved.filter((id) => id !== productId)
          : [...saved, productId],
      );
    };

    return (
      <section className="bg-[#080808] px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-orange-400">
                Picked for you
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                You may also <span className="text-orange-500">like</span>
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-400 sm:text-base">
                A few more pieces we think belong in your rotation.
              </p>
            </div>
            <p className="text-sm text-neutral-500">04 curated pieces</p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {products.map((product) => {
              const isSaved = savedProducts.includes(product.id);

              return (
                <article key={product.id} className="group min-w-0">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-900">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70" />

                    {product.badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[9px] font-bold tracking-[0.12em] text-neutral-900 sm:left-4 sm:top-4 sm:text-[10px]">
                        {product.badge}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleSaved(product.id)}
                      aria-label={
                        isSaved
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                      aria-pressed={isSaved}
                      className={`absolute right-3 top-3 flex size-9 items-center justify-center rounded-full backdrop-blur transition sm:right-4 sm:top-4 ${
                        isSaved
                          ? "bg-orange-500 text-white"
                          : "bg-black/35 text-white hover:bg-white hover:text-neutral-900"
                      }`}
                    >
                      <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="pt-4">
                    <div className="mb-2 flex items-center gap-1.5 text-xs text-neutral-400">
                      <Star
                        size={13}
                        className="fill-orange-400 text-orange-400"
                      />
                      <span className="font-medium text-white">{product.rating}</span>
                      <span>({product.reviews})</span>
                    </div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500 sm:text-xs">
                      {product.category}
                    </p>
                    <h3 className="mt-1.5 line-clamp-2 min-h-11 text-sm font-semibold leading-5 sm:text-base">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-sm font-semibold text-orange-400 sm:text-base">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-neutral-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
};

export default YouMayAlsoLike;