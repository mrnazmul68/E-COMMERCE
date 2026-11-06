import { useEffect, useState } from "react";
import {
  Ban,
  CheckCircle2,
  ChevronDown,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { formatTaka } from "../../data/account";

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

type AdminOrder = {
  id: string;
  user: {
    name: string;
  };
  totalPrice: number;
  status: OrderStatus;
  placedAt: string;
  itemCount: number;
};

const STORAGE_KEY = "nexora.admin.orders";

const initialOrders: AdminOrder[] = [
  {
    id: "NX-2026-1054",
    user: { name: "John Doe" },
    totalPrice: 2950,
    status: "Shipped",
    placedAt: "Nov 04, 2026",
    itemCount: 1,
  },
  {
    id: "NX-2026-1053",
    user: { name: "Rifat Hasan" },
    totalPrice: 2950,
    status: "Shipped",
    placedAt: "Nov 04, 2026",
    itemCount: 1,
  },
  {
    id: "NX-2026-1052",
    user: { name: "Sadia Islam" },
    totalPrice: 6480,
    status: "Delivered",
    placedAt: "Nov 03, 2026",
    itemCount: 3,
  },
  {
    id: "NX-2026-1051",
    user: { name: "Tanvir Ahmed" },
    totalPrice: 1850,
    status: "Delivered",
    placedAt: "Nov 03, 2026",
    itemCount: 1,
  },
  {
    id: "NX-2026-1050",
    user: { name: "Nusrat Jahan" },
    totalPrice: 3700,
    status: "Cancelled",
    placedAt: "Nov 02, 2026",
    itemCount: 2,
  },
  {
    id: "NX-2026-1049",
    user: { name: "Ayesha Karim" },
    totalPrice: 4250,
    status: "Processing",
    placedAt: "Nov 01, 2026",
    itemCount: 2,
  },
  {
    id: "NX-2026-1048",
    user: { name: "Mehedi Hasan" },
    totalPrice: 2190,
    status: "Pending",
    placedAt: "Oct 31, 2026",
    itemCount: 1,
  },
];

const statusMeta: Record<OrderStatus, { dot: string; text: string }> = {
  Pending: { dot: "bg-amber-400", text: "text-amber-300" },
  Processing: { dot: "bg-orange-400", text: "text-orange-300" },
  Shipped: { dot: "bg-blue-400", text: "text-blue-300" },
  Delivered: { dot: "bg-emerald-400", text: "text-emerald-300" },
  Cancelled: { dot: "bg-neutral-500", text: "text-neutral-400" },
};

const isOrderStatus = (value: unknown): value is OrderStatus =>
  typeof value === "string" &&
  (ORDER_STATUSES as readonly string[]).includes(value);

const isAdminOrder = (value: unknown): value is AdminOrder => {
  if (typeof value !== "object" || value === null) return false;

  const order = value as AdminOrder;

  return (
    typeof order.id === "string" &&
    typeof order.totalPrice === "number" &&
    isOrderStatus(order.status) &&
    typeof order.placedAt === "string" &&
    typeof order.itemCount === "number" &&
    typeof order.user === "object" &&
    order.user !== null &&
    typeof order.user.name === "string"
  );
};

const loadOrders = (): AdminOrder[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [...initialOrders];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [...initialOrders];

    return parsed.filter(isAdminOrder);
  } catch {
    return [...initialOrders];
  }
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const OrderManagement = () => {
  const [orders, setOrders] = useState<AdminOrder[]>(loadOrders);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  const handleStatusChange = (id: string, status: OrderStatus) => {
    const target = orders.find((order) => order.id === id);
    if (!target || target.status === status) return;

    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order)),
    );
    toast.success(`${id} status updated to ${status}.`);
  };

  const handleMarkDelivered = (order: AdminOrder) => {
    if (order.status === "Delivered" || order.status === "Cancelled") return;

    setOrders((current) =>
      current.map((currentOrder) =>
        currentOrder.id === order.id
          ? { ...currentOrder, status: "Delivered" }
          : currentOrder,
      ),
    );
    toast.success(`${order.id} marked as delivered.`);
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-400">
            Fulfilment
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Order <span className="text-orange-500">management</span>
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Track orders, update their status, and mark them as delivered.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3.5 py-2 text-xs font-medium text-neutral-400">
          <ShoppingBag size={15} className="text-orange-400" />
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      {/* Order list */}
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
          <div>
            <h3 className="text-base font-semibold">All orders</h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              Manage fulfilment status from one place.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            <CheckCircle2 size={13} />
            {deliveredCount} delivered
          </span>
        </div>

        <div className="hidden grid-cols-[170px_minmax(0,1fr)_120px_150px_190px] gap-3 border-b border-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 lg:grid">
          <span>Order</span>
          <span>Customer</span>
          <span>Total</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {orders.length > 0 ? (
          <ul className="divide-y divide-white/10">
            {orders.map((order) => {
              const meta = statusMeta[order.status];
              const isDelivered = order.status === "Delivered";
              const isCancelled = order.status === "Cancelled";

              return (
                <li
                  key={order.id}
                  className="flex flex-col gap-4 px-4 py-4 transition hover:bg-white/2 lg:grid lg:grid-cols-[170px_minmax(0,1fr)_120px_150px_190px] lg:items-center lg:gap-3 lg:px-5"
                >
                  <div className="flex items-center justify-between gap-3 lg:block">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs font-semibold tracking-wide text-white">
                        {order.id}
                      </p>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        {order.placedAt}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-white lg:hidden">
                      {formatTaka(order.totalPrice)}
                    </p>
                  </div>

                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/6 text-xs font-semibold text-orange-400">
                      {getInitials(order.user.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {order.user.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        {order.itemCount}{" "}
                        {order.itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  <p className="hidden text-sm font-semibold text-white lg:block">
                    {formatTaka(order.totalPrice)}
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:contents">
                    <div className="relative w-full">
                      <span
                        className={`pointer-events-none absolute left-3 top-1/2 size-2 -translate-y-1/2 rounded-full transition-colors ${meta.dot}`}
                      />
                      <select
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(
                            order.id,
                            event.target.value as OrderStatus,
                          )
                        }
                        aria-label={`Change status for order ${order.id}`}
                        className={`h-10 w-full appearance-none rounded-xl border border-white/10 bg-black/40 pl-7 pr-8 text-xs font-semibold outline-none transition hover:border-white/20 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10 ${meta.text}`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-[#101010] text-neutral-200"
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMarkDelivered(order)}
                      disabled={isDelivered || isCancelled}
                      aria-label={
                        isDelivered
                          ? `Order ${order.id} is delivered`
                          : isCancelled
                            ? `Order ${order.id} is cancelled`
                            : `Mark order ${order.id} as delivered`
                      }
                      className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-3 text-xs font-semibold transition ${
                        isDelivered
                          ? "cursor-not-allowed border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : isCancelled
                            ? "cursor-not-allowed border border-white/10 bg-white/3 text-neutral-500"
                            : "bg-orange-500 text-black hover:bg-orange-400 active:scale-[0.99]"
                      }`}
                    >
                      {isDelivered ? (
                        <CheckCircle2 size={15} />
                      ) : isCancelled ? (
                        <Ban size={15} />
                      ) : (
                        <Truck size={15} />
                      )}
                      {isDelivered
                        ? "Delivered"
                        : isCancelled
                          ? "Cancelled"
                          : "Mark as delivered"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-5 py-14 text-center">
            <ShoppingBag size={30} className="mx-auto text-neutral-700" />
            <p className="mt-3 text-sm font-medium text-neutral-300">
              No orders found
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              New orders will appear here once customers start checking out.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default OrderManagement;
