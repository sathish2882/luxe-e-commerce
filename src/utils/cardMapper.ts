export const mapCartApiToClient = (data: any[]) => {
  return data.map((item) => ({
    userId: item.user_id,
    productId: item.product_id,
    productName: item.product_name,
    categoryName: item.category_name,
    quantity: item.quantity,
    price: item.price,
    discountPercent: item.discount_percent,
    imageUrl: item.image_url,
  }));
};

export const formatProducts = (data: any[]) => {
  return data.map((product) => ({
    categoryName: product.category_name,

    createdAt: product.createdat,

    createdBy: product.createdby,

    description: product.description,

    discountPercent: product.discount_percent,

    imageUrl: product.image_url,

    price: product.price,

    totalReviews: product.total_reviews,

    rating: product.rating,

    productId: product.product_id,

    productName: product.product_name,

    sku: product.sku,

    status: product.status,

    tag: product.tag,

    updatedAt: product.updatedat,
  }));
};

export const formatProductIds = (data: any[]) => {
  return data.map((product) => ({
    productId: product.product_id,

    productName: product.product_name,
  }));
};

export const formatOneProduct = (product: any) => {
  return {
    categoryName: product.category_name,

    createdAt: product.createdat,

    createdBy: product.createdby,

    description: product.description,

    discountPercent: product.discount_percent,

    imageUrl: product.image_url,

    price: product.price,

    totalReviews: product.total_reviews,

    rating: product.rating,

    productId: product.product_id,

    productName: product.product_name,

    sku: product.sku,

    status: product.status,

    tag: product.tag,

    updatedAt: product.updatedat,
  };
};

export const formatCategory = (data: any[]) => {
  return data.map((item) => ({
    name: item.name,
    parentId: item.parent_id,
    status: item.status,
    updatedAt: item.updated_at,
    categoriesId: item.categories_id,
    imageUrl: item.image_url,
    createdBy: item.created_by,
  }));
};

export const formatAddress = (data: any[]) => {
  return data.map((item) => ({
    id: item.id,
    userId: item.user_id,
    addressLine1: item.address_line1,
    addressLine2: item.address_line2,
    city: item.city,
    state: item.state,
    country: item.country,
    pincode: item.pincode,
    isDefault: item.isdefault,
  }));
};

export const formatOrders = (data: any[]) => {
  return data.map((item) => ({
    orderId: item.order_id,
    shippingAddress: item.shipping_address,
    status: item.status,
    updatedAt: item.updated_at,
    userId: item.user_id,
    totalPrice: item.total_price,
    orderStatus: item.order_status,
    createdAt: item.created_at,
    createdBy: item.created_by,
  }));
};

export const formatOrderItems = (data: any[]) => {
  return data.map((item) => ({
    orderItemsId: item.orderitems_id,
    orderId: item.order_id,
    productId: item.product_id,
    productName: item.product_name,
    imageUrl: item.image_url,
    category: item.category,
    price: item.price,
    quantity: item.quantity,
    totalPrice: item.total_price,
  }));
};
