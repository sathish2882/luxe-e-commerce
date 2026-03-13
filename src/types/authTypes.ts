export interface Product {
  productId: number;
  productName: string;
  price: number;
  categoryName: string;
  imageUrl: string;
  discountPercent: number;
  totalReviews: number;
  rating: number;
  description: string;
  sku: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  tag: string
}

export interface Category {
  name: string;
  parentId: number;
  status: boolean;
  updatedAt: string;
  categoriesId: number;
  imageUrl: string;
  createdBy: string;
}
