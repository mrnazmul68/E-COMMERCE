import { useEffect } from "react";
import { X } from "lucide-react";
import CartContenta from "../cart/CartContenta";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image?: string;
};

export type CartDrawerProps = {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
};

const CartDrawer = ({
  isOpen,
  items,
  onClose,
  onQuantityChange,
  onRemoveItem,
}: CartDrawerProps) => {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

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
        className={`fixed inset-y-0 right-0 z-60 flex w-full max-w-md flex-col border-l border-white/10 bg-neutral-950 text-white shadow-2xl shadow-black/40 transition-transform duration-300 ease-out ${
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
            className="rounded-full p-2 text-gray-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            <X size={21} />
          </button>
        </div>

        <CartContenta
          items={items}
          onClose={onClose}
          onQuantityChange={onQuantityChange}
          onRemoveItem={onRemoveItem}
        />
      </aside>
    </>
  );
};

export default CartDrawer;
