import { Product, type ProductDocument } from "@modules/product/product.model.js";
import type { SimilarProductQuery } from "./product.service.js";
import type { ProductCreateInput } from "./product.validation.js";

export class ProductRepository {
  constructor(private readonly model = Product) {}

  // Create product
  async create(productData: ProductCreateInput) {
    return this.model.create(productData);
  }

  // Remove product
  async removeProduct(productId: string) {
    return this.model.deleteOne({ _id: productId });
  }

  // Find products with filters, sorting and pagination
  async findProducts(
    query: Record<string, any>,
    sort: Record<string, 1 | -1>,
    skip: number,
    limit: number,
  ) {
    return this.model.find(query).sort(sort).skip(skip).limit(limit).lean();
  }

  // Count filtered products
  async countProducts(query: Record<string, any>) {
    return this.model.countDocuments(query);
  }

  // Find single product
  async findById(productId: string): Promise<ProductDocument | null> {
    return this.model.findById(productId);
  }

  //Find similar product
  async findSimilarProducts(product: SimilarProductQuery) {
    return this.model
      .find({
        _id: { $ne: product.id },
        category: product.category,
        gender: product.gender,
      })
      .limit(4);
  }

  //Best seller products
  async bestSellerProducts(rating: number = 5) {
    return this.model
      .find({
        rating,
        isPublished: true,
      })
      .sort({ numReviews: -1 })
      .lean();
  }

  //New arrival products
  async newArrivalProducts() {
    return this.model
      .find({
        isPublished: true,
      })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
  }
}
