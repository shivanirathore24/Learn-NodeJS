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

  static get(userID) {
    return cartItems.filter((i) => i.userID == userID);
  }
}

var cartItems = [
  new CartItemsModel(1, 1, 2, 4),
  new CartItemsModel(2, 1, 1, 3),
];
