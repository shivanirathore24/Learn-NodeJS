export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    // 1. Get cartitems and calculate total amount.
    // 2. Create an order record.
    // 3. Reduce the stock.
    // 4. Clear the cart items.
  }
}
