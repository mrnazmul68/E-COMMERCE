export type AdminProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  sku: string;
  category: string;
  stock: number;
};

export const ADMIN_PRODUCTS_STORAGE_KEY = "nexora.admin.products";

const seedProducts: AdminProduct[] = [
  {
    id: "1",
    name: "Classic Bomber Jacket",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    sku: "121212",
    category: "Outerwear",
    stock: 24,
  },
  {
    id: "2",
    name: "Classic Oxford Shirt",
    price: 2950,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    sku: "NX-OX-2201",
    category: "Shirts",
    stock: 32,
  },
  {
    id: "3",
    name: "Slim Fit Denim Jeans",
    price: 3490,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    sku: "NX-DN-2202",
    category: "Denim",
    stock: 18,
  },
  {
    id: "4",
    name: "Classic Sneakers",
    price: 3650,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    sku: "NX-SN-2203",
    category: "Footwear",
    stock: 12,
  },
  {
    id: "5",
    name: "Minimalist Watch",
    price: 4890,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    sku: "NX-WT-2204",
    category: "Accessories",
    stock: 9,
  },
  {
    id: "6",
    name: "Everyday Backpack",
    price: 2450,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    sku: "NX-BP-2205",
    category: "Accessories",
    stock: 27,
  },
];

const isAdminProduct = (value: unknown): value is AdminProduct => {
  if (typeof value !== "object" || value === null) return false;

  const product = value as AdminProduct;

  return (
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.price === "number" &&
    typeof product.image === "string" &&
    typeof product.sku === "string" &&
    typeof product.category === "string" &&
    typeof product.stock === "number"
  );
};

export const loadAdminProducts = (): AdminProduct[] => {
  try {
    const saved = localStorage.getItem(ADMIN_PRODUCTS_STORAGE_KEY);
    if (!saved) return [...seedProducts];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [...seedProducts];

    return parsed.filter(isAdminProduct);
  } catch {
    return [...seedProducts];
  }
};

export const saveAdminProducts = (products: AdminProduct[]) => {
  localStorage.setItem(ADMIN_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
};

export const getAdminProduct = (id: string): AdminProduct | null =>
  loadAdminProducts().find((product) => product.id === id) ?? null;

export const updateAdminProduct = (
  id: string,
  updates: Omit<AdminProduct, "id">,
): AdminProduct[] => {
  const nextProducts = loadAdminProducts().map((product) =>
    product.id === id ? { ...product, ...updates, id } : product,
  );

  saveAdminProducts(nextProducts);
  return nextProducts;
};

export const deleteAdminProduct = (id: string): AdminProduct[] => {
  const nextProducts = loadAdminProducts().filter(
    (product) => product.id !== id,
  );

  saveAdminProducts(nextProducts);
  return nextProducts;
};
