import bcrypt from "bcrypt";
import { connectDb, disconnectDb } from "./config/connectDB.js";
import { Product } from "./modules/product/model/product.model.js";
import { User } from "./modules/auth/models/auth.model.js";
import { logger } from "./utils/logger.js";
// Import product data directly from frontend
// @ts-expect-error importing js from frontend public directory
import { products } from "../../frontend/public/data/products.js";

const seedDatabase = async () => {
  try {
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
    const productsToInsert = products.map((item: any) => ({
      ...item,
      user: adminUser._id,
      isPublished: true,
      isFeatured: Boolean(item.rating && item.rating >= 4.7),
      tags:
        item.tags ||
        [
          item.category?.toLowerCase().replace(/\s+/g, "-"),
          item.gender?.toLowerCase(),
        ].filter(Boolean),
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
