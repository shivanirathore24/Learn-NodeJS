export default class CartItemsModel {
  constructor(id, productID, userID, quantity) {
    this.id = id;
    this.productID = productID;
    this.userID = userID;
    this.quantity = quantity;
  }

  static add(productID, userID, quantity) {
    const cartItem = new CartItemsModel(
      cartItems.length + 1,
      productID,
      userID,
      quantity
    );
    cartItems.push(cartItem);
    return cartItem;
  }
}

var cartItems = [new CartItemsModel(1, 2, 1, 3)];

