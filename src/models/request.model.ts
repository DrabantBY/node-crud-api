import type { ProductBody } from "./product.model.js";

export interface ParamsId {
  Params: Record<"id", string>;
}

export interface ParamsBody {
  Body: ProductBody;
}

export interface RequestParams extends ParamsId {
  Body: Partial<ProductBody>;
}
