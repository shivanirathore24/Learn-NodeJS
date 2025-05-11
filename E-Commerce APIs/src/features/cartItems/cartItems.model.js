export default class CartItemsModel {
  constructor(id, productID, userID, quantity) {
    this.id = id;
    this.productID = productID;
    this.userID = userID;
    this.quantity = quantity;
  }

  /*
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

  static delete(cartItemID, userID) {
    const cartItemIndex = cartItems.findIndex(
      (i) => i.id == cartItemID && i.userID == userID
    );
    if (!cartItemIndex == -1) {
      return "Item not found!";
    } else {
      cartItems.splice(cartItemIndex, 1);
    }
  }
    */
}

/*
var cartItems = [
  new CartItemsModel(1, 1, 2, 4),
  new CartItemsModel(2, 1, 1, 3),
];
*/
