import CartItemsModel from "./cartItems.model.js";
export class CartItemsController {
  add(req, res) {
    //const { productID, quantity } = req.query;
    /* Query parameters in req.query are always strings */
    const productID = Number(req.query.productID);
    const quantity = Number(req.query.quantity);
    const userID = req.userID;
    CartItemsModel.add(productID, userID, quantity);
    res.status(201).send("Cart is updated !");
  }

  get(req, res) {
    const userID = req.userID;
    const items = CartItemsModel.get(userID);
    return res.status(200).send(items);
  }
}
