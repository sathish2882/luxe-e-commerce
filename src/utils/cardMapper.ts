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