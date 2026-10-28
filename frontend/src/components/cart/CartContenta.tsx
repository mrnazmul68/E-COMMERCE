import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { CartItem } from "../layout/CartDrawer";

export type CartContentaProps = {
  items: CartItem[];
  onClose: () => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CartContenta = ({
  items,
  onClose,
  onQuantityChange,
  onRemoveItem,
}: CartContentaProps) => {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <>
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-orange-500">
            <ShoppingBag size={29} strokeWidth={1.6} />
          </div>
          <h3 className="text-lg font-semibold">Your cart is empty</h3>
          <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            Continue shopping <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <>
          <div className="cart-scrollbar flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {items.map((item) => (
              <article
                key={item.productId}
                className="flex gap-4 border-b border-white/10 pb-5"
              >
                <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-white/5">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        Color: {item.color} | Size: {item.size}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => onRemoveItem(item.productId)}
                      className="shrink-0 rounded p-1 text-gray-400 transition hover:text-red-400 focus-visible:outline-2 focus-visible:outline-orange-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                    <div className="inline-flex items-center rounded-lg border border-white/10">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name} quantity`}
                        onClick={() =>
                          onQuantityChange(item.productId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="rounded-l-lg p-2 text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus size={13} />
                      </button>
                      <span
                        aria-label={`Quantity: ${item.quantity}`}
                        className="min-w-8 text-center text-xs tabular-nums"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.name} quantity`}
                        onClick={() =>
                          onQuantityChange(item.productId, item.quantity + 1)
                        }
                        className="rounded-r-lg p-2 text-gray-300 transition hover:bg-white/10"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <p className="text-sm font-semibold tabular-nums">
                      {currencyFormatter.format(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="shrink-0 border-t border-white/10 bg-neutral-950 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Subtotal</span>
              <span className="font-semibold tabular-nums">
                {currencyFormatter.format(subtotal)}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Shipping and taxes are calculated at checkout.
            </p>
            <Link
              to="/checkout"
              onClick={onClose}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              Checkout <ArrowRight size={16} />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 block w-full rounded-xl py-2 text-sm font-medium text-gray-300 transition hover:text-white md:hidden"
            >
              Continue shopping
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default CartContenta;
