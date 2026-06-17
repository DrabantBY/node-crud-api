export interface ProductBody {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

export interface Product extends ProductBody {
  id: string;
}

export interface ProductDbState {
  fetchAll(): Promise<Product[]>;
  fetchOne(id: string): Promise<Product | null>;
  insertOne(body: ProductBody): Promise<Product>;
  upsertOne(id: string, body: Partial<ProductBody>): Promise<Product | null>;
  deleteOne(id: string): Promise<boolean>;
}
