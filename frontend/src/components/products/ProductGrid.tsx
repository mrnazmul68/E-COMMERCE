import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const formatPrice = (price: number) => `৳${price.toLocaleString("en-BD")}`;

const getDiscount = (price: number, discountPrice?: number) => {
  if (discountPrice == null || discountPrice >= price || price <= 0) {
    return 0;
  }

  return Math.round(((price - discountPrice) / price) * 100);
};

export interface ProductCardData {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
}
interface ProductGridProps {
  products: ProductCardData[];
  cols?: number;
}

const Productgrid = ({ products, cols = 4 }: ProductGridProps) => {
  const [cartProducts, setCartProducts] = useState<string[]>([]);

  const addToCart = (productId: string) => {
    setCartProducts((cart) =>
      cart.includes(productId) ? cart : [...cart, productId],
    );
  };

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols} gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8`}
    >
      {products.map((product, index) => {
        const inCart = cartProducts.includes(product.id);

        const discount = getDiscount(product.price, product.discountPrice);

        const currentPrice =
          discount > 0 ? product.discountPrice! : product.price;

        return (
          <article
            key={index}
            className="group flex min-w-0 flex-col overflow-hidden"
          >
            {/* Product Image */}
            <div className="relative aspect-4/5 overflow-hidden">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </Link>

              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-70" />

              {/* Discount Badge */}
              {discount > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-lg sm:left-4 sm:top-4 sm:text-xs">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col bg-transparent">
              {/* Name */}
              <h3 className="mt-2 min-h-10 font-bold leading-5 text-white/80 ">
                {product.name}
              </h3>

              {/* Price */}
              <div className="mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-base font-bold text-white/80 sm:text-lg">
                  {formatPrice(currentPrice)}
                </span>

                {discount > 0 && (
                  <span className="text-xs text-neutral-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={() => addToCart(product.id)}
                disabled={inCart}
                className={`mt-4 flex h-9 w-full items-center justify-center gap-2 text-xs font-bold transition active:scale-[0.98] sm:text-sm ${
                  inCart
                    ? "cursor-default bg-white/10 text-white"
                    : "bg-orange-500 text-white hover:bg-orange-400"
                }`}
              >
                {inCart ? (
                  <>
                    <Check size={16} />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Add to Cart
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
