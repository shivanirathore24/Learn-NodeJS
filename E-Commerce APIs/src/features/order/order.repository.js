import { ObjectId } from "mongodb";
import { getDB } from "../../../config/mongodb.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    // 1. Get cartitems and calculate total amount.
    await this.getTotalAmount(userId);
    // 2. Create an order record.
    // 3. Reduce the stock.
    // 4. Clear the cart items.
  }
  async getTotalAmount(userId) {
    const db = getDB();

    const items = await db
      .collection("cartItems")
      .aggregate([
        // 1. Filter cart items for the specific user
        {
          $match: { userID: new ObjectId(userId) },
        },
        // 2. Join with the 'products' collection to get product details
        {
          $lookup: {
            from: "products",
            localField: "productID",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        // 3️. Unwind the productInfo array to make it a flat object
        {
          $unwind: "$productInfo",
        },
        // 4️. Add a new field 'totalAmount' = price * quantity
        {
          $addFields: {
            totalAmount: {
              $multiply: ["$productInfo.price", "$quantity"],
            },
          },
        },
      ])
      .toArray();

    console.log(items);
    // console.log("Individual productInfo objects:");
    // items.forEach((item) => {
    //   console.log(item.productInfo);
    // });

    // Calculate the grand total amount for the entire cart
    const finalTotalAmount = items.reduce(
      (acc, item) => acc + item.totalAmount,
      0
    );
    console.log("Total amount for user's cart:", finalTotalAmount);
  }
}
