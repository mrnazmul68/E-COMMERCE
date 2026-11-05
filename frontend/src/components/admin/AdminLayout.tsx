import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Lock page scroll only while the mobile drawer is open.
  useEffect(() => {
    if (!isSidebarOpen) return;

    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };

    if (isMobile) document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen]);

  // Reset drawer state when moving up to the persistent desktop sidebar.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => {
      if (desktop.matches) setIsSidebarOpen(false);
    };

    desktop.addEventListener("change", handleChange);
    return () => desktop.removeEventListener("change", handleChange);
  }, []);

  const section = pathname.split("/")[2] ?? "dashboard";
  const pageTitle = section.charAt(0).toUpperCase() + section.slice(1);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onOpen={openSidebar}
        onClose={closeSidebar}
      />

      {/* Mobile drawer overlay */}
      <button
        type="button"
        aria-label="Close admin sidebar"
        tabIndex={isSidebarOpen ? 0 : -1}
        onClick={closeSidebar}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`flex min-h-screen flex-col transition-[padding] duration-300 ease-out ${
          isSidebarOpen ? "lg:pl-72" : "lg:pl-20"
        }`}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-black/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Open admin sidebar"
            aria-controls="admin-sidebar"
            aria-expanded={isSidebarOpen}
            onClick={openSidebar}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-neutral-300 transition hover:border-white/20 hover:bg-white/6 hover:text-white active:scale-95 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-orange-400">
              Admin
            </p>
            <h1 className="truncate text-sm font-semibold text-white sm:text-base">
              {pageTitle}
            </h1>
          </div>

          <span className="ml-auto hidden rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-xs font-medium text-neutral-400 sm:inline-flex">
            NEXORA<span className="text-orange-500">.</span>&nbsp;control panel
          </span>
        </header>

        {/* Routed admin pages */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
