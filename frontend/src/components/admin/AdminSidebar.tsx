import {
  Home,
  LogOut,
  PanelLeftOpen,
  ShoppingBag,
  Store,
  Users,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import type { AppDispatch } from "../../redux/store";

type AdminSidebarProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const navItems = [
      { label: "Dashboard", to: "/admin", icon: Home },
      { label: "Users", to: "/admin/users", icon: Users },
      { label: "Products", to: "/admin/products", icon: Store },
      { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
      { label: "Shop", to: "/admin/shop", icon: Store },
] as const;

const AdminSidebar = ({ isOpen, onOpen, onClose }: AdminSidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigate("/login");
  };

  // Desktop keeps the full sidebar open; mobile closes after navigation.
  const closeOnMobile = () => {
    if (window.matchMedia("(max-width: 1023px)").matches) onClose();
  };

  return (
    <aside
      id="admin-sidebar"
      aria-label="Admin navigation"
      className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-[#0a0a0a] text-white shadow-2xl shadow-black/60 transition-all duration-300 ease-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:w-20"
      }`}
    >
      {/* Brand / collapse handle */}
      <div
        className={`flex h-16 shrink-0 items-center justify-between border-b border-white/10 ${
          isOpen ? "px-5" : "px-5 lg:px-2"
        }`}
      >
        <Link
          to="/admin"
          onClick={closeOnMobile}
          className={`text-2xl font-extrabold tracking-tight text-white ${
            isOpen ? "" : "lg:hidden"
          }`}
        >
          NEXORA<span className="text-orange-500">.</span>
        </Link>

        <button
          type="button"
          onClick={onOpen}
          title="Open sidebar"
          aria-label="Open admin sidebar"
          aria-controls="admin-sidebar"
          aria-expanded={false}
          className={`w-full items-center justify-center gap-1.5 rounded-lg px-1 py-2 transition hover:bg-white/10 active:scale-95 ${
            isOpen ? "hidden" : "hidden lg:flex"
          }`}
        >
          <span className="text-xl font-extrabold tracking-tight text-white">
            N<span className="text-orange-500">.</span>
          </span>
          <PanelLeftOpen size={15} className="text-neutral-500" />
        </button>

        <button
          type="button"
          aria-label="Close admin sidebar"
          onClick={onClose}
          className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white/10 hover:text-white active:scale-95 ${
            isOpen ? "" : "lg:hidden"
          }`}
        >
          <X size={19} />
        </button>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Admin sections"
        className="flex-1 overflow-y-auto px-3 py-5"
      >
        <ul className="space-y-1.5">
          {navItems.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/admin"}
                onClick={closeOnMobile}
                title={label}
                aria-label={label}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                    isOpen ? "" : "lg:justify-center lg:px-2"
                  } ${
                    isActive
                      ? "bg-orange-500/15 text-orange-400"
                      : "text-neutral-400 hover:bg-white/6 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      className={`shrink-0 ${
                        isActive
                          ? "text-orange-400"
                          : "text-neutral-500 transition group-hover:text-neutral-300"
                      }`}
                    />
                    <span className={isOpen ? "" : "lg:hidden"}>{label}</span>
                    <span
                      className={`ml-auto size-1.5 rounded-full bg-orange-500 transition-opacity ${
                        isOpen ? "" : "lg:hidden"
                      } ${isActive ? "opacity-100" : "opacity-0"}`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer actions */}
      <div className="shrink-0 space-y-2 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
          className={`flex w-full items-center gap-3 rounded-xl bg-orange-500 px-3.5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400 active:scale-[0.99] ${
            isOpen ? "" : "lg:justify-center lg:px-2"
          }`}
        >
          <LogOut size={18} className="shrink-0" />
          <span className={isOpen ? "" : "lg:hidden"}>Logout</span>
        </button>
        <Link
          to="/"
          onClick={onClose}
          title="Back to home"
          aria-label="Back to home"
          className={`flex items-center gap-3 rounded-xl border border-white/10 px-3.5 py-3 text-sm font-medium text-neutral-300 transition hover:border-white/20 hover:bg-white/6 hover:text-white ${
            isOpen ? "" : "lg:justify-center lg:px-2"
          }`}
        >
          <Home size={18} className="shrink-0" />
          <span className={isOpen ? "" : "lg:hidden"}>Back to home</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
