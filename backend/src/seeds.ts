import bcrypt from "bcrypt";
import { connectDb, disconnectDb } from "./config/connectDB.js";
import { Product } from "./modules/product/model/product.model.js";
import { User } from "./modules/auth/models/auth.model.js";
import { logger } from "./utils/logger.js";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

interface SeedProduct {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  rating?: number;
  tags?: string[];
  category?: string;
  gender?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isSeedProduct = (value: unknown): value is SeedProduct =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.name === "string" &&
  typeof value.price === "number" &&
  typeof value.image === "string" &&
  (value.discountPrice === undefined ||
    typeof value.discountPrice === "number") &&
  (value.rating === undefined || typeof value.rating === "number") &&
  (value.tags === undefined ||
    (Array.isArray(value.tags) &&
      value.tags.every((tag) => typeof tag === "string"))) &&
  (value.category === undefined || typeof value.category === "string") &&
  (value.gender === undefined || typeof value.gender === "string");

const loadSeedProducts = async (): Promise<SeedProduct[]> => {
  const productDataPath = resolve(
    process.cwd(),
    "../frontend/public/data/products.js",
  );
  const productData: unknown = await import(
    pathToFileURL(productDataPath).href
  );

  if (!isRecord(productData) || !Array.isArray(productData.products)) {
    throw new TypeError("Frontend product data must export a products array");
  }

  const products = productData.products.filter(isSeedProduct);
  if (products.length !== productData.products.length) {
    throw new TypeError("Frontend product data contains an invalid product");
  }

  return products;
};

const seedDatabase = async () => {
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
      const hashedPassword = await bcrypt.hash("Admin12345!", 10);
      adminUser = await User.create({
        name: "Admin User",
        email: "admin@nexora.com",
        password: hashedPassword,
        role: "admin",
      });
      logger.info(`Default admin created: ${adminUser.email}`);
    } else {
      logger.info(
        `Using user for products: ${adminUser.name} (${adminUser._id})`,
      );
    }

    // 2. Clear existing products to prevent duplicate SKUs
    const deleted = await Product.deleteMany({});
    logger.info(
      `Cleared ${deleted.deletedCount} existing products from database.`,
    );

    // 3. Prepare product items with user reference and publication status
    const productsToInsert = products.map((item) => ({
      ...item,
      user: adminUser._id,
      isPublished: true,
      isFeatured: Boolean(item.rating && item.rating >= 4.7),
      tags:
        item.tags ||
        [
          item.category?.toLowerCase().replace(/\s+/g, "-"),
          item.gender?.toLowerCase(),
        ].filter((tag): tag is string => Boolean(tag)),
    }));

    // 4. Batch insert products into MongoDB
    const inserted = await Product.insertMany(productsToInsert);
    logger.info(
      `🎉 Successfully seeded ${inserted.length} products into MongoDB!`,
    );

    await disconnectDb();
    process.exit(0);
  } catch (error) {
    logger.error({ error }, "Failed to seed products into database");
    await disconnectDb().catch(() => {});
    process.exit(1);
  }
};

seedDatabase();
