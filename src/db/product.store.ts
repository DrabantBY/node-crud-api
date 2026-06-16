import { randomUUID } from "node:crypto";
import type { Product } from "../models/product.model.js";

export class ProductStore {
  readonly #store = new Map<string, Required<Product>>();

  async fetchList(): Promise<Required<Product>[]> {
    return Array.from(this.#store.values());
  }

  async fetchItem(id: string): Promise<Required<Product> | null> {
    return this.#store.get(id) ?? null;
  }

  async insertOne(body: Product): Promise<Required<Product>> {
    const product: Required<Product> = { id: randomUUID(), ...body };
    this.#store.set(product.id, product);
    return product;
  }

  async upsertOne(
    id: string,
    body: Partial<Product>,
  ): Promise<Required<Product> | null> {
    const product = this.#store.get(id);
    if (!product) return null;
    const current = { ...product, ...body, id };
    this.#store.set(current.id, current);
    return current;
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.#store.delete(id);
  }
}
