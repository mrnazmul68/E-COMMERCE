import { v2 as cloudinary } from "cloudinary";
import { env } from "@config/env.js";
import { logger } from "@utils/logger.js";


export const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
    logger.info("Cloudinary connected");
  } catch (error) {
    logger.error({ error }, "Cloudinary error");
  }
};
