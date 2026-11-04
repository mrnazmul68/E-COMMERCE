import type { Types } from "mongoose";

import { ProductRepository } from "@modules/product/product.repository.js";
import { ApiError } from "@utils/apiError.js";
import { HTTP_STATUS } from "@shared/httpcode.js";

import type {
  ProductCreateInput,
  ProductQuaryInput,
  ProductUpdateInput,
} from "./product.validation.js";
import type { ProductGender } from "./product.model.js";

type SortOption =
  | "newest"
  | "oldest"
  | "price-low-high"
  | "price-high-low"
  | "name-asc"
  | "name-desc";

export interface CreateProductData extends ProductCreateInput {
  user: Types.ObjectId | string;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export interface SimilarProductQuery {
  id: string | Types.ObjectId;
  category: string;
  gender: ProductGender;
}

export class ProductService {
  constructor(private readonly productRepository = new ProductRepository()) {}

  // Create product
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

    return product.save();
  }

  // Delete product
  async removeProduct(productId: string) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product not found");
    }

    return this.productRepository.removeProduct(productId);
  }

  // List products with filters, sorting and pagination
  async listProduct(queryData: ProductQuaryInput) {
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
    } = queryData;

    // Build filter query
    const query: Record<string, any> = {};

    // Parse comma-separated values
    const parseArray = (value?: string) =>
      value
        ?.split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    // Collection filter
    if (collection && collection.toLowerCase() !== "all") {
      query.collections = collection;
    }

    // Category filter
    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }

    // Material filter
    if (material) {
      const materials = parseArray(material);

      if (materials?.length) {
        query.material = { $in: materials };
      }
    }

    // Gender filter
    if (gender && gender.toLowerCase() !== "all") {
      query.gender = gender;
    }

    // Color filter
    if (color) {
      const colors = parseArray(color);

      if (colors?.length) {
        query.colors = { $in: colors };
      }
    }

    // Size filter
    if (size) {
      const sizes = parseArray(size);

      if (sizes?.length) {
        query.sizes = { $in: sizes };
      }
    }

    // Brand filter
    if (brand) {
      const brands = parseArray(brand);

      if (brands?.length) {
        query.brand = { $in: brands };
      }
    }

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};

      if (minPrice !== undefined) {
        query.price.$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        query.price.$lte = maxPrice;
      }
    }

    // Search filter
    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      query.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
        { brand: { $regex: escapedSearch, $options: "i" } },
        { category: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    // Sorting

    const sortOptions: Record<SortOption, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      "price-low-high": { price: 1 },
      "price-high-low": { price: -1 },
      "name-asc": { name: 1 },
      "name-desc": { name: -1 },
    };

    const sort = sortOptions[sortBy as SortOption] ?? sortOptions.newest;

    // Pagination
    const currentPage = Math.max(1, Number(page) || 1);
    const perPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (currentPage - 1) * perPage;

    // Fetch products and count simultaneously
    const [products, totalProducts] = await Promise.all([
      this.productRepository.findProducts(query, sort, skip, perPage),
      this.productRepository.countProducts(query),
    ]);

    const totalPages = Math.ceil(totalProducts / perPage);

    return {
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage,
        limit: perPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    };
  }

  // Find single product
  async singleProduct(productId: string) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product not found");
    }

    return product;
  }

  //find similar product
  async findSimilarProducts(product: SimilarProductQuery) {
    return await this.productRepository.findSimilarProducts(product);
  }
  //Best seller products
  async bestSellerProducts() {
    const bestSellerProducts =
      await this.productRepository.bestSellerProducts();
    if (!bestSellerProducts || bestSellerProducts.length === 0) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "No best-selling products found",
      );
    }
    return bestSellerProducts;
  }

  //New arrival products
  async newArrivalProducts() {
    const newArrivalProducts =
      await this.productRepository.newArrivalProducts();
    if (!newArrivalProducts || newArrivalProducts.length === 0) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "No new arrival products found",
      );
    }
    return newArrivalProducts;
  }
}
