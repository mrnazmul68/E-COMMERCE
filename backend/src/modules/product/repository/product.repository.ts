import {
  ProductModel,
  type Product,
  type ProductDocument,
} from "@modules/product/model/product.model.js";

export class ProductRepository {
  constructor(private readonly model = ProductModel) {}

  //todo: create product
  async create(productData: Partial<Product>): Promise<ProductDocument> {
    return await this.model.create(productData);
  }

  //todo: remove product
  async removeProduct(productId: string) {
    return await this.model.deleteOne({ _id: productId });
  }

  //todo: list product
  async listProduct() {
    return await this.model.find({});
  }

  //todo: find by product id
  async findById(productId: string) {
    return await this.model.findById({ _id: productId });
  }
}
