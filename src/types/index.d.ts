export interface ProductType {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

export interface CategoryType {
  name: string;
  description?: string;
  imageUrl?: string;
}
