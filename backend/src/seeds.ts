import bcrypt from "bcrypt";
import { connectDb, disconnectDb } from "./config/connectDB.js";
import { Product } from "./modules/product/product.model.js";
import { User } from "./modules/auth/models/auth.model.js";
import { logger } from "./utils/logger.js";
import { env } from "./config/env.js";

interface SeedImage {
  url: string;
  altText?: string;
}

interface SeedProduct {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  countInStock: number;
  sku: string;
  category: string;
  brand?: string;
  sizes: string[];
  colors: string[];
  collections: string;
  material?: string;
  gender: "Men" | "Women" | "Unisex";
  images: SeedImage[];
  rating?: number;
  numReviews?: number;
  tags?: string[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isSeedProduct = (value: unknown): value is SeedProduct =>
  isRecord(value) &&
  typeof value.name === "string" &&
  typeof value.description === "string" &&
  typeof value.price === "number" &&
  typeof value.countInStock === "number" &&
  typeof value.sku === "string" &&
  typeof value.category === "string" &&
  isStringArray(value.sizes) &&
  isStringArray(value.colors) &&
  typeof value.collections === "string" &&
  (value.gender === "Men" ||
    value.gender === "Women" ||
    value.gender === "Unisex") &&
  Array.isArray(value.images) &&
  value.images.every(
    (image) =>
      isRecord(image) &&
      typeof image.url === "string" &&
      (image.altText === undefined || typeof image.altText === "string"),
  ) &&
  (value.discountPrice === undefined ||
    typeof value.discountPrice === "number") &&
  (value.rating === undefined || typeof value.rating === "number") &&
  (value.numReviews === undefined || typeof value.numReviews === "number") &&
  (value.brand === undefined || typeof value.brand === "string") &&
  (value.material === undefined || typeof value.material === "string") &&
  (value.tags === undefined || isStringArray(value.tags));

const loadSeedProducts = async (): Promise<SeedProduct[]> => {
  const productData: unknown = await import(
    new URL("../public/data/products.js", import.meta.url).href
  );

  if (!isRecord(productData) || !Array.isArray(productData.default)) {
    throw new TypeError("Seed product data must default-export a products array");
  }

  const products: SeedProduct[] = productData.default.map((product: unknown) => {
    if (!isSeedProduct(product)) {
      throw new TypeError("Seed product data contains an invalid product");
    }
    return product;
  });
  const skus = products.map((product) => product.sku);
  if (new Set(skus).size !== skus.length) {
    throw new TypeError("Seed product data contains duplicate SKUs");
  }

  return products;
};

const seedDatabase = async (): Promise<void> => {
  let hasFailed = false;

  try {
    const products = await loadSeedProducts();
    logger.info("Connecting to MongoDB for seeding...");
    await connectDb();

    // 1. Find or create an admin user (Product requires a valid 'user' reference)
    let adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      adminUser = await User.findOne();
    }

    if (!adminUser) {
      logger.info(
        "No user found in database. Creating a default admin user...",
      );
      const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
      adminUser = await User.create({
        name: "Admin User",
        email: env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      logger.info(`Default admin created: ${adminUser.email}`);
    } else {
      logger.info(
        `Using user for products: ${adminUser.name} (${adminUser._id})`,
      );
    }

    const existingProducts = await Product.find({
      sku: { $in: products.map((item) => item.sku) },
    })
      .select("sku")
      .lean();
    const existingSkus = new Set(existingProducts.map((item) => item.sku));
    const productsToInsert = products
      .filter((item) => !existingSkus.has(item.sku))
      .map((item) => ({
        ...item,
        user: adminUser._id,
        isPublished: true,
        isFeatured: Boolean(item.rating && item.rating >= 4.7),
        tags:
          item.tags ??
          [
            item.category.toLowerCase().replace(/\s+/g, "-"),
            item.gender.toLowerCase(),
          ],
      }));

    const inserted =
      productsToInsert.length > 0
        ? await Product.insertMany(productsToInsert)
        : [];
    logger.info(
      `Successfully inserted ${inserted.length} products; skipped ${products.length - inserted.length} products with existing SKUs.`,
    );
  } catch (error) {
    logger.error({ error }, "Failed to seed products into database");
    hasFailed = true;
  } finally {
    try {
      await disconnectDb();
    } catch (error) {
      logger.error({ error }, "Failed to disconnect from MongoDB after seeding");
      hasFailed = true;
    }

    process.exitCode = hasFailed ? 1 : 0;
  }
};

await seedDatabase();
