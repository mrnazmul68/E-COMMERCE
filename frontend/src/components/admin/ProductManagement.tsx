import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch, Pencil, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { formatTaka } from "../../data/account";
import {
  deleteAdminProduct,
  loadAdminProducts,
  type AdminProduct,
} from "../../data/adminProducts";

type DeleteProductDialogProps = {
  product: AdminProduct;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteProductDialog = ({
  product,
  onCancel,
  onConfirm,
}: DeleteProductDialogProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const closingRef = useRef(false);
  const closeTimeout = useRef<number | null>(null);

  const startClose = useCallback((callback: () => void) => {
    if (closingRef.current) return;

    closingRef.current = true;
    setIsClosing(true);
    closeTimeout.current = window.setTimeout(callback, 170);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") startClose(onCancel);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel, startClose]);

  useEffect(
    () => () => {
      if (closeTimeout.current !== null) {
        window.clearTimeout(closeTimeout.current);
      }
    },
    [],
  );

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cancel deleting product"
        onClick={() => startClose(onCancel)}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm ${
          isClosing
            ? "animate-admin-dialog-backdrop-out"
            : "animate-admin-dialog-backdrop-in"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
        aria-describedby="delete-product-description"
        className={`relative w-full max-w-md rounded-2xl border border-white/10 bg-[#101010] p-6 shadow-2xl shadow-black/60 ${
          isClosing
            ? "animate-admin-dialog-panel-out"
            : "animate-admin-dialog-panel-in"
        }`}
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          <Trash2 size={20} />
        </span>

        <h2 id="delete-product-title" className="mt-4 text-lg font-semibold">
          Delete product?
        </h2>
        <p
          id="delete-product-description"
          className="mt-2 text-sm leading-6 text-neutral-400"
        >
          This product will be permanently removed from your catalog. This
          action cannot be undone.
        </p>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
          <img
            src={product.image}
            alt=""
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
            className="size-12 shrink-0 rounded-lg bg-neutral-900 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {product.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-neutral-500">
              SKU: {product.sku}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            autoFocus
            disabled={isClosing}
            onClick={() => startClose(onCancel)}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isClosing}
            onClick={() => startClose(onConfirm)}
            className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Delete product
          </button>
        </div>
      </div>
    </div>
  );
};

const getStockBadge = (stock: number) => {
  if (stock === 0) {
    return {
      label: "Out of stock",
      className: "bg-red-500/10 text-red-400 ring-red-500/20",
    };
  }

  if (stock <= 10) {
    return {
      label: `Low stock · ${stock}`,
      className: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    };
  }

  return {
    label: `${stock} in stock`,
    className: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  };
};

const ProductManagement = () => {
  const [products, setProducts] = useState<AdminProduct[]>(loadAdminProducts);
  const [query, setQuery] = useState("");
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(
    null,
  );

  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? products.filter((product) =>
        [product.name, product.sku, product.category].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        ),
      )
    : products;

  const handleDelete = () => {
    if (!productToDelete) return;

    setProducts(deleteAdminProduct(productToDelete.id));
    toast.success(`${productToDelete.name} deleted.`);
    setProductToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-400">
            Catalog
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Product <span className="text-orange-500">management</span>
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Review your products, update details, or remove items from the
            catalog.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3.5 py-2 text-xs font-medium text-neutral-400">
          <PackageSearch size={15} className="text-orange-400" />
          {products.length} {products.length === 1 ? "product" : "products"}
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by product name, SKU, or category..."
          aria-label="Search products"
          className="h-12 w-full rounded-2xl border border-white/10 bg-[#0c0c0c] pl-11 pr-11 text-sm text-white placeholder:text-neutral-600 outline-none transition focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-neutral-500 transition hover:bg-white/5 hover:text-white"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* Product list */}
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
          <div>
            <h3 className="text-base font-semibold">
              {normalizedQuery ? "Search results" : "All products"}
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              {normalizedQuery
                ? `${filteredProducts.length} ${
                    filteredProducts.length === 1 ? "product" : "products"
                  } found`
                : "Your complete product catalog."}
            </p>
          </div>
        </div>

        <div className="hidden grid-cols-[minmax(0,2fr)_0.9fr_0.8fr_0.7fr_84px] gap-3 border-b border-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 md:grid">
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span className="text-right">Actions</span>
        </div>

        {filteredProducts.length > 0 ? (
          <ul className="divide-y divide-white/10">
            {filteredProducts.map((product) => {
              const stock = getStockBadge(product.stock);

              return (
                <li
                  key={product.id}
                  className="flex flex-col gap-4 px-4 py-4 transition hover:bg-white/2 md:grid md:grid-cols-[minmax(0,2fr)_0.9fr_0.8fr_0.7fr_84px] md:items-center md:gap-3 md:px-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.visibility = "hidden";
                        }}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {product.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-neutral-500">
                        SKU: {product.sku}
                        <span className="md:hidden"> · {product.category}</span>
                      </p>
                    </div>
                  </div>

                  <p className="hidden truncate text-xs text-neutral-400 md:block">
                    {product.category}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 md:contents">
                    <p className="text-sm font-semibold text-white">
                      {formatTaka(product.price)}
                    </p>

                    <span
                      className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ring-inset ${stock.className}`}
                    >
                      {stock.label}
                    </span>

                    <div className="ml-auto flex items-center justify-end gap-2 md:ml-0 md:justify-self-end">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        aria-label={`Edit ${product.name}`}
                        title={`Edit ${product.name}`}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-neutral-400 transition hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(product)}
                        aria-label={`Delete ${product.name}`}
                        title={`Delete ${product.name}`}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-neutral-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-5 py-14 text-center">
            <PackageSearch size={30} className="mx-auto text-neutral-700" />
            <p className="mt-3 text-sm font-medium text-neutral-300">
              {normalizedQuery ? "No products found" : "No products yet"}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {normalizedQuery
                ? "Try a different product name, SKU, or category."
                : "Your catalog is currently empty."}
            </p>
            {normalizedQuery && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2 text-xs font-medium text-neutral-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                <X size={14} />
                Clear search
              </button>
            )}
          </div>
        )}
      </section>

      {productToDelete && (
        <DeleteProductDialog
          product={productToDelete}
          onCancel={() => setProductToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ProductManagement;
