import { Product } from "@modules/product/model/product.model.js";
import type { SimilarProductQuery } from "../service/product.service.js";

export class ProductRepository {
  constructor(private readonly model = Product) {}

  // Create product
  async create(productData: any) {
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
  async findById(productId: string) {
    return this.model.findById(productId);
  }

  //Find similar product
  async findSimilarProducts(product:SimilarProductQuery){
    return this.model.find({
      _id:{$ne: product.id},
      category: product.category,
      gender:product.gender
    }).limit(4)
  }

  //Best seller products
  async bestSellerProducts() {
    return this.model.find().sort({ rating: -1 }).limit(10).lean();
  }
}
