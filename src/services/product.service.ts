import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import type { Product, ProductBody } from "@models";

export class ProductService {
  #db: DatabaseSync;

  constructor(filePath = resolve("products.db")) {
    this.#db = new DatabaseSync(filePath);
    this.#db.exec("PRAGMA journal_mode=WAL");
    this.#db.exec(`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      inStock INTEGER NOT NULL
    ) STRICT`);
  }

  fetchAll(): Product[] {
    const sql = "SELECT * FROM products";
    const rows = this.#db.prepare(sql).all();
    return rows.map(this.#mapFromRaw);
  }

  fetchOne(id: string): Product | null {
    const sql = "SELECT * FROM products WHERE id = ?";
    const row = this.#db.prepare(sql).get(id);
    return row ? this.#mapFromRaw(row) : null;
  }

  insertOne(body: ProductBody): Product {
    const product: Product = { id: randomUUID(), ...body };
    const keys = Object.keys(product);
    const values = keys.reduce(
      (acc, el) => (acc ? `${acc}, :${el}` : `:${el}`),
      "",
    );
    const sql = `INSERT INTO products (${keys.join(", ")}) VALUES (${values})`;
    this.#db.prepare(sql).run(this.#mapToRaw(product));
    return product;
  }

  updateOne(id: string, body: Partial<ProductBody>): Product | null {
    const product = this.fetchOne(id);
    if (!product) return null;
    const set = Object.keys(body).reduce(
      (acc, key) => (acc ? `${acc}, ${key} = :${key}` : `${key} = :${key}`),
      "",
    );
    const sql = `UPDATE products SET ${set} WHERE id = :id`;
    this.#db.prepare(sql).run(this.#mapToRaw({ ...body, id }));
    return { ...product, ...body };
  }

  deleteOne(id: string): boolean {
    const sql = "DELETE FROM products WHERE id = ?";
    return this.#db.prepare(sql).run(id).changes === 1;
  }

  #mapFromRaw(value: Record<string, SQLInputValue>): Product {
    return { ...value, inStock: !!value.inStock } as Product;
  }

  #mapToRaw(value: Partial<Product>): Record<string, SQLInputValue> {
    if (Object.hasOwn(value, "inStock"))
      return { ...value, inStock: Number(value.inStock) };
    return value as Record<string, SQLInputValue>;
  }
}
