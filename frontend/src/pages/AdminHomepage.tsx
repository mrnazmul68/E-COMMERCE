import {
  ArrowUpRight,
  Banknote,
  ChevronRight,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatTaka } from "../data/account";

type AdminOrderStatus = "Delivered" | "In transit" | "Processing" | "Cancelled";

type RecentOrder = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: AdminOrderStatus;
};

const stats = [
  {
    label: "Total revenue",
    value: formatTaka(284500),
    change: "+12.5%",
    note: "vs last month",
    icon: Banknote,
  },
  {
    label: "Total orders",
    value: "1,248",
    change: "+8.2%",
    note: "vs last month",
    icon: ShoppingBag,
  },
  {
    label: "Total products",
    value: "96",
    change: "+3",
    note: "new this month",
    icon: Package,
  },
] as const;

const recentOrders: RecentOrder[] = [
  {
    id: "NX-2026-1054",
    customer: "Ayesha Karim",
    date: "Nov 04, 2026",
    total: 4250,
    status: "Processing",
  },
  {
    id: "NX-2026-1053",
    customer: "Rifat Hasan",
    date: "Nov 04, 2026",
    total: 2950,
    status: "In transit",
  },
  {
    id: "NX-2026-1052",
    customer: "Sadia Islam",
    date: "Nov 03, 2026",
    total: 6480,
    status: "Delivered",
  },
  {
    id: "NX-2026-1051",
    customer: "Tanvir Ahmed",
    date: "Nov 03, 2026",
    total: 1850,
    status: "Delivered",
  },
  {
    id: "NX-2026-1050",
    customer: "Nusrat Jahan",
    date: "Nov 02, 2026",
    total: 3700,
    status: "Cancelled",
  },
];

const statusStyles: Record<AdminOrderStatus, string> = {
  Delivered: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  "In transit": "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  Processing: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
  Cancelled: "bg-neutral-500/10 text-neutral-400 ring-neutral-500/20",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AdminHomepage = () => {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, <span className="text-orange-500">Admin</span>
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Here is what is happening with your store today.
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-orange-500/40 hover:text-white sm:self-auto"
        >
          View orders <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Summary cards */}
      <section
        aria-label="Store summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {stats.map(({ label, value, change, note, icon: Icon }) => (
          <article
            key={label}
            className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 transition hover:border-orange-500/30 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex size-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                <TrendingUp size={13} />
                {change}
              </span>
            </div>

            <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              {label}
            </p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {value}
            </p>
            <p className="mt-1 text-xs text-neutral-500">{note}</p>
          </article>
        ))}
      </section>

      {/* Recent orders */}
      <section
        aria-labelledby="recent-orders-title"
        className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
          <div>
            <h3 id="recent-orders-title" className="text-base font-semibold">
              Recent orders
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              Latest 5 orders from your store.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-orange-400 transition hover:text-orange-300"
          >
            View all <ChevronRight size={14} />
          </Link>
        </div>

        <ul className="divide-y divide-white/10">
          {recentOrders.map((order) => (
            <li
              key={order.id}
              className="flex flex-col gap-3 px-4 py-4 transition hover:bg-white/2 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/6 text-sm font-semibold text-orange-400">
                  {getInitials(order.customer)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {order.customer}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-neutral-500">
                    {order.id} &middot; {order.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <p className="text-sm font-semibold text-white">
                  {formatTaka(order.total)}
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminHomepage;
