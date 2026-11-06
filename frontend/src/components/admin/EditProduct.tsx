import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Image as ImageIcon,
  PackageX,
  Save,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { formatTaka } from "../../data/account";
import {
  getAdminProduct,
  loadAdminProducts,
  updateAdminProduct,
} from "../../data/adminProducts";

type ProductForm = {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  image: string;
};

const inputClass =
  "h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-sm text-white placeholder:text-neutral-600 outline-none transition focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/10";

const buildForm = (id?: string): ProductForm | null => {
  if (!id) return null;

  const product = getAdminProduct(id);
  if (!product) return null;

  return {
    name: product.name,
    sku: product.sku,
    category: product.category,
    price: String(product.price),
    stock: String(product.stock),
    image: product.image,
  };
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductForm | null>(() => buildForm(id));
  const [error, setError] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);

  if (!form || !id) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0c0c] p-8 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <PackageX size={22} />
          </span>
          <h2 className="mt-4 text-xl font-semibold">Product not found</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            The product you are trying to edit does not exist or has already
            been removed.
          </p>
          <Link
            to="/admin/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400"
          >
            <ArrowLeft size={16} />
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const updateField = (field: keyof ProductForm, value: string) => {
    if (field === "image") setPreviewFailed(false);

    setForm((current) =>
      current ? { ...current, [field]: value } : current,
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const name = form.name.trim();
    const sku = form.sku.trim();
    const category = form.category.trim();
    const image = form.image.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (name.length < 2) {
      setError("Product name must be at least 2 characters long.");
      return;
    }

    if (!sku) {
      setError("SKU is required.");
      return;
    }

    if (!category) {
      setError("Category is required.");
      return;
    }

    if (
      form.price.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError("Please enter a valid price.");
      return;
    }

    if (
      form.stock.trim() === "" ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError("Stock must be a whole number of 0 or more.");
      return;
    }

    if (!image) {
      setError("Product image URL is required.");
      return;
    }

    const duplicateSku = loadAdminProducts().some(
      (product) =>
        product.id !== id &&
        product.sku.toLowerCase() === sku.toLowerCase(),
    );

    if (duplicateSku) {
      setError("Another product already uses this SKU.");
      return;
    }

    updateAdminProduct(id, {
      name,
      sku,
      category,
      price,
      stock,
      image,
    });

    toast.success(`${name} updated successfully.`);
    navigate("/admin/products");
  };

  const price = Number(form.price);
  const stock = Number(form.stock);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            to="/admin/products"
            className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-neutral-400 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to products
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-400">
            Catalog
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Edit <span className="text-orange-500">product</span>
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Update the product details and save your changes.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3.5 py-2 text-xs font-medium text-neutral-400">
          SKU: {form.sku || "—"}
        </span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Edit form */}
        <section className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 sm:p-6">
          <div className="mb-5">
            <h3 className="text-base font-semibold">Product details</h3>
            <p className="mt-1 text-xs text-neutral-500">
              Keep the name, pricing, stock, and image up to date.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-medium text-neutral-400">
                  Product name
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Product name"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-neutral-400">
                  SKU
                </span>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(event) => updateField("sku", event.target.value)}
                  placeholder="NX-0001"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-neutral-400">
                  Category
                </span>
                <input
                  type="text"
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  placeholder="Outerwear"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-neutral-400">
                  Price
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      updateField("price", event.target.value)
                    }
                    placeholder="0"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-neutral-400">
                  Stock
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) => updateField("stock", event.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-medium text-neutral-400">
                  Image URL
                </span>
                <input
                  type="text"
                  value={form.image}
                  onChange={(event) => updateField("image", event.target.value)}
                  placeholder="https://example.com/product.jpg"
                  className={inputClass}
                />
              </label>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-400"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/admin/products"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-center text-sm font-medium text-neutral-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400 active:scale-[0.99]"
              >
                <Save size={16} />
                Save changes
              </button>
            </div>
          </form>
        </section>

        {/* Live preview */}
        <aside className="h-fit rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 xl:sticky xl:top-24">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">Preview</h3>
              <p className="mt-1 text-xs text-neutral-500">
                How the product details currently look.
              </p>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-orange-400">
              <ImageIcon size={17} />
            </span>
          </div>

          <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
            {form.image && !previewFailed ? (
              <img
                key={form.image}
                src={form.image}
                alt={form.name || "Product preview"}
                onError={() => setPreviewFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-neutral-600">
                <ImageIcon size={28} />
                <span className="text-xs">
                  {form.image ? "Image preview unavailable" : "No image"}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400">
              {form.category.trim() || "Category"}
            </p>
            <h4 className="mt-1.5 text-base font-semibold leading-6 text-white">
              {form.name.trim() || "Product name"}
            </h4>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold text-white">
                {Number.isFinite(price) && price >= 0
                  ? formatTaka(price)
                  : "—"}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
                  stock <= 0
                    ? "bg-red-500/10 text-red-400 ring-red-500/20"
                    : stock <= 10
                      ? "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                }`}
              >
                {stock <= 0
                  ? "Out of stock"
                  : stock <= 10
                    ? `Low stock · ${stock}`
                    : `${stock} in stock`}
              </span>
            </div>
            <p className="mt-2 truncate text-xs text-neutral-500">
              SKU: {form.sku.trim() || "—"}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EditProduct;
