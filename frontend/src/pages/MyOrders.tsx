import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  PackageCheck,
  Truck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { demoOrders, formatTaka, getOrderTotal } from "../data/account";
import type { OrderStatus } from "../data/account";

type OrderFilter = "All orders" | OrderStatus;

const filters: OrderFilter[] = [
  "All orders",
  "Processing",
  "In transit",
  "Delivered",
  "Cancelled",
];

const statusStyles: Record<OrderStatus, string> = {
  Delivered: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  "In transit": "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  Processing: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
  Cancelled: "bg-neutral-500/10 text-neutral-400 ring-neutral-500/20",
};

const statusIcons: Record<OrderStatus, typeof Check> = {
  Delivered: Check,
  "In transit": Truck,
  Processing: Clock3,
  Cancelled: X,
};

const MyOrders = () => {
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("All orders");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const visibleOrders =
    activeFilter === "All orders"
      ? demoOrders
      : demoOrders.filter((order) => order.status === activeFilter);

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-10 text-white sm:px-8 sm:py-14 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9">
          <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
            <Link to="/" className="transition hover:text-white">Home</Link>
            <ChevronRight size={13} />
            <Link to="/profile" className="transition hover:text-white">My account</Link>
            <ChevronRight size={13} />
            <span className="text-neutral-300">Orders</span>
          </div>
          <Link
            to="/profile"
            className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-neutral-400 transition hover:text-white"
          >
            <ArrowLeft size={14} /> Back to account
          </Link>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-400">
                Your purchases
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                My <span className="text-orange-500">orders</span>
              </h1>
              <p className="mt-2 text-sm text-neutral-400">
                Track your deliveries and revisit your order history.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#101010] px-4 py-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
                <PackageCheck size={18} />
              </div>
              <div>
                <p className="text-lg font-semibold leading-5">{demoOrders.length}</p>
                <p className="mt-1 text-[11px] text-neutral-500">Total orders</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => {
            const count =
              filter === "All orders"
                ? demoOrders.length
                : demoOrders.filter((order) => order.status === filter).length;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-medium transition ${
                  activeFilter === filter
                    ? "border-orange-500 bg-orange-500 text-black"
                    : "border-white/10 bg-[#101010] text-neutral-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {filter}
                <span className={activeFilter === filter ? "text-black/60" : "text-neutral-600"}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <section aria-label="Order history" className="space-y-4">
          {visibleOrders.length > 0 ? (
            visibleOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const StatusIcon = statusIcons[order.status];

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010]"
                >
                  <div className="grid gap-4 border-b border-white/[0.07] p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6 sm:py-5">
                    <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                          Order number
                        </p>
                        <p className="mt-1 text-sm font-semibold">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                          Date placed
                        </p>
                        <p className="mt-1 text-sm text-neutral-300">{order.placedAt}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                          Total
                        </p>
                        <p className="mt-1 text-sm font-semibold">{formatTaka(getOrderTotal(order))}</p>
                      </div>
                    </div>
                    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset ${statusStyles[order.status]}`}>
                      <StatusIcon size={13} />
                      {order.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex -space-x-3">
                        {order.items.slice(0, 3).map((item) => (
                          <img
                            key={item.id}
                            src={item.image}
                            alt=""
                            className="size-14 rounded-xl border-2 border-[#101010] bg-neutral-800 object-cover"
                          />
                        ))}
                        {order.items.length > 3 && (
                          <span className="flex size-14 items-center justify-center rounded-xl border-2 border-[#101010] bg-neutral-800 text-xs text-neutral-300">
                            +{order.items.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </p>
                        <p className="mt-1 truncate text-xs text-neutral-500">
                          {order.items.map((item) => item.name).join(", ")}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOrderId(isExpanded ? null : order.id)
                      }
                      aria-expanded={isExpanded}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-neutral-300 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                    >
                      {isExpanded ? "Hide details" : "View details"}
                      <ChevronDown
                        size={15}
                        className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-white/[0.07] bg-black/20 px-4 py-5 sm:px-6">
                      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                        <div>
                          <h2 className="mb-4 text-sm font-semibold">Items in this order</h2>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="size-14 rounded-lg bg-neutral-800 object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium">{item.name}</p>
                                  <p className="mt-1 text-xs text-neutral-500">
                                    {item.variant} · Qty {item.quantity}
                                  </p>
                                </div>
                                <p className="shrink-0 text-sm font-medium">
                                  {formatTaka(item.price * item.quantity)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4 rounded-xl border border-white/[0.07] bg-[#101010] p-4">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                              Delivery address
                            </p>
                            <p className="mt-2 text-xs leading-5 text-neutral-300">
                              {order.shippingAddress}
                            </p>
                          </div>
                          <div className="border-t border-white/[0.07] pt-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                              Payment method
                            </p>
                            <p className="mt-2 text-xs text-neutral-300">{order.paymentMethod}</p>
                          </div>
                          <div className="flex justify-between border-t border-white/[0.07] pt-4 text-sm">
                            <span className="text-neutral-400">Order total</span>
                            <span className="font-semibold">{formatTaka(getOrderTotal(order))}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#101010] px-5 py-16 text-center">
              <PackageCheck size={28} className="mx-auto text-neutral-600" />
              <h2 className="mt-4 text-base font-semibold">No {activeFilter.toLowerCase()} orders</h2>
              <p className="mt-2 text-sm text-neutral-500">
                Try another filter to see more of your order history.
              </p>
              <button
                type="button"
                onClick={() => setActiveFilter("All orders")}
                className="mt-5 text-sm font-medium text-orange-400 hover:text-orange-300"
              >
                Show all orders
              </button>
            </div>
          )}
        </section>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-[#101010] p-5 sm:px-6">
          <div>
            <p className="text-sm font-medium">Need help with an order?</p>
            <p className="mt-1 text-xs text-neutral-500">Our support team is happy to help.</p>
          </div>
          <a
            href="mailto:support@nexora.example"
            className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 transition hover:text-orange-300"
          >
            Contact support <ArrowRight size={14} />
          </a>
        </div>

        <p className="mt-5 text-center text-xs text-neutral-600">
          Demo order history — ready to connect to your orders API.
        </p>
      </div>
    </main>
  );
};

export default MyOrders;
