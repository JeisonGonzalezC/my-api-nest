export interface IProductFilter {
  page?: number;
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface IProductItem {
  id: string;
  contentfulId: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
}

export interface IProductResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  count: number;
  products: IProductItem[];
}
