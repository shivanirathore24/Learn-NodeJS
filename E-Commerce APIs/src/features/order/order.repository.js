import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../../config/mongodb.js";
import OrderModel from "../order/order.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    const client = getClient();
    const session = client.startSession();
    try {
      const db = getDB();
      session.startTransaction();

      // 1. Get cartitems and calculate total amount.
      const items = await this.getTotalAmount(userId, session);
      const finalTotalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      console.log("Final total amount:", finalTotalAmount);

      // 2. Create an order record.
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalTotalAmount,
        new Date()
      );
      await db.collection(this.collection).insertOne(newOrder, { session });

      // 3. Reduce the stock.
      for (let item of items) {
        await db.collection("products").updateOne(
          {
            _id: item.productID,
          },
          {
            $inc: { stock: -item.quantity },
          },
          { session }
        );
      }
      //throw new Error("Something is wrong in PlaceOrder");

      // 4. Clear the cart items.
      await db.collection("cartItems").deleteMany(
        {
          userID: new ObjectId(userId),
        },
        { session }
      );

      await session.commitTransaction();
      return;
    } catch (err) {
      await session.abortTransaction();
      console.log(err);
      throw new ApplicationError(`Order Failed !`, 500);
    } finally {
      session.endSession();
    }
  }

  async getTotalAmount(userId, session) {
    const db = getDB();

    const items = await db
      .collection("cartItems")
      .aggregate(
        [
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
        ],
        { session }
      )
      .toArray();

    console.log(items);
    return items;
  }
}
