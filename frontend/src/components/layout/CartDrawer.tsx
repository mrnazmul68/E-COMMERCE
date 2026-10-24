import { useEffect } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
};

export type CartDrawerProps = {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CartDrawer = ({
  isOpen,
  items,
  onClose,
  onQuantityChange,
  onRemoveItem,
}: CartDrawerProps) => {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <button
        type="button"
        aria-label="Close cart drawer"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col border-l border-white/10 bg-neutral-950 text-white shadow-2xl shadow-black/40 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-baseline gap-2">
            <h2 id="cart-drawer-title" className="text-lg font-bold">
              Your cart
            </h2>
            <span className="text-sm text-gray-400">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            onClick={onClose}
            className="rounded-full p-2 text-gray-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            <X size={21} />
          </button>
        </div>

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
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              Continue shopping <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {items.map((item) => (
                <article
                  key={item.id}
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
                        {item.variant && (
                          <p className="mt-1 text-xs text-gray-400">
                            {item.variant}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name} from cart`}
                        onClick={() => onRemoveItem(item.id)}
                        className="shrink-0 rounded p-1 text-gray-400 transition hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
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
                            onQuantityChange(item.id, item.quantity - 1)
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
                            onQuantityChange(item.id, item.quantity + 1)
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
                to="/cart"
                onClick={onClose}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                View cart <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full rounded-xl py-2 text-sm font-medium text-gray-300 transition hover:text-white"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
