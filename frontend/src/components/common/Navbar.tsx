import { useCallback, useEffect, useState } from "react";
import { UserRound, ShoppingCart, Menu, X, ArrowRight } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import SearchBar, { SearchBarPanel, SearchBarToggle } from "./SearchBar";
import CartDrawer, { type CartDrawerProps } from "../layout/CartDrawer";

const links = [
  { label: "Men", to: "/men" },
  { label: "Women", to: "/women" },
  { label: "Topwear", to: "/topwear" },
  { label: "Shop", to: "/shop" },
];

type NavbarProps = {
  cartCount?: number;
  cart?: Pick<
    CartDrawerProps,
    "items" | "onQuantityChange" | "onRemoveItem"
  >;
};

const Navbar = ({ cartCount = 0, cart }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const items = cart?.items ?? [];
  const displayedCartCount =
    cart?.items.reduce((count, item) => count + item.quantity, 0) ?? cartCount;
  const closeCart = useCallback(() => setCartOpen(false), []);

  // Navbar style change on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setCartOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const desktopLink = ({ isActive }: { isActive: boolean }) =>
    `relative py-1 text-sm font-medium tracking-wide transition-colors duration-200
     after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-orange-500
     after:transition-all after:duration-300
     ${
       isActive
         ? "text-white after:w-full"
         : "text-gray-400 hover:text-white after:w-0 hover:after:w-full"
     }`;

  const iconBtn =
    "relative p-2 rounded-full text-gray-300 hover:text-orange-500 hover:bg-white/10 active:scale-90 transition duration-200";

  return (
    <>
      <SearchBar>
        <header
          className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
            scrolled
              ? "bg-black/80 backdrop-blur-md border-white/10 shadow-lg shadow-black/30"
              : "bg-black border-transparent"
          }`}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-between">
              {/* Logo */}
              <Link
                to="/"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
              >
                NEXORA<span className="text-orange-500">.</span>
              </Link>

              {/* Desktop links */}
              <div className="hidden md:flex items-center gap-9">
                {links.map((l) => (
                  <NavLink key={l.label} to={l.to} className={desktopLink}>
                    {l.label}
                  </NavLink>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:gap-2">
                <SearchBarToggle />

                <button
                  type="button"
                  aria-label={`Open shopping cart${displayedCartCount > 0 ? `, ${displayedCartCount} items` : ""}`}
                  aria-expanded={cartOpen}
                  aria-controls="cart-drawer"
                  onClick={() => setCartOpen(true)}
                  className={iconBtn}
                >
                  <ShoppingCart size={22} strokeWidth={1.8} />
                  {displayedCartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white animate-pulse">
                      {displayedCartCount}
                    </span>
                  )}
                </button>

                <Link
                  to="/profile"
                  aria-label="Profile"
                  className={`${iconBtn} hidden sm:inline-flex`}
                >
                  <UserRound size={21} strokeWidth={1.8} />
                </Link>

                <button
                  aria-label="Open menu"
                  onClick={() => setMenuOpen(true)}
                  className={`${iconBtn} md:hidden`}
                >
                  <Menu size={23} />
                </button>
              </div>
            </div>
          </nav>

          <SearchBarPanel />
        </header>
      </SearchBar>

      {/* Mobile overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 right-0 z-60 h-full w-72 max-w-[85%] bg-neutral-950 border-l border-white/10 md:hidden flex flex-col transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
          <span className="text-xl font-extrabold text-white">
            NEXORA<span className="text-orange-500">.</span>
          </span>
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className={iconBtn}
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {links.map((l, i) => (
            <NavLink
              key={l.label}
              to={l.to}
              style={{
                transitionDelay: menuOpen ? `${i * 60 + 100}ms` : "0ms",
              }}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-300 ${
                  menuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-6 opacity-0"
                } ${
                  isActive
                    ? "bg-orange-500/15 text-orange-500"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {l.label}
              <ArrowRight size={16} className="opacity-50" />
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 grid grid-cols-2 gap-3">
          <Link
            to="/profile"
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-medium text-white hover:bg-white/15 active:scale-95 transition"
          >
            <UserRound size={18} /> Profile
          </Link>
          <Link
            to="/cart"
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600 active:scale-95 transition"
          >
            <ShoppingCart size={18} /> Cart
            {displayedCartCount > 0 && ` (${displayedCartCount})`}
          </Link>
        </div>
      </aside>

      <CartDrawer
        isOpen={cartOpen}
        items={items}
        onClose={closeCart}
        onQuantityChange={cart?.onQuantityChange ?? (() => {})}
        onRemoveItem={cart?.onRemoveItem ?? (() => {})}
      />
    </>
  );
};

export default Navbar;
