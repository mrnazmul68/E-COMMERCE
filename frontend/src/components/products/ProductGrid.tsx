import { useState } from "react";
import { Check, Heart, ShoppingBag, Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Classic Oxford Button-Down Shirt",
    brand: "Urban Loom",
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
    brand: "Northline",
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
    brand: "Indigo & Co.",
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
    brand: "Coastline",
    category: "Men · Shirts",
    price: 2_250,
    originalPrice: 2_750,
    rating: "4.9",
    reviews: 32,
    image: "https://picsum.photos/500/500?random=45",
    badge: "POPULAR",
  },
  {
    id: 5,
    name: "Classic Oxford Button-Down Shirt",
    brand: "Urban Loom",
    category: "Men · Shirts",
    price: 2_950,
    originalPrice: 3_450,
    rating: "4.9",
    reviews: 28,
    image: "https://picsum.photos/500/500?random=39",
    badge: "BESTSELLER",
  },
  {
    id: 6,
    name: "Slim-Fit Stretch Shirt",
    brand: "Northline",
    category: "Men · Shirts",
    price: 2_450,
    originalPrice: 2_950,
    rating: "4.8",
    reviews: 19,
    image: "https://picsum.photos/500/500?random=41",
    badge: "JUST IN",
  },
  {
    id: 7,
    name: "Casual Denim Shirt",
    brand: "Indigo & Co.",
    category: "Men · Denim",
    price: 3_650,
    originalPrice: null,
    rating: "4.7",
    reviews: 14,
    image: "https://picsum.photos/500/500?random=43",
    badge: null,
  },
  {
    id: 8,
    name: "Printed Resort Shirt",
    brand: "Coastline",
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

const getDiscount = (price: number, originalPrice: number | null) =>
  originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

const Productgrid = () => {
  const [cartProducts, setCartProducts] = useState<number[]>([]);

  const addToCart = (productId: number) => {
    setCartProducts((cart) =>
      cart.includes(productId) ? cart : [...cart, productId],
    );
  };

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
      {products.map((product) => {
        const inCart = cartProducts.includes(product.id);
        const discount = getDiscount(product.price, product.originalPrice);

        return (
          <article
            key={product.id}
            className="group flex min-w-0 flex-col overflow-hidden bg-neutral-900/60"
          >
            {/* Image */}
            <div className="relative aspect-4/5 overflow-hidden bg-neutral-900">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-200 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-70" />

              {/* Discount — top left */}
              {discount > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-lg sm:left-4 sm:top-4 sm:text-xs">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex bg-black flex-col sm:p-4">
              <h3 className="mt-4 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-white sm:min-h-11 sm:text-14px">
                {product.name}
              </h3>

              <div className="mt-2 flex flex-wrap items-baseline gap-y-1">
                <span className="text-lg font-bold text-white sm:text-lg">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-neutral-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => addToCart(product.id)}
                disabled={inCart}
                className={`mt-4 h-8 font-bold flex w-full items-center justify-center gap-2 py-2.5 text-sm transition active:scale-[0.98] ${
                  inCart
                    ? "cursor-default bg-white/10 text-white"
                    : "bg-orange-500 text-white hover:bg-orange-400"
                }`}
              >
                {inCart ? (
                  <>
                    <Check size={16} /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default Productgrid;
