import type { Types } from "mongoose";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { ProductRepository } from "@modules/product/repository/product.repository.js";
import { ApiError } from "@utils/apiError.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import type {
  ProductCreateInput,
  ProductQuaryInput,
  ProductUpdateInput,
} from "../validation/product.validation.js";

export interface CreateProductData extends ProductCreateInput {
  user: Types.ObjectId | string;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export class ProductService {
  constructor(private readonly productRepository = new ProductRepository()) {}

  // create product
  async createProduct(productData: CreateProductData) {
    return this.productRepository.create(productData);
  }

  // Update product
  async updateProduct(productData: ProductUpdateInput, productId: string) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product not found");
    }

    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions,
      weight,
    } = productData;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.countInStock = countInStock ?? product.countInStock;
    product.sku = sku ?? product.sku;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.sizes = sizes ?? product.sizes;
    product.colors = colors ?? product.colors;
    product.collections = collections ?? product.collections;
    product.material = material ?? product.material;
    product.gender = gender ?? product.gender;
    product.images = (images as any) ?? product.images;
    product.tags = tags ?? product.tags;
    product.metaTitle = metaTitle ?? product.metaTitle;
    product.metaDescription = metaDescription ?? product.metaDescription;
    product.metaKeywords = metaKeywords ?? product.metaKeywords;
    product.dimensions = dimensions ?? product.dimensions;
    product.weight = weight ?? product.weight;

    return await product.save();
  }

  // Delete a product
  async removeProduct(productId: string) {
    return await this.productRepository.removeProduct(productId);
  }

  // list product and quary
  async listProduct(quaryData: ProductQuaryInput) {
    const {
      collection,
      category,
      material,
      gender,
      color,
      size,
      brand,
      minPrice,
      maxPrice,
      sortBy,
      search,
      limit = 10,
      page = 1,
    } = quaryData;

    let quary: Record<string, any> = {};

    //filter quary
    if (collection && collection.toLocaleLowerCase() !== "all") {
      quary.collection = collection;
    }

    if (category && category.toLocaleLowerCase() !== "all") {
      quary.category = category;
    }

    if (material) {
      quary.material = { $in: material.split(".,") };
    }
  }

  // single product
  async singleProduct(productId: string) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "No product found");
    }
    return product;
  }
}
