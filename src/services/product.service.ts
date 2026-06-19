import { randomUUID } from "node:crypto";
import type { Product, ProductBody } from "@models";

export class ProductService {
  readonly #state = new Map<string, Product>();

  async fetchAll(): Promise<Product[]> {
    return Array.from(this.#state.values());
  }

  async fetchOne(id: string): Promise<Product | null> {
    return this.#state.get(id) ?? null;
  }

  async insertOne(body: ProductBody): Promise<Product> {
    const product: Product = { id: randomUUID(), ...body };
    this.#state.set(product.id, product);
    return product;
  }

  async updateOne(
    id: string,
    body: Partial<ProductBody>,
  ): Promise<Product | null> {
    const product = this.#state.get(id);
    if (!product) return null;
    const current = { ...product, ...body };
    this.#state.set(current.id, current);
    return current;
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.#state.delete(id);
  }
}
