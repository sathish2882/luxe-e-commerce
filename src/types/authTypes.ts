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
  tag: string;
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

export interface AddressFields {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}

export interface MyAddress {
  id: number;
  userId: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}

export interface MyOrders {
  orderId: number;
  shippingAddress: number;
  status: string;
  updatedAt: string;
  userId: number;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
  createdBy: string;
}
