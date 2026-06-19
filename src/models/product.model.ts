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
