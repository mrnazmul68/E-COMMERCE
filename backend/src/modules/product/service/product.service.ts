import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import type { CreateProductInput } from "@modules/product/validation/product.validation.js";
import { ProductRepository } from "@modules/product/repository/product.repository.js";
import type { ProductDocument } from "@modules/product/model/product.model.js";
import { ApiError } from "@utils/apiError.js";
import { HTTP_STATUS } from "@shared/httpcode.js";

type CreateProductData = CreateProductInput["body"];

export class ProductService {
  constructor(private readonly productRepository = new ProductRepository()) {}

  //todo: create product
  async createProduct(
    productData: CreateProductData,
    files: Express.Multer.File[],
  ): Promise<ProductDocument> {
    const uploadedImages: UploadApiResponse[] = [];

    try {
      for (const file of files) {
        uploadedImages.push(await this.uploadImage(file.buffer));
      }

      return await this.productRepository.create({
        ...productData,
        image: uploadedImages.map((image) => image.secure_url),
      });
    } catch (error) {
      await Promise.allSettled(
        uploadedImages.map((image) =>
          cloudinary.uploader.destroy(image.public_id),
        ),
      );
      throw error;
    }
  }
  //todo: upload images
  private uploadImage(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "e-commerce/products", resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            reject(
              new ApiError(
                HTTP_STATUS.BAD_GATEWAY,
                error?.message ?? "Product image upload failed",
              ),
            );
            return;
          }

          resolve(result);
        },
      );

      stream.end(buffer);
    });
  }

  //todo: remove product
  async removeProduct(productId: string) {
    return await this.productRepository.removeProduct(productId);
  }

  //todo: list product
  async listProduct() {
    return await this.productRepository.listProduct();
  }

  //todo: single product
  async singleProduct(productId: string) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "No product found");
    }
    return product;
  }
}
