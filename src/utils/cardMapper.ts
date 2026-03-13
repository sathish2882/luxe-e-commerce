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

export const formatOneProduct = (product: any) => {
  return ({
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
  })
};

export const formatCategory = (data: any[]) => {
  return data.map((item) => ({
    name: item.name,
    parentId: item.parent_id,
    status: item.active,
    updatedAt: item.updated_at,
    categoriesId: item.categories_id,
    imageUrl: item.image_url,
    createdBy: item.created_by,
  }));
};
